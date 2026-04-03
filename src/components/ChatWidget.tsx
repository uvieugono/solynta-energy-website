"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://solyntaflow.uc.r.appspot.com";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ContactInfo { name: string; phone: string; }
type ChatView = "capture" | "chat";

interface SummaryPayload {
  session_id: string | null;
  contact: ContactInfo | null;
  source_url: string;
  started_at: string;
  ended_at: string;
  message_count: number;
  messages: { role: "user" | "assistant"; content: string; timestamp: string }[];
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm the Solynta Energy AI assistant. I can help you choose a solar package, answer questions about our services, or assist existing customers. How can I help?",
  timestamp: "",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hasOpened, setHasOpened] = useState(false);
  const [view, setView] = useState<ChatView>("capture");
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [captureName, setCaptureName] = useState("");
  const [capturePhone, setCapturePhone] = useState("");
  const [captureErrors, setCaptureErrors] = useState({ name: "", phone: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const captureNameRef = useRef<HTMLInputElement>(null);
  const contactSent = useRef(false);
  const isCapturingRef = useRef(false);
  const startedAtRef = useRef<string | null>(null);
  const summarySentRef = useRef(false);
  const summarySliceIndexRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  const sessionIdRef = useRef<string | null>(null);
  const contactRef = useRef<ContactInfo | null>(null);
  const sourceUrlRef = useRef("");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && view === "capture") {
      setTimeout(() => captureNameRef.current?.focus(), 100);
    }
  }, [isOpen, view]);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { contactRef.current = contact; }, [contact]);

  const fetchSuggestions = useCallback(async () => {
    try {
      const sourceUrl = window.location.href;
      const res = await fetch(
        `${API_BASE}/api/customer-service/chat/suggestions/?source_url=${encodeURIComponent(sourceUrl)}`
      );
      if (!res.ok) return;
      const data = await res.json();
      const initial: string[] = data?.suggestions?.initial ?? [];
      setSuggestions(initial);
    } catch {
      // Silently ignore suggestion fetch errors
    }
  }, []);

  const startChat = useCallback(() => {
    isCapturingRef.current = false;
    setView("chat");
    if (!startedAtRef.current) {
      startedAtRef.current = new Date().toISOString();
    }
    sourceUrlRef.current = window.location.href;
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([WELCOME_MESSAGE]);
      fetchSuggestions();
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [hasOpened, fetchSuggestions]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isCapturingRef.current) return;
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setSuggestions([]);

      try {
        const sourceUrl = window.location.href;
        const body: {
          message: string;
          source_url: string;
          session_id?: string;
          contact_name?: string;
          contact_phone?: string;
        } = {
          message: trimmed,
          source_url: sourceUrl,
        };
        if (sessionId) body.session_id = sessionId;
        if (contact && !contactSent.current) {
          body.contact_name = contact.name;
          body.contact_phone = contact.phone;
          contactSent.current = true; // set before fetch — intentional (see spec tradeoff)
        }

        const res = await fetch(`${API_BASE}/api/customer-service/chat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        const assistantMsg: Message = {
          role: "assistant",
          content: data.response ?? "I received your message.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.session_id) setSessionId(data.session_id);
        if (data.suggestions?.length) setSuggestions(data.suggestions);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I'm having trouble connecting. Please try again or call us at +234(0)705 300 8625.",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId, contact]
  );

  const openChat = useCallback(() => {
    const raw = localStorage.getItem("solynta_chat_contact");
    let parsed: ContactInfo | null = null;
    let isKnownVisitor = false;

    if (raw === "skipped") {
      isKnownVisitor = true;
    } else if (raw !== null) {
      try {
        const obj = JSON.parse(raw);
        if (typeof obj === "object" && obj !== null && typeof obj.name === "string" && typeof obj.phone === "string") {
          parsed = obj;
          isKnownVisitor = true;
        } else {
          // Unexpected shape — treat as absent
          localStorage.removeItem("solynta_chat_contact");
        }
      } catch {
        // Corrupt JSON — treat as absent
        localStorage.removeItem("solynta_chat_contact");
      }
    }

    if (!isKnownVisitor) {
      // First visit (or cleared/corrupt localStorage) — show capture screen
      isCapturingRef.current = true;
      setView("capture");
      setIsOpen(true);
      return;
    }

    // Returning visitor — skip capture, go straight to chat
    if (parsed) setContact(parsed);
    setIsOpen(true);
    startChat();
  }, [startChat]);

  const handleCaptureSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errors = { name: "", phone: "" };
      if (!captureName.trim()) {
        errors.name = "Please enter your name.";
      }
      const phoneTrimmed = capturePhone.trim();
      if (!phoneTrimmed) {
        errors.phone = "Please enter your phone number.";
      } else if (!/^\+?[\d ()\-.]{7,}$/.test(phoneTrimmed)) {
        errors.phone = "Please enter a valid phone number (e.g. 0705 300 8625).";
      }
      if (errors.name || errors.phone) {
        setCaptureErrors(errors);
        return;
      }
      const info: ContactInfo = { name: captureName.trim(), phone: phoneTrimmed };
      localStorage.setItem("solynta_chat_contact", JSON.stringify(info));
      setContact(info);
      startChat();
    },
    [captureName, capturePhone, startChat]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      openChat();
      if (customEvent.detail?.message) {
        // Slight delay to let the chat window render first
        setTimeout(() => sendMessage(customEvent.detail.message), 300);
      }
    };
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, [openChat, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button (shown when closed) */}
      {!isOpen && (
        <button
          onClick={openChat}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-solynta-yellow shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center group"
        >
          {/* Chat bubble icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-solynta-slate"
          >
            <path
              fillRule="evenodd"
              d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
              clipRule="evenodd"
            />
          </svg>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-solynta-yellow opacity-30 animate-ping" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-full sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[500px] z-50 flex flex-col rounded-none sm:rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-solynta-slate flex items-center justify-between px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-solynta-yellow animate-pulse" />
              <span className="text-white font-semibold text-sm">Solynta Energy</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white/70 hover:text-white transition-colors p-1 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Capture screen or messages area */}
          {view === "capture" ? (
            <form
              onSubmit={handleCaptureSubmit}
              className="flex-1 flex flex-col justify-center px-5 py-6 gap-4 bg-gray-50"
            >
              <div>
                <p className="text-lg font-semibold text-solynta-slate">👋 Before we start</p>
                <p className="text-sm text-solynta-grey mt-1">
                  Leave your details so we can follow up if we get cut off.
                </p>
              </div>

              <div>
                <input
                  ref={captureNameRef}
                  type="text"
                  placeholder="Full Name"
                  value={captureName}
                  onChange={(e) => {
                    setCaptureName(e.target.value);
                    if (captureErrors.name) setCaptureErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="border border-border rounded-lg px-3 py-2 text-solynta-slate text-sm focus:outline-none focus:border-solynta-yellow bg-white w-full"
                />
                {captureErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{captureErrors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={capturePhone}
                  onChange={(e) => {
                    setCapturePhone(e.target.value);
                    if (captureErrors.phone) setCaptureErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className="border border-border rounded-lg px-3 py-2 text-solynta-slate text-sm focus:outline-none focus:border-solynta-yellow bg-white w-full"
                />
                {captureErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">{captureErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-solynta-yellow text-solynta-slate font-semibold w-full py-2 rounded-lg hover:brightness-95 transition-all text-sm"
              >
                Start Chatting →
              </button>

            </form>
          ) : (
            <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3 space-y-3 chat-scroll">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-solynta-yellow/20 text-solynta-slate border border-solynta-yellow/40 rounded-br-sm"
                        : "bg-white text-solynta-slate border border-gray-200 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm shadow-sm px-4 py-3 flex gap-1 items-center">
                    <span
                      className="w-2 h-2 rounded-full bg-solynta-grey animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-solynta-grey animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-solynta-grey animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Suggestion chips */}
          {view === "chat" && suggestions.length > 0 && !loading && (
            <div className="bg-gray-50 border-t border-gray-100 px-3 py-2 shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-1 chat-scroll">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="shrink-0 text-xs border border-solynta-yellow text-solynta-slate rounded-full px-3 py-1.5 hover:bg-solynta-yellow/20 transition-colors whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          {view === "chat" && (
            <form
              onSubmit={handleSubmit}
              className="bg-white border-t border-gray-200 px-3 py-2.5 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                disabled={loading}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-solynta-yellow transition-colors disabled:opacity-50 text-solynta-slate placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 rounded-lg bg-solynta-yellow text-solynta-slate flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

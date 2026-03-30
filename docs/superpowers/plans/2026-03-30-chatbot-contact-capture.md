# Chatbot Pre-Chat Contact Capture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-time pre-chat capture screen to `ChatWidget` that collects the user's name and phone number before the conversation begins, stores them in `localStorage`, and attaches them to the first message payload for the backend Slack notification.

**Architecture:** All changes are confined to `src/components/ChatWidget.tsx`. A new `view` state (`"capture" | "chat"`) routes the widget body between the contact form and the existing conversation UI. `isCapturingRef` is a `useRef<boolean>` that mirrors `view`: it is `true` whenever `view === "capture"` and `false` whenever `view === "chat"`. This invariant is maintained by every path that sets `view`, allowing `sendMessage()` to guard against the capture state without stale closure issues. `contactSent` is a `useRef<boolean>` that ensures contact fields are only attached to the first message POST payload.

**Tech Stack:** React 19, TypeScript 5, Tailwind CSS 4, Next.js 16 — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-03-30-chatbot-contact-capture-design.md`

---

## File Map

| File | Action |
|------|--------|
| `src/components/ChatWidget.tsx` | Modify — all changes live here |

**Task order matters:** `startChat` (Task 2) must be defined before `openChat` (Task 3), because `openChat` calls `startChat` for the returning-visitor path.

---

### Task 1: Add types, state, refs, and autofocus effect

**Files:**
- Modify: `src/components/ChatWidget.tsx`

- [ ] **Step 1: Add `ContactInfo` and `ChatView` after the `Message` interface (after line 10)**

Current code at lines 7–10:
```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}
```

Add immediately after:
```typescript
interface ContactInfo { name: string; phone: string; }
type ChatView = "capture" | "chat";
```

- [ ] **Step 2: Add new state inside the component after the `hasOpened` state (line 25)**

Current code at line 25:
```typescript
const [hasOpened, setHasOpened] = useState(false);
```

Add immediately after:
```typescript
const [view, setView] = useState<ChatView>("capture");
const [contact, setContact] = useState<ContactInfo | null>(null);
const [captureName, setCaptureName] = useState("");
const [capturePhone, setCapturePhone] = useState("");
const [captureErrors, setCaptureErrors] = useState({ name: "", phone: "" });
```

Note: `view` defaults to `"capture"` — self-documenting. The value is always overwritten by `openChat()` before `isOpen` becomes `true`, so the default never surfaces to the user.

- [ ] **Step 3: Add three new refs after `inputRef` (line 28)**

Current code at line 28:
```typescript
const inputRef = useRef<HTMLInputElement>(null);
```

Add immediately after:
```typescript
const captureNameRef = useRef<HTMLInputElement>(null);
const contactSent = useRef(false);
const isCapturingRef = useRef(false);
```

- `captureNameRef` — auto-focuses the name field when capture screen appears
- `contactSent` — `true` after contact fields have been sent once; prevents duplicate Slack pings
- `isCapturingRef` — synchronous guard for `sendMessage()`; mirrors the `view` state but avoids stale closure issues

- [ ] **Step 4: Add autofocus `useEffect` after the scroll `useEffect` (after line 36)**

Current code at lines 34–36:
```typescript
useEffect(() => {
  scrollToBottom();
}, [messages, loading, scrollToBottom]);
```

Add immediately after:
```typescript
useEffect(() => {
  if (isOpen && view === "capture") {
    setTimeout(() => captureNameRef.current?.focus(), 100);
  }
}, [isOpen, view]);
```

- [ ] **Step 5: Run dev server — confirm no TypeScript errors**

```bash
npm run dev
```

Expected: compiles cleanly. The new state/refs are unused for now — TypeScript will not error on that.

- [ ] **Step 6: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): add contact capture types, state, and refs"
```

---

### Task 2: Add `startChat()` helper

**Files:**
- Modify: `src/components/ChatWidget.tsx`

`startChat()` is the shared transition logic from the capture screen to the conversation. Both `openChat()` (returning-visitor path) and the submit/skip handlers call it. It sets `isCapturingRef.current = false`, transitions `view` to `"chat"`, triggers the welcome message + suggestions on first open (guarded by `hasOpened`), and focuses the chat input.

**Important constraint:** `startChat()` does NOT call `setIsOpen(true)`. It assumes `isOpen` is already `true` — guaranteed because `openChat()` always sets `setIsOpen(true)` before any path that leads to `startChat()` being called (either directly for returning visitors, or after the capture form is shown for first-timers).

Add `startChat` immediately after `fetchSuggestions` (after line 51) and before `sendMessage`.

- [ ] **Step 1: Add `startChat` callback**

```typescript
const startChat = useCallback(() => {
  isCapturingRef.current = false;
  setView("chat");
  if (!hasOpened) {
    setHasOpened(true);
    setMessages([WELCOME_MESSAGE]);
    fetchSuggestions();
  }
  setTimeout(() => inputRef.current?.focus(), 100);
}, [hasOpened, fetchSuggestions]);
```

- [ ] **Step 2: Run dev server, confirm no TypeScript errors**

```bash
npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): add startChat transition helper"
```

---

### Task 3: Refactor `openChat()` with localStorage routing

**Files:**
- Modify: `src/components/ChatWidget.tsx`

The new `openChat()` reads `localStorage` to decide which view to show. First-timers (key absent or corrupt) go to the capture screen. Returning visitors (key = JSON object or `"skipped"`) go straight to chat via `startChat()`.

Important: `hasOpened` must NOT be set when routing to capture — `startChat()` handles that when the user submits or skips.

- [ ] **Step 1: Replace the entire `openChat` function**

Match this exact code to find and replace it:
```typescript
const openChat = useCallback(() => {
  setIsOpen(true);
  if (!hasOpened) {
    setHasOpened(true);
    setMessages([WELCOME_MESSAGE]);
    fetchSuggestions();
  }
  setTimeout(() => inputRef.current?.focus(), 100);
}, [hasOpened, fetchSuggestions]);
```

Replace with:
```typescript
const openChat = useCallback(() => {
  const raw = localStorage.getItem("solynta_chat_contact");
  let parsed: ContactInfo | null = null;
  let isKnownVisitor = false;

  if (raw === "skipped") {
    isKnownVisitor = true;
  } else if (raw !== null) {
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj.name === "string" && typeof obj.phone === "string") {
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
```

Note: the returning-visitor path calls `startChat()` (no duplication). `hasOpened` and `fetchSuggestions` are no longer direct deps of `openChat` — they're captured inside `startChat`.

- [ ] **Step 2: Run dev server, confirm no TypeScript errors**

```bash
npm run dev
```

- [ ] **Step 3: Smoke test the localStorage routing in the browser**

1. Open `http://localhost:3000`
2. Clear localStorage: run `localStorage.clear()` in DevTools console
3. Click the chat button — chat opens (capture screen JSX comes in Task 6; for now, old messages area shows — this is expected)
4. Run `localStorage.setItem("solynta_chat_contact", "skipped")`, close and reopen → welcome message appears ✓
5. Run `localStorage.setItem("solynta_chat_contact", JSON.stringify({name:"Test",phone:"0705300"}))`, close and reopen → welcome message, contact hydrated ✓
6. Run `localStorage.setItem("solynta_chat_contact", "{bad json")`, close and reopen → chat opens normally (corrupt key deleted) ✓
7. Clear localStorage: `localStorage.clear()`

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): refactor openChat with localStorage routing"
```

---

### Task 4: Add `handleCaptureSubmit()` and `handleSkip()`

**Files:**
- Modify: `src/components/ChatWidget.tsx`

These are the two user actions on the capture screen. Both call `startChat()`. Submit validates first.

Add both immediately after `openChat`.

- [ ] **Step 1: Add `handleCaptureSubmit`**

```typescript
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
```

- [ ] **Step 2: Add `handleSkip` immediately after `handleCaptureSubmit`**

```typescript
const handleSkip = useCallback(() => {
  localStorage.setItem("solynta_chat_contact", "skipped");
  startChat();
}, [startChat]);
```

- [ ] **Step 3: Run dev server, confirm no TypeScript errors**

```bash
npm run dev
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): add handleCaptureSubmit and handleSkip"
```

---

### Task 5: Guard `sendMessage()` and attach contact to first message payload

**Files:**
- Modify: `src/components/ChatWidget.tsx`

Two changes to `sendMessage`:
1. `isCapturingRef.current` guard at the very top — blocks the 300ms auto-send from the `"open-chat"` custom event when the capture screen is visible. Using a ref (not state) avoids stale closure issues.
2. Attach `contact_name`/`contact_phone` to the POST body on the first message only. `contactSent.current` is set to `true` **before** the fetch — intentional. See spec tradeoff: if the request fails, contact fields are not retried to avoid duplicate Slack pings.

- [ ] **Step 1: Replace the entire `sendMessage` function**

Match this exact opening to find it:
```typescript
const sendMessage = useCallback(
  async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
```

Replace the entire function with:
```typescript
const sendMessage = useCallback(
  async (text: string) => {
    if (isCapturingRef.current) return;
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
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
        },
      ]);
    } finally {
      setLoading(false);
    }
  },
  [loading, sessionId, contact]
);
```

- [ ] **Step 2: Run dev server, confirm no TypeScript errors**

```bash
npm run dev
```

- [ ] **Step 3: Verify the guard via DevTools**

1. Clear localStorage, open chat
2. Open DevTools → Network tab
3. Run in console: `window.dispatchEvent(new CustomEvent("open-chat", { detail: { message: "hello" } }))`
4. Confirm: no request to `/api/customer-service/chat/` fires (guard blocked it) ✓

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): guard sendMessage during capture, attach contact to first payload"
```

---

### Task 6: Add capture screen JSX and hide chat-only UI during capture

**Files:**
- Modify: `src/components/ChatWidget.tsx`

Replace the messages area `<div>` with a conditional that renders either the capture form or the conversation. Also hide suggestion chips and the input form when `view === "capture"`. Match all code changes by content string, not line number — earlier tasks have shifted line positions.

- [ ] **Step 1: Replace the messages area block with a conditional**

Find this opening comment and its entire block down to and including `<div ref={messagesEndRef} />`:
```tsx
{/* Messages area */}
<div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3 space-y-3 chat-scroll">
```

Replace the entire messages area block with:
```tsx
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

    <button
      type="button"
      onClick={handleSkip}
      className="text-sm text-solynta-grey underline cursor-pointer text-center"
    >
      Skip for now
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
```

- [ ] **Step 2: Add `view === "chat" &&` guard to the suggestion chips block**

Find this exact opening:
```tsx
{suggestions.length > 0 && !loading && (
```

Change to:
```tsx
{view === "chat" && suggestions.length > 0 && !loading && (
```

- [ ] **Step 3: Wrap the input form with a `view === "chat"` guard**

Find the input form's opening tag:
```tsx
<form
  onSubmit={handleSubmit}
  className="bg-white border-t border-gray-200 px-3 py-2.5 flex items-center gap-2 shrink-0"
>
```

Replace the entire form block (from `<form` to its closing `</form>`) with the following — all existing children are preserved unchanged, the only change is the wrapping conditional:
```tsx
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
```

- [ ] **Step 4: Run dev server and full visual check**

```bash
npm run dev
```

1. Open `http://localhost:3000`, clear localStorage
2. Click chat button → capture screen appears, name field is auto-focused ✓
3. Click "Start Chatting →" with empty fields → both error messages appear in red ✓
4. Enter name "Test", phone "abc" → phone error only ✓
5. Enter name "Test", phone "07053008625" → transitions to welcome message ✓
6. DevTools → Application → Local Storage → `solynta_chat_contact` = `{"name":"Test","phone":"07053008625"}` ✓
7. Close (X) and reopen → no capture screen, prior conversation shown ✓
8. Hard refresh (`Ctrl+Shift+R`), reopen → no capture screen, fresh welcome message ✓
9. `localStorage.clear()`, reopen → capture screen again ✓
10. Click "Skip for now" → transitions to welcome message, `solynta_chat_contact` = `"skipped"` ✓

- [ ] **Step 5: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): add capture screen JSX and hide chat-only UI during capture"
```

---

### Task 7: End-to-end verification against all acceptance criteria

No code changes. Manual verification only. Use DevTools → Network tab to inspect POST bodies.

- [ ] **AC1 — First open shows capture screen**

`localStorage.clear()`, open chat → capture screen shown, name field focused. ✓

- [ ] **AC2 — Submit valid details → contact attached to first message**

Clear localStorage, open chat, enter name + valid phone, click "Start Chatting →". Confirm:
- Welcome message appears ✓
- `localStorage.getItem("solynta_chat_contact")` is a JSON object ✓
- Send a message → Network tab → POST body includes `contact_name` and `contact_phone` ✓

- [ ] **AC3 — Skip → no contact fields in payload**

Clear localStorage, open chat, click "Skip for now". Confirm:
- Welcome message appears ✓
- `localStorage.getItem("solynta_chat_contact")` = `"skipped"` ✓
- Send a message → Network tab → POST body has NO `contact_name` or `contact_phone` ✓

- [ ] **AC4 — Close and reopen same session**

After any conversation: click X to close, click chat button to reopen → no capture screen, prior conversation visible ✓

- [ ] **AC5 — Refresh + reopen**

After submitting contact details: hard refresh (`Ctrl+Shift+R`), open chat → no capture screen, welcome message shown fresh ✓

- [ ] **AC6 — Invalid inputs blocked**

Clear localStorage, open chat. Test each case:
- Submit empty → both errors shown ✓
- Enter name only, submit → phone error only ✓
- Enter phone `abc`, submit → phone error ✓
- Enter phone `070530` (6 characters — boundary case) → phone error ✓
- Enter phone `0705300` (7 characters — boundary case) → passes ✓
- Enter phone `+234 705 300 8625` → passes ✓

- [ ] **AC7 — Second message has no contact fields**

After AC2: send message 1 → Network shows `contact_name`, `contact_phone`. Send message 2 → Network shows neither. ✓

- [ ] **AC8 — Package card "Get Started" on first visit**

Clear localStorage. Navigate to the packages section, click a "Get Started" button. Confirm:
- Capture screen appears ✓
- No message auto-sends while capture screen is open ✓
- Submit or skip → chat proceeds normally ✓

- [ ] **AC9 — Cleared localStorage = first open**

Mid-session: `localStorage.clear()`, close chat, reopen → capture screen again ✓

- [ ] **Final commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): pre-chat contact capture — verified complete"
```

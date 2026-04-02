# Chatbot → SolyntaFlow Summary Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Push a structured interaction summary to SolyntaFlow's Customer Service module after every chat session.

**Architecture:** All changes live in `src/components/ChatWidget.tsx`. Summary is built from refs (not state) and sent via `fetch()` on widget close or `navigator.sendBeacon()` on page unload. A `summarySent` ref prevents duplicates. A `summarySliceIndex` ref tracks which messages have been summarized to support reopen-after-send.

**Tech Stack:** React 19, TypeScript, Next.js 16, native `fetch` and `navigator.sendBeacon`

**Spec:** `docs/superpowers/specs/2026-04-02-chatbot-solyntaflow-summary-design.md`

---

### Task 1: Add `timestamp` to the `Message` interface and all message creation sites

**Files:**
- Modify: `src/components/ChatWidget.tsx:7-10` (Message interface)
- Modify: `src/components/ChatWidget.tsx:15-19` (WELCOME_MESSAGE constant)
- Modify: `src/components/ChatWidget.tsx:87` (user message creation in sendMessage)
- Modify: `src/components/ChatWidget.tsx:121-124` (assistant message creation in sendMessage)
- Modify: `src/components/ChatWidget.tsx:130-136` (error fallback message in sendMessage)
- Modify: `src/components/ChatWidget.tsx:75` (WELCOME_MESSAGE insertion in startChat)

- [ ] **Step 1: Update the `Message` interface**

Add `timestamp` field:

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
```

- [ ] **Step 2: Update `WELCOME_MESSAGE` constant**

Add an empty-string timestamp (it will be filtered out by `buildSummary` anyway):

```typescript
const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm the Solynta Energy AI assistant. I can help you choose a solar package, answer questions about our services, or assist existing customers. How can I help?",
  timestamp: "",
};
```

- [ ] **Step 3: Add timestamp to user message creation in `sendMessage`**

At line 87, change:
```typescript
const userMsg: Message = { role: "user", content: trimmed };
```
to:
```typescript
const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
```

- [ ] **Step 4: Add timestamp to assistant message creation in `sendMessage`**

At line 121-124, change:
```typescript
const assistantMsg: Message = {
  role: "assistant",
  content: data.response ?? "I received your message.",
};
```
to:
```typescript
const assistantMsg: Message = {
  role: "assistant",
  content: data.response ?? "I received your message.",
  timestamp: new Date().toISOString(),
};
```

- [ ] **Step 5: Add timestamp to error fallback message in `sendMessage`**

At lines 130-136, change:
```typescript
setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content:
      "Sorry, I'm having trouble connecting. Please try again or call us at +234(0)705 300 8625.",
  },
]);
```
to:
```typescript
setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content:
      "Sorry, I'm having trouble connecting. Please try again or call us at +234(0)705 300 8625.",
    timestamp: new Date().toISOString(),
  },
]);
```

- [ ] **Step 6: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): add timestamp field to Message interface and all creation sites"
```

---

### Task 2: Add `SummaryPayload` type and new refs

**Files:**
- Modify: `src/components/ChatWidget.tsx:12-13` (after ContactInfo type, add SummaryPayload)
- Modify: `src/components/ChatWidget.tsx:38-39` (after existing refs, add new refs)

- [ ] **Step 1: Add `SummaryPayload` interface**

After the `ChatView` type (line 13), add:

```typescript
interface SummaryPayload {
  session_id: string | null;
  contact: ContactInfo | null;
  source_url: string;
  started_at: string;
  ended_at: string;
  message_count: number;
  messages: { role: "user" | "assistant"; content: string; timestamp: string }[];
}
```

- [ ] **Step 2: Add new refs inside the component**

After `isCapturingRef` (line 39), add:

```typescript
const startedAtRef = useRef<string | null>(null);
const summarySentRef = useRef(false);
const summarySliceIndexRef = useRef(0);
const messagesRef = useRef<Message[]>([]);
const sessionIdRef = useRef<string | null>(null);
const contactRef = useRef<ContactInfo | null>(null);
const sourceUrlRef = useRef("");
```

- [ ] **Step 3: Add ref-sync effects**

After the existing `useEffect` blocks (after line 53), add:

```typescript
useEffect(() => { messagesRef.current = messages; }, [messages]);
useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
useEffect(() => { contactRef.current = contact; }, [contact]);
```

- [ ] **Step 4: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no type errors. Refs are unused for now (no warnings since they're refs, not variables).

- [ ] **Step 5: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): add SummaryPayload type and summary-related refs"
```

---

### Task 3: Modify `startChat()` to set `startedAt` and `sourceUrlRef`

**Files:**
- Modify: `src/components/ChatWidget.tsx:70-79` (startChat callback)

- [ ] **Step 1: Update `startChat` to set refs**

Change `startChat` from:
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
to:
```typescript
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
```

- [ ] **Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): set startedAt and sourceUrl refs in startChat"
```

---

### Task 4: Implement `buildSummary()` and `sendSummary()`

**Files:**
- Modify: `src/components/ChatWidget.tsx` (add two new functions after `startChat`, before `sendMessage`)

- [ ] **Step 1: Add `buildSummary` function**

After `startChat` and before `sendMessage`, add:

```typescript
const buildSummary = useCallback((): SummaryPayload | null => {
  const allMessages = messagesRef.current;
  // Filter out welcome message and slice from last summary point
  const startIdx = summarySliceIndexRef.current;
  const segment = allMessages.slice(startIdx).filter(
    (msg) => msg.content !== WELCOME_MESSAGE.content || msg.role !== "assistant"
  );
  if (segment.length === 0) return null;

  const payload: SummaryPayload = {
    session_id: sessionIdRef.current,
    contact: contactRef.current,
    source_url: sourceUrlRef.current,
    started_at: startedAtRef.current ?? new Date().toISOString(),
    ended_at: new Date().toISOString(),
    message_count: segment.length,
    messages: segment.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    })),
  };

  // Truncate if payload exceeds 60KB (sendBeacon ~64KB limit)
  const serialized = JSON.stringify(payload);
  if (serialized.length > 60_000) {
    const maxContentLen = Math.max(
      Math.floor((60_000 / segment.length) - 100), // rough overhead per message
      50 // floor to avoid negative/zero values with very large conversations
    );
    payload.messages = segment.map((m) => ({
      role: m.role,
      content: m.content.length > maxContentLen
        ? m.content.slice(0, maxContentLen) + "…"
        : m.content,
      timestamp: m.timestamp,
    }));
  }

  return payload;
}, []);
```

- [ ] **Step 2: Add `sendSummary` function**

After `buildSummary`, add:

```typescript
const sendSummary = useCallback(async () => {
  if (summarySentRef.current) return;
  const payload = buildSummary();
  if (!payload) return;

  summarySentRef.current = true;
  summarySliceIndexRef.current = messagesRef.current.length;
  startedAtRef.current = null;

  try {
    await fetch(`${API_BASE}/api/customer-service/chat/summary/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Fire-and-forget — best effort
  }
}, [buildSummary]);
```

- [ ] **Step 3: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds (functions defined but not yet called).

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): implement buildSummary and sendSummary functions"
```

---

### Task 5: Wire up summary triggers — widget close, beforeunload, reopen reset

**Files:**
- Modify: `src/components/ChatWidget.tsx:261-264` (close button onClick)
- Modify: `src/components/ChatWidget.tsx` (add beforeunload useEffect)
- Modify: `src/components/ChatWidget.tsx:87-88` (sendMessage — reset summarySent on new message after send)

- [ ] **Step 1: Update the close button handler**

Find the close button (currently `onClick={() => setIsOpen(false)}`):

```tsx
<button
  onClick={() => setIsOpen(false)}
  aria-label="Close chat"
```

Change to:

```tsx
<button
  onClick={() => {
    void sendSummary();
    setIsOpen(false);
  }}
  aria-label="Close chat"
```

Note: `void` makes the fire-and-forget intent explicit. We do NOT `await` — that would block the UI on slow networks, making the close button feel broken. The `beforeunload` listener acts as a safety net if the fetch is aborted by unmount.

- [ ] **Step 2: Add `beforeunload` listener**

After the existing `useEffect` blocks for ref syncing, add:

```typescript
useEffect(() => {
  const handleBeforeUnload = () => {
    if (summarySentRef.current) return;
    const payload = buildSummary();
    if (!payload) return;

    summarySentRef.current = true;
    summarySliceIndexRef.current = messagesRef.current.length;

    navigator.sendBeacon(
      `${API_BASE}/api/customer-service/chat/summary/`,
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [buildSummary]);
```

- [ ] **Step 3: Reset `summarySent` on new message after send**

In `sendMessage`, right after the user message is added to state (the `setMessages` call with `userMsg`), add the reopen-after-send reset:

```typescript
const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
setMessages((prev) => [...prev, userMsg]);

// Reset summary guard if a new message arrives after a previous summary was sent
if (summarySentRef.current) {
  summarySentRef.current = false;
  startedAtRef.current = new Date().toISOString();
}
```

- [ ] **Step 4: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ChatWidget.tsx
git commit -m "feat(chatbot): wire summary triggers — close, beforeunload, reopen reset"
```

---

### Task 6: Manual end-to-end verification

**Files:** None (testing only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test widget-close summary**

1. Open the chat widget in the browser.
2. Complete the contact capture form (or skip if already done).
3. Send a message and wait for a response.
4. Open browser DevTools → Network tab.
5. Click the X button to close the widget.
6. Verify a POST request was made to `/api/customer-service/chat/summary/`.
7. Inspect the request payload — confirm it matches the spec schema (session_id, contact, source_url, started_at, ended_at, message_count, messages with timestamps).
8. Verify the welcome message is NOT in the payload.

- [ ] **Step 3: Test deduplication**

1. Reopen the widget (without refreshing).
2. Close it again without sending new messages.
3. Verify NO summary POST is made (dedup guard).

- [ ] **Step 4: Test reopen-after-send**

1. Reopen the widget.
2. Send a new message.
3. Close the widget.
4. Verify a NEW summary POST is made containing only the new message(s), not the ones from step 2.

- [ ] **Step 5: Test beforeunload**

1. Open the chat widget, send a message.
2. Without closing the widget, close the browser tab (or navigate away).
3. In DevTools, verify `sendBeacon` was called to the summary endpoint.
   (Note: `sendBeacon` requests may not appear in Network tab in all browsers. Check the server logs or use `navigator.sendBeacon` mock if needed.)

- [ ] **Step 6: Test no-chat scenario**

1. Open the widget.
2. Close it without sending any messages.
3. Verify NO summary POST is made.

- [ ] **Step 7: Commit final state (if any tweaks were needed)**

```bash
git add src/components/ChatWidget.tsx
git commit -m "fix(chatbot): address issues found during manual E2E testing"
```

(Skip this step if no changes were needed.)

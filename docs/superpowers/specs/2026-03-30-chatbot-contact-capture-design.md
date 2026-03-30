# Chatbot Pre-Chat Contact Capture — Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Scope:** `src/components/ChatWidget.tsx` only

---

## Problem

Users drop off mid-conversation without leaving contact details, making follow-up impossible. Capturing name and phone number upfront ensures the sales team can reach out even if the session ends prematurely.

---

## Decision

Add a pre-chat contact capture screen (Option A) that appears once per browser before the conversation begins. Users can skip it. Captured details are stored in `localStorage` and attached to the first outgoing chat message payload so the backend can include them in the Slack notification.

---

## State Machine

The widget gains a `ChatView` type and a `view` state:

```typescript
type ChatView = "capture" | "chat";
const [view, setView] = useState<ChatView>("capture"); // overwritten in openChat()
```

Note: the initial value is irrelevant because `view` is only consulted when `isOpen === true`, and `isOpen` starts `false`. Using `"capture"` as the default is self-documenting.

Contact info:

```typescript
interface ContactInfo { name: string; phone: string; }
const [contact, setContact] = useState<ContactInfo | null>(null);
```

**`localStorage` key:** `"solynta_chat_contact"`
- Value after submit: `JSON.stringify({ name, phone })`
- Value after skip: `"skipped"`

**On `openChat()`** — determine view before opening:
- Read `localStorage.getItem("solynta_chat_contact")`:
  - Key absent → `setView("capture")`
  - Key present, parses to an object with `name` and `phone` → hydrate `contact` state, `setView("chat")`, trigger welcome + suggestions (see `hasOpened` note below)
  - Key present, value is `"skipped"` → leave `contact` null, `setView("chat")`, trigger welcome + suggestions
  - Key present, JSON parse throws or result is unexpected shape → treat as absent, delete key, `setView("capture")`

**`hasOpened` interaction:**
The existing `hasOpened` guard ensures the welcome message and suggestions are only fetched once per session. When `view` is set to `"capture"`, `hasOpened` must NOT be set to `true` yet — that would suppress the welcome message when the user later submits or skips. The welcome message and `fetchSuggestions()` call must be triggered inside the submit/skip handlers directly (not delegated to `openChat()`), and `hasOpened` should be set to `true` at that point.

**On submit (capture form):**
1. Validate name and phone (see Validation); abort if invalid
2. `localStorage.setItem("solynta_chat_contact", JSON.stringify({ name, phone }))`
3. `setContact({ name, phone })`
4. `setView("chat")`
5. `setMessages([WELCOME_MESSAGE])`, `setHasOpened(true)`, call `fetchSuggestions()`
6. Focus the chat input field (100ms delay, consistent with existing `openChat()` behaviour)

**On skip:**
1. `localStorage.setItem("solynta_chat_contact", "skipped")`
2. Leave `contact` as null
3. `setView("chat")`
4. `setMessages([WELCOME_MESSAGE])`, `setHasOpened(true)`, call `fetchSuggestions()`
5. Focus the chat input field (100ms delay)

**`"open-chat"` custom event with pre-filled message:**
The existing event listener calls `openChat()` then dispatches a `sendMessage()` after 300ms. If `openChat()` sets `view = "capture"` (first visit), `sendMessage()` must be blocked while the capture screen is visible. The implementation guards `sendMessage()` using a `isCapturingRef` ref (`useRef<boolean>`) rather than reading `view` state directly. This avoids stale closure issues: the 300ms timer captures the `sendMessage` closure at dispatch time, before React has processed the `setView("capture")` update, so state-based checks would see the old value. `isCapturingRef.current` is set synchronously in `openChat()` before any React state updates, making the guard reliable. The pre-filled message will be dropped on first visit — the user lands on the capture screen and types their own message after. This is acceptable: the package card "Get Started" flow is a convenience, not a hard requirement, and the contact capture takes priority on first visit.

---

## UI — Capture Screen

Replaces the messages area when `view === "capture"`. Header is unchanged.

```
┌─ Header (unchanged) ──────────────────────┐
│                                            │
│  👋 Before we start                        │
│  Leave your details so we can follow up    │
│  if we get cut off.                        │
│                                            │
│  [ Full Name              ]  ← autofocus   │
│  [ Phone Number           ]                │
│                                            │
│  [ Start Chatting →       ]  (yellow btn)  │
│                                            │
│        Skip for now →                      │
│                                            │
└────────────────────────────────────────────┘
```

Focus lands on the Full Name field when the capture screen appears.

**Styling:**
- Inputs: `border border-border rounded-lg px-3 py-2 text-solynta-slate text-sm focus:outline-none focus:border-solynta-yellow bg-white w-full`
- Button: `bg-solynta-yellow text-solynta-slate font-semibold w-full py-2 rounded-lg hover:brightness-95 transition-all text-sm`
- Skip link: `text-sm text-solynta-grey underline cursor-pointer`
- Inline field errors: `text-xs text-red-500 mt-1`

---

## Validation

Client-side only. Runs on form submit; skip bypasses all validation.

| Field | Rule |
|-------|------|
| Name | Non-empty after `.trim()` |
| Phone | Non-empty after `.trim()` + matches `/^\+?[\d ()\-.]{7,}$/` |

The phone regex accepts digits, literal spaces, hyphens, dots, parentheses, and an optional leading `+` — covering Nigerian formats (`+234...`, `0705...`) and international variations. `\s` is deliberately avoided to exclude tabs and newlines, which are not valid phone input. Minimum 7 characters after the optional `+`.

Inline error text appears below the offending field. Submission is blocked until valid.

---

## Data Flow — First Message Payload

A `contactSent` ref tracks whether contact fields have been included:

```typescript
const contactSent = useRef(false);
```

On `sendMessage()`, if `contact !== null && !contactSent.current`:

```typescript
// POST /api/customer-service/chat/
{
  message: string;
  source_url: string;
  session_id?: string;
  contact_name: string;   // contact.name
  contact_phone: string;  // contact.phone
}
```

`contactSent.current` is set to `true` immediately before the fetch (not after).

**Deliberate tradeoff:** If the first message request fails (network error, API down), `contactSent.current` is already `true` so contact fields are not attached to the retry. This means the Slack notification may not include the lead's name and phone if the very first message errors. This is intentional — attaching contact fields on every retry would produce duplicate Slack pings for the same lead. The contact details are still stored in `localStorage` and will be present for the backend if the session resumes later via a different mechanism. This tradeoff was accepted at design time.

Subsequent messages omit `contact_name` and `contact_phone` entirely.

---

## Error Handling

- No async step on the capture screen — no loading state or error state needed there.
- First message error: existing fallback message behaviour is unchanged. Contact fields are not retried (see tradeoff above).
- `localStorage` parse errors or unexpected shape: catch, delete the key, treat as absent — show capture screen again.

---

## Acceptance Criteria

1. First open → capture screen shown before any messages.
2. Submit valid details → transitions to chat; welcome message shown; localStorage written; first message payload includes `contact_name` and `contact_phone`.
3. Skip → transitions to chat; welcome message shown; localStorage written as `"skipped"`; first message payload has no contact fields.
4. Close and reopen (same session) → capture screen skipped; existing conversation history is preserved (messages state is not reset on close); the prior conversation is shown, not a fresh welcome.
5. Refresh page and reopen → capture screen skipped; conversation history is lost (React state is gone); welcome message shown fresh on open.
6. Submit with empty name or invalid phone → inline error shown, no transition.
7. Second and subsequent messages → no contact fields in payload.
8. Package card "Get Started" on first visit → capture screen shown; pre-filled message is dropped; user proceeds normally after submitting or skipping.
9. User clears localStorage → treated identically to first open (AC1); this is intentional, not a bug.

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/ChatWidget.tsx` | Add `ChatView` type, `view` state, `contact` state, `contactSent` ref, capture screen JSX, validation logic, localStorage read/write/parse-error handling, `hasOpened` guard fix, `sendMessage()` view guard, updated first-message payload |

No new files. No other components modified.

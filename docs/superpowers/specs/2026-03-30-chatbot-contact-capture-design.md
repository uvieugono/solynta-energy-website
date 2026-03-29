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
const [view, setView] = useState<ChatView>("chat"); // set on openChat()
```

Contact info:

```typescript
interface ContactInfo { name: string; phone: string; }
const [contact, setContact] = useState<ContactInfo | null>(null);
```

**`localStorage` key:** `"solynta_chat_contact"`
- Value after submit: `JSON.stringify({ name, phone })`
- Value after skip: `"skipped"`

**On `openChat()`:**
- If `localStorage` key absent → `setView("capture")`
- If key present and value is an object → hydrate `contact` state, `setView("chat")`
- If key present and value is `"skipped"` → leave `contact` null, `setView("chat")`

**On submit (capture form):**
1. Validate name and phone (see Validation)
2. `localStorage.setItem("solynta_chat_contact", JSON.stringify({ name, phone }))`
3. `setContact({ name, phone })`
4. `setView("chat")`
5. Trigger welcome message + suggestions fetch (same as today's `openChat()` flow)

**On skip:**
1. `localStorage.setItem("solynta_chat_contact", "skipped")`
2. Leave `contact` as null
3. `setView("chat")`
4. Trigger welcome message + suggestions fetch

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
│  [ Full Name              ]                │
│  [ Phone Number           ]                │
│                                            │
│  [ Start Chatting →       ]  (yellow btn)  │
│                                            │
│        Skip for now →                      │
│                                            │
└────────────────────────────────────────────┘
```

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
| Phone | Non-empty after `.trim()` + matches `/\d{7,}/` (at least 7 digits) |

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

`contactSent.current` is set to `true` immediately before the fetch (not after), so retries on error do not re-send contact fields and do not produce duplicate Slack pings.

Subsequent messages omit `contact_name` and `contact_phone` entirely.

---

## Error Handling

- No async step on the capture screen — no loading state or error state needed there.
- First message error: existing fallback message behaviour is unchanged. Contact fields are not retried.
- `localStorage` parse errors (corrupted data): catch and treat as absent — show capture screen again.

---

## Acceptance Criteria

1. First open → capture screen shown before any messages.
2. Submit valid details → transitions to chat; localStorage written; first message payload includes `contact_name` and `contact_phone`.
3. Skip → transitions to chat; localStorage written as `"skipped"`; first message payload has no contact fields.
4. Close and reopen (same session) → capture screen skipped, goes straight to chat.
5. Refresh page and reopen → same as above (localStorage persists across sessions).
6. Submit with empty name or invalid phone → inline error shown, no transition.
7. Second and subsequent messages → no contact fields in payload.

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/ChatWidget.tsx` | Add `ChatView` type, `view` state, `contact` state, `contactSent` ref, capture screen JSX, validation logic, localStorage read/write, updated `sendMessage()` payload |

No new files. No other components modified.

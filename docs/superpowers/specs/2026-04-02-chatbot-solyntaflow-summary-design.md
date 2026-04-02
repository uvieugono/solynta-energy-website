# Chatbot → SolyntaFlow Customer Service Summary Integration

**Date:** 2026-04-02
**Status:** Approved

## Overview

After every chat interaction on www.solyntaenergy.com, the AI chatbot pushes a structured summary to the SolyntaFlow Customer Service module via a new API endpoint. This gives the CS team full visibility into every conversation — who chatted, what was discussed, and when.

## Approach

All summary logic lives in `ChatWidget.tsx` (Approach A — frontend-only). This follows the existing pattern where ChatWidget owns all chat logic and API calls inline. No new files, services, or abstractions.

## Summary Payload Schema

**Endpoint:** `POST ${API_BASE}/api/customer-service/chat/summary/`

```json
{
  "session_id": "abc-123",
  "contact": {
    "name": "John Doe",
    "phone": "+234 705 300 8625"
  },
  "source_url": "https://www.solyntaenergy.com/products/3kw-solar",
  "started_at": "2026-04-02T10:15:30.000Z",
  "ended_at": "2026-04-02T10:22:45.000Z",
  "message_count": 8,
  "messages": [
    {
      "role": "user",
      "content": "How much is the 3KW package?",
      "timestamp": "2026-04-02T10:15:45.000Z"
    },
    {
      "role": "assistant",
      "content": "The 3KW Solar Package is ₦2,850,000...",
      "timestamp": "2026-04-02T10:15:47.000Z"
    }
  ]
}
```

**Field notes:**
- `contact` is `null` if the user skipped capture (via `handleSkip`) or localStorage was corrupt.
- `session_id` is `null` if the first message never received a response (network failure before session established).
- `started_at` is set once inside `startChat()` (only if not already set). Both `handleCaptureSubmit` and `handleSkip` call `startChat()`, so this covers all entry paths.
- `ended_at` is captured at summary send time.
- `message_count` equals `messages.length` in the payload — i.e., the count for this summary segment, not the full conversation.
- `messages` excludes the initial welcome message (`WELCOME_MESSAGE`). The welcome message is a hardcoded assistant greeting injected client-side — it was never sent through the API and has no real timestamp. `buildSummary()` filters it out by excluding the first message if it matches `WELCOME_MESSAGE.content`.

## Trigger Logic & Deduplication

### Two trigger paths, one guard

1. **Widget close** (user clicks X) — sends summary via `fetch()` POST.
2. **Page unload** (`beforeunload` event) — sends summary via `navigator.sendBeacon()`.

### Deduplication

A `summarySent` ref flips to `true` after the first send attempt (optimistic — set before request completes to prevent double-send). Both paths check this ref before sending.

### When NOT to send

- `messages` array is empty (user opened widget but never chatted).
- `summarySent.current` is already `true`.
- `view` is still `"capture"` (user never got past the contact form).

### Lifecycle

```
User opens chat → startedAt ref set
  ↓
User chats (messages accumulate with timestamps)
  ↓
User closes widget (X button)
  → summarySent.current === false?
    → POST via fetch(), set summarySent = true
  ↓
  OR
  ↓
User closes tab / navigates away
  → beforeunload fires
  → summarySent.current === false?
    → sendBeacon(), set summarySent = true
```

### Reopen after send

If the user closes the widget (summary sent), reopens, and sends more messages, `summarySent.current` resets to `false` when a new message is added after a send. At the same point, `startedAt` is set to the new message's timestamp (giving the new segment a fresh start time). A `summarySliceIndex` ref tracks the index up to which messages have been summarized. On the next send, `buildSummary()` only includes messages from `summarySliceIndex` forward. This prevents re-sending previously summarized messages.

## Ref Strategy

Since `sendBeacon` fires during unload and can't read React state reliably, we mirror state into refs:

- `messagesRef` — mirrors `messages` state
- `sessionIdRef` — mirrors `sessionId` state
- `contactRef` — mirrors `contact` state
- `sourceUrlRef` — captures `window.location.href` when chat opens (avoids stale URL during `beforeunload`)
- `startedAt` ref — set once inside `startChat()` (only if not already set)
- `summarySent` ref — deduplication guard
- `summarySliceIndex` ref — tracks message index up to which messages have been summarized

This follows the existing pattern in ChatWidget (e.g., `isCapturingRef`).

## Implementation Changes to ChatWidget.tsx

### New refs

| Ref | Type | Purpose |
|-----|------|---------|
| `startedAt` | `string \| null` | ISO timestamp, set once in `startChat()` |
| `summarySent` | `boolean` | Deduplication guard |
| `summarySliceIndex` | `number` | Message index after last summarized message |
| `messagesRef` | `Message[]` | Mirror of messages state for sendBeacon |
| `sessionIdRef` | `string \| null` | Mirror of sessionId state for sendBeacon |
| `contactRef` | `ContactInfo \| null` | Mirror of contact state for sendBeacon |
| `sourceUrlRef` | `string` | Captures `window.location.href` at chat open |

### Message interface change

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;  // ISO 8601 — NEW
}
```

Timestamps set:
- **User messages:** `new Date().toISOString()` at send time.
- **Assistant messages:** `new Date().toISOString()` when API response is received.

Non-breaking change — chat UI rendering ignores fields it doesn't use.

### New type: `SummaryPayload`

A TypeScript interface matching the JSON schema from the payload section. Used as the return type for `buildSummary()`.

### New function: `buildSummary()`

Reads from refs (not state). Returns a `SummaryPayload` or `null` if no messages exist. Filters out the welcome message and slices from `summarySliceIndex` forward to avoid re-sending previously summarized messages. Reads `sourceUrlRef` for the URL (not `window.location.href`).

### New function: `sendSummary()`

- Calls `buildSummary()`, returns early if `null` or `summarySent.current === true`.
- POSTs via `fetch()` to `${API_BASE}/api/customer-service/chat/summary/`.
- Sets `summarySent.current = true` and updates `summarySliceIndex` to current messages length before the request (optimistic).
- Fire-and-forget: no error handling (best-effort).
- Both paths must ensure `Content-Type: application/json` — `fetch` sets it via headers, `sendBeacon` achieves it via a JSON `Blob` (see Backend Endpoint Spec).

### Modified: `startChat()`

- Sets `startedAt` ref to `new Date().toISOString()` (only if not already set).
- Sets `sourceUrlRef` to `window.location.href`.

### Modified: widget close handler

Calls `void sendSummary()` then immediately sets `isOpen = false`. The close must be instant — `await` would block the UI on slow networks, making the button feel broken. The `beforeunload` listener acts as a safety net if the fetch is aborted by unmount.

### New: `beforeunload` listener

- Registered in a `useEffect` on mount.
- Handler checks `summarySent.current`, builds summary, sends via `sendBeacon()` with JSON Blob.
- Cleaned up on unmount.

### Modified: message additions

Each message gets a `timestamp` field when added to state. `messagesRef.current` kept in sync.

### Estimated addition

~60-70 lines to ChatWidget.tsx.

## Backend Endpoint Spec

**`POST /api/customer-service/chat/summary/`**

### Request

- Content-Type: `application/json`
- Body: payload from Schema section above.

### Response

- `201 Created` — `{ "status": "received" }` (resource created — a new summary record)
- `400 Bad Request` — missing required fields (`messages` must be non-empty)
- `500 Internal Server Error` — server-side failure

### Authentication & rate limiting

The endpoint is unauthenticated, consistent with the existing chat endpoints. Backend should implement basic rate limiting (e.g., by IP or session_id) to prevent abuse.

### sendBeacon Content-Type

The Beacon API requires a `Blob` to send JSON with correct headers:

```typescript
navigator.sendBeacon(
  url,
  new Blob([JSON.stringify(summary)], { type: "application/json" })
);
```

This ensures the backend receives the same JSON format from both `fetch` and `sendBeacon` paths.

### Backend scope

This spec covers the endpoint contract. The actual backend implementation (storing summaries in the SolyntaFlow CS module database) follows from this contract but is out of scope for the frontend work.

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| User opens widget but never chats | No summary sent (`messages` empty) |
| User stuck on capture screen, closes tab | No summary sent (`view !== "chat"`) |
| Network failure on `fetch` send | Summary lost — acceptable (best-effort) |
| `sendBeacon` returns `false` | Summary lost — acceptable (rare, payload too large) |
| User closes widget then closes tab | Widget-close sends via `fetch`, `beforeunload` skips (dedup flag) |
| User refreshes page mid-chat | `beforeunload` fires, sends summary. New session starts fresh |
| Multiple rapid open/close cycles | First close sends, subsequent skip. Resets when new message added after send |
| `session_id` is null | Summary still sent — backend uses contact + messages |
| `contact` is null | Summary still sent with `contact: null` |
| Very long conversation (100+ msgs) | `sendBeacon` ~64KB limit. Estimate is ~300+ short messages, but long messages (pasted code, product descriptions) reduce this. If `buildSummary()` serialized payload exceeds 60KB, truncate individual message `content` fields to keep within limit. Fails silently if still exceeded — acceptable |

## Acceptance Criteria

1. Closing the chat widget after a conversation POSTs a summary to `/api/customer-service/chat/summary/`.
2. Closing the browser tab after a conversation sends the summary via `sendBeacon`.
3. Only one summary is sent per conversation segment (deduplication works).
4. No summary is sent if the user never chatted.
5. Reopening the widget and chatting more triggers a new summary on next close, containing only the new messages (not previously summarized ones).
6. All messages include ISO 8601 timestamps.
7. Contact info is included when available, `null` when not.
8. The payload matches the schema defined in this spec.

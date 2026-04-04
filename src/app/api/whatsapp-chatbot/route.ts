import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.API_BASE ?? "https://solyntaflow.uc.r.appspot.com";
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY ?? "";

// In-memory map: marketplace session_id → SolyntaFlow UUID session_id
// Note: resets on cold start, but SolyntaFlow will create a new session seamlessly.
const sessionMap = new Map<string, string>();

interface WhatsAppRequest {
  phone: string;
  name: string;
  message: string;
  message_type: string;
  media_url: string | null;
  session_id: string;
}

export async function POST(req: NextRequest) {
  // --- Auth ---
  const authHeader = req.headers.get("authorization");
  if (!WHATSAPP_API_KEY || authHeader !== `Bearer ${WHATSAPP_API_KEY}`) {
    return NextResponse.json(
      { error: "Unauthorized", status: "error" },
      { status: 401 }
    );
  }

  let body: WhatsAppRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", status: "error" },
      { status: 400 }
    );
  }

  const { phone, name, message, message_type, session_id } = body;

  if (!phone || !message || !session_id) {
    return NextResponse.json(
      { error: "Missing required fields: phone, message, session_id", status: "error" },
      { status: 400 }
    );
  }

  // Only handle text messages for now
  if (message_type && message_type !== "text") {
    return NextResponse.json(
      {
        reply: "Sorry, I can only handle text messages at the moment. Please send your question as text.",
        status: "ok",
      },
      { status: 200 }
    );
  }

  try {
    // Forward to SolyntaFlow chat endpoint
    // SolyntaFlow expects session_id as a UUID; the marketplace session_id
    // (mkt_conv_<id>) is stored in our sessionMap to bridge the two.
    const chatBody: Record<string, string> = {
      message,
      source_url: "https://solyntaenergy.com",
    };
    // Reuse a SolyntaFlow session if we've seen this marketplace session before
    const existingSession = sessionMap.get(session_id);
    if (existingSession) {
      chatBody.session_id = existingSession;
    }
    if (name) {
      chatBody.contact_name = name;
      chatBody.contact_phone = phone;
    }

    const res = await fetch(`${API_BASE}/api/customer-service/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatBody),
      signal: AbortSignal.timeout(12_000), // 12s timeout (SolyntaFlow allows 15s)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`SolyntaFlow API error: ${res.status} ${text.slice(0, 500)}`);
      return NextResponse.json(
        { error: "Chatbot service unavailable", status: "error" },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Cache the SolyntaFlow UUID so future messages reuse the same session
    if (data?.session_id) {
      sessionMap.set(session_id, data.session_id);
    }

    const reply: string = data?.response ?? "Sorry, I couldn't process your message. Please try again.";

    return NextResponse.json({ reply, status: "ok" }, { status: 200 });
  } catch (err) {
    console.error("WhatsApp chatbot error:", err);
    const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
    return NextResponse.json(
      {
        error: isTimeout ? "Response timed out" : "Internal server error",
        status: "error",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}

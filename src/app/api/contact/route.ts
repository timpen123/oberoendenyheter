import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, message } = body ?? {};

    if (!email?.trim() || !name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "E-post, namn och meddelande krävs" },
        { status: 400 }
      );
    }

    // TODO: Skicka e-post (t.ex. Resend) eller spara i databas
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "Kunde inte skicka meddelandet" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validations";
import { isMemoryRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isMemoryRateLimited(`contact:${ipAddress}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // Honeypot: bots fill hidden fields humans never see/touch.
    if (parsed.data.website) {
      // Silently pretend success so bots don't learn to avoid the trap.
      return NextResponse.json({ success: true });
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        ipAddress,
      },
    });

    // NOTE: plug in an email provider (Resend, SES, etc.) here to notify
    // CONTACT_RECEIVER_EMAIL of new messages. Kept out of the starter to
    // avoid requiring extra credentials just to run the app.

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

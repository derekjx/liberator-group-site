import Stripe from "stripe";
import { Resend } from "resend";
import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});
const resend = new Resend(process.env.RESEND_API_KEY!);

// Must disable body parsing — Stripe needs the raw body for signature verification
export const config = { api: { bodyParser: false } };

function createDownloadToken(orderId: string, bookSlug: string): string {
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${orderId}:${bookSlug}:${expiry}`;
  const sig = createHmac("sha256", process.env.DOWNLOAD_SECRET!)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

function buildEmailHtml(
  downloadUrl: string,
  bookTitle: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0D1B27;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1B27;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Header -->
        <tr><td style="padding:0 0 32px 0;">
          <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);">LIBERATORGROUP</p>
        </td></tr>

        <!-- Fire accent -->
        <tr><td style="padding:0 0 28px 0;">
          <div style="width:48px;height:3px;background:linear-gradient(90deg,#E92904,#FD6910);border-radius:2px;"></div>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding:0 0 20px 0;">
          <h1 style="margin:0;font-size:32px;font-weight:700;color:#FFFFFF;line-height:1.1;letter-spacing:-0.02em;">
            Your book is ready.
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:0 0 32px 0;">
          <p style="margin:0 0 16px 0;font-size:16px;color:rgba(255,255,255,0.7);line-height:1.7;">
            Thank you for purchasing <strong style="color:#FFFFFF;">${bookTitle}</strong>.
            Your download link is below — it's valid for 7 days.
          </p>
          <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.7;">
            If you need a new link or have any questions, reply to this email or write to
            <a href="mailto:support@liberatorgroup.com" style="color:#FD6910;">support@liberatorgroup.com</a>.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 0 40px 0;">
          <a href="${downloadUrl}" style="display:inline-block;background:#E92904;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.04em;padding:16px 32px;border-radius:2px;">
            Download ${bookTitle}
          </a>
        </td></tr>

        <!-- Quote -->
        <tr><td style="border-left:3px solid rgba(233,41,4,0.4);padding:0 0 0 20px;margin-bottom:40px;">
          <p style="margin:0;font-size:15px;font-style:italic;color:rgba(255,255,255,0.5);line-height:1.7;">
            "A life you don't want to retire from is not a fantasy. It is the work."
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:40px 0 0 0;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.6;">
            LiberatorGroup · <a href="https://www.liberatorgroup.com" style="color:rgba(255,255,255,0.25);">liberatorgroup.com</a><br>
            You received this because you purchased a book from LiberatorGroup.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const bookSlug = session.metadata?.bookSlug;
    const orderId = session.id;

    if (!email || !bookSlug) {
      console.error("Webhook: missing email or bookSlug", { email, bookSlug });
      return NextResponse.json({ received: true });
    }

    const token = createDownloadToken(orderId, bookSlug);
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.liberatorgroup.com";
    const downloadUrl = `${baseUrl}/api/download?token=${token}`;

    const bookTitles: Record<string, string> = {
      "unleash-your-super-power": "Unleash Your Super Power",
    };
    const bookTitle = bookTitles[bookSlug] ?? bookSlug;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "LiberatorGroup <books@liberatorgroup.com>",
      to: email,
      subject: `Your copy of ${bookTitle} — download inside`,
      html: buildEmailHtml(downloadUrl, bookTitle),
    });

    if (error) {
      console.error("Resend error:", error);
    }
  }

  return NextResponse.json({ received: true });
}

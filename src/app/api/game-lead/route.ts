import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail) {
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "LiberatorGroup <books@liberatorgroup.com>",
        to: ownerEmail,
        subject: `New Circle of Life lead — ${name}`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#0D1B27;color:#f0f0f0;padding:2rem;">
  <h2 style="color:#d4a853;margin:0 0 1rem">New game lead</h2>
  <table style="border-collapse:collapse;width:100%;max-width:400px;">
    <tr>
      <td style="padding:0.5rem 1rem 0.5rem 0;color:rgba(255,255,255,0.5);font-size:14px;">Name</td>
      <td style="padding:0.5rem 0;color:#f0f0f0;font-size:14px;font-weight:600;">${name}</td>
    </tr>
    <tr>
      <td style="padding:0.5rem 1rem 0.5rem 0;color:rgba(255,255,255,0.5);font-size:14px;">Email</td>
      <td style="padding:0.5rem 0;color:#f0f0f0;font-size:14px;font-weight:600;">${email}</td>
    </tr>
    ${phone ? `<tr>
      <td style="padding:0.5rem 1rem 0.5rem 0;color:rgba(255,255,255,0.5);font-size:14px;">Phone</td>
      <td style="padding:0.5rem 0;color:#f0f0f0;font-size:14px;font-weight:600;">${phone}</td>
    </tr>` : ""}
    <tr>
      <td style="padding:0.5rem 1rem 0.5rem 0;color:rgba(255,255,255,0.5);font-size:14px;">Source</td>
      <td style="padding:0.5rem 0;color:#FD6910;font-size:14px;">Circle of Life game — liberatorgroup.com/play</td>
    </tr>
  </table>
</body>
</html>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Game lead error:", err);
    // Return ok anyway — don't block the user from playing
    return NextResponse.json({ ok: true });
  }
}

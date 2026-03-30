import { createHmac } from "crypto";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const BOOK_TITLES: Record<string, string> = {
  "unleash-your-super-power": "Unleash Your Super Power",
};

function verifyToken(
  token: string
): { orderId: string; bookSlug: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    // format: orderId:bookSlug:expiry:hmac
    const lastColon = decoded.lastIndexOf(":");
    const sig = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const parts = payload.split(":");
    if (parts.length < 3) return null;

    const expiry = parseInt(parts[parts.length - 1], 10);
    if (Date.now() > expiry) return null;

    const expected = createHmac("sha256", process.env.DOWNLOAD_SECRET!)
      .update(payload)
      .digest("hex");
    if (sig !== expected) return null;

    const bookSlug = parts.slice(1, parts.length - 1).join(":");
    const orderId = parts[0];
    return { orderId, bookSlug };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const verified = verifyToken(token);
  if (!verified) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;background:#0D1B27;color:#fff;">
        <h2>This link has expired or is invalid.</h2>
        <p>Please contact <a href="mailto:support@liberatorgroup.com" style="color:#FD6910">support@liberatorgroup.com</a> for a new download link.</p>
      </body></html>`,
      { status: 403, headers: { "Content-Type": "text/html" } }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "private",
    "books",
    `${verified.bookSlug}.pdf`
  );

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: "File not found — contact support" },
      { status: 404 }
    );
  }

  const buffer = readFileSync(filePath);
  const title = BOOK_TITLES[verified.bookSlug] ?? verified.bookSlug;
  const filename = `${title}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": buffer.length.toString(),
      // Prevent caching of download links
      "Cache-Control": "no-store",
    },
  });
}

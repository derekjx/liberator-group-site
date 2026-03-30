import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getBook } from "@/lib/books";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { bookSlug } = await req.json();

    const book = getBook(bookSlug);
    if (!book || !book.price || book.status !== "available") {
      return NextResponse.json(
        { error: "Book not available for purchase" },
        { status: 400 }
      );
    }

    // Parse price — stored as "$24.99"
    const priceMatch = book.price.match(/[\d.]+/);
    if (!priceMatch) {
      return NextResponse.json({ error: "Invalid price" }, { status: 500 });
    }
    const unitAmount = Math.round(parseFloat(priceMatch[0]) * 100);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: book.title,
              description: book.subtitle,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/books/${bookSlug}`,
      metadata: { bookSlug },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

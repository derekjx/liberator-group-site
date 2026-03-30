import type { Metadata } from "next";
import Link from "next/link";
import { books } from "@/lib/books";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Books",
  description:
    "The LiberatorGroup book series — a progression from who you are and what's blocking you, to bringing vision to reality, to navigating what comes when the path meets resistance.",
};

export default function BooksPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B27", color: "#FFFFFF" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <p className="eyebrow mb-5" style={{ color: "#FD6910" }}>The work</p>
          <h1 style={{ color: "#FFFFFF", maxWidth: "640px", marginBottom: "1.5rem" }}>
            Books that begin where others stop
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              maxWidth: "560px",
              fontSize: "1.125rem",
              lineHeight: 1.8,
            }}
          >
            Three books. One arc. The series takes you from understanding what is blocking
            you, to building what you imagined, to navigating whatever meets you on the way.
            Each book has its own diagnostic — to show you exactly where your journey begins.
          </p>
        </div>
      </section>

      {/* Series arc */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="mb-14">
            <span className="fire-line" />
            <h2 style={{ maxWidth: "520px" }}>The series arc</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-1 mb-6">
            {[
              { n: "Book 1", label: "Who you are and what's blocking you", title: "Unleash Your Super Power" },
              { n: "Book 2", label: "Bringing the vision into reality", title: "Building Castles in the Sky" },
              { n: "Book 3", label: "When the path meets resistance", title: "Overcoming Adversity" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#0D1B27",
                  padding: "2rem",
                  borderLeft: "3px solid #E92904",
                }}
              >
                <p className="eyebrow mb-3" style={{ color: "#FD6910" }}>{item.n}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                  {item.label}
                </p>
                <p style={{ color: "#FFFFFF", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontStyle: "italic" }}>
                  {item.title}
                </p>
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(43,63,81,0.5)", fontSize: "0.875rem", maxWidth: "560px" }}>
            Each book stands alone — you can begin anywhere. Each has its own diagnostic to show
            you where in that book your journey starts.
          </p>
        </div>
      </section>

      {/* Book cards */}
      <section style={{ backgroundColor: "#2B3F51" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {books.map((book, i) => {
              const isAvailable = book.status === "available";
              const isComingSoon = book.status === "coming-soon";

              return (
                <Reveal key={book.slug} delay={(i + 1) as 1|2|3}>
                <Link
                  key={book.slug}
                  href={`/books/${book.slug}`}
                  className="card-lift"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: isAvailable ? "#0D1B27" : "rgba(13,27,39,0.5)",
                    padding: "2.5rem 2rem",
                    minHeight: 420,
                    textDecoration: "none",
                    border: isAvailable ? "1px solid rgba(233,41,4,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <p
                      className="eyebrow mb-5"
                      style={{
                        color: isAvailable ? "#FD6910" : isComingSoon ? "#E92904" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {book.statusLabel}
                    </p>
                    <h3
                      style={{
                        color: isAvailable ? "#FFFFFF" : isComingSoon ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                        marginBottom: "1.25rem",
                        lineHeight: 1.2,
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {book.title}
                    </h3>
                    <p
                      style={{
                        color: isAvailable ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
                        fontSize: "0.9375rem",
                        lineHeight: 1.8,
                      }}
                    >
                      {book.tagline}
                    </p>
                  </div>
                  <div style={{ marginTop: "2rem" }}>
                    {book.price && (
                      <p style={{ color: "#FD6910", fontSize: "1.1rem", fontFamily: "'Playfair Display', serif", marginBottom: "1rem" }}>
                        {book.price}
                      </p>
                    )}
                    <span
                      className="eyebrow"
                      style={{
                        color: isAvailable ? "#E92904" : "rgba(255,255,255,0.3)",
                        display: "inline-block",
                      }}
                    >
                      {isAvailable ? "Explore & buy →" : isComingSoon ? "Learn more →" : "Coming soon"}
                    </span>
                  </div>
                </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF", borderTop: "3px solid #E92904" }}
        className="section-pad"
      >
        <div style={{ maxWidth: "720px" }} className="mx-auto text-center">
          <h2 style={{ color: "#FFFFFF", marginBottom: "1.25rem" }}>
            Ready for more than a book?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            The book names the pattern. Coaching dissolves it. If you are ready for the
            accelerated version, the next step is a discovery call.
          </p>
          <Link href="/coaching" className="btn-primary">
            Explore coaching
          </Link>
        </div>
      </section>
    </>
  );
}

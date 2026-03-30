import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBook, getAllBookSlugs } from "@/lib/books";
import BookQuiz from "@/components/BookQuiz";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    title: book.title,
    description: book.tagline,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const isAvailable = book.status === "available";
  const isComingSoon = book.status === "coming-soon";

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF", minHeight: "70vh" }}
        className="flex items-center section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto w-full">
          <Link
            href="/books"
            className="eyebrow mb-8 inline-block hover:opacity-60 transition-opacity"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ← All books
          </Link>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow mb-5" style={{ color: "#FD6910" }}>
                {book.statusLabel}
              </p>
              <h1 style={{ color: "#FFFFFF", marginBottom: "1rem" }}>
                {book.title}
              </h1>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: "2rem",
                  lineHeight: 1.5,
                }}
              >
                {book.subtitle}
              </p>
              {book.price && (
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.75rem",
                    color: "#FD6910",
                    marginBottom: "2rem",
                  }}
                >
                  {book.price}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {isAvailable && (
                  <a href="#buy" className="btn-primary">
                    Get the book
                  </a>
                )}
                {isComingSoon && (
                  <a href="#notify" className="btn-primary">
                    Notify me at launch
                  </a>
                )}
                <a href="#diagnostic" className="btn-secondary">
                  Take the diagnostic
                </a>
              </div>
            </div>

            {/* Book cover placeholder */}
            <div
              style={{
                aspectRatio: "2/3",
                maxHeight: 420,
                background: "linear-gradient(145deg, #2B3F51, #0D1B27)",
                border: "1px solid rgba(233,41,4,0.25)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 3,
                  background: "linear-gradient(90deg, #E92904, #FD6910)",
                  marginBottom: "1.5rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                  color: "#FFFFFF",
                  lineHeight: 1.3,
                  marginBottom: "1rem",
                }}
              >
                {book.title}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                LiberatorGroup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAGLINE / OVERVIEW ── */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <span className="fire-line" />
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "#0D1B27",
                  marginBottom: "2rem",
                }}
              >
                {book.tagline}
              </p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "rgba(43,63,81,0.8)" }}>
                {book.description}
              </p>
            </div>
            <div>
              <p className="eyebrow mb-6" style={{ color: "rgba(43,63,81,0.4)" }}>
                This book is for you if
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {book.forYouIf.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.875rem",
                      paddingBottom: "1rem",
                      marginBottom: "1rem",
                      borderBottom: "1px solid rgba(43,63,81,0.08)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.75,
                      color: "rgba(43,63,81,0.75)",
                    }}
                  >
                    <span style={{ color: "#FD6910", flexShrink: 0, marginTop: "0.2rem" }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── THEMES ── */}
      <section style={{ backgroundColor: "#2B3F51", color: "#FFFFFF" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="mb-12">
            <span className="fire-line" />
            <p className="eyebrow mb-3" style={{ color: "#FD6910" }}>Inside the book</p>
            <h2 style={{ color: "#FFFFFF", maxWidth: "480px" }}>What the work addresses</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-1">
            {book.themes.map((theme, i) => (
              <Reveal key={i} delay={((i % 4) + 1) as 1|2|3|4}>
              <div
                className="card-lift"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderLeft: "3px solid rgba(233,41,4,0.5)",
                  padding: "1.5rem 1.75rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  height: "100%",
                }}
              >
                <span
                  className="eyebrow"
                  style={{ color: "#E92904", flexShrink: 0, marginTop: "0.15rem", fontSize: "0.65rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9375rem", lineHeight: 1.75 }}>
                  {theme}
                </p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC QUIZ ── */}
      <section id="diagnostic" style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="fire-line" />
              <p className="eyebrow mb-4">Find your starting point</p>
              <h2 style={{ maxWidth: "440px", marginBottom: "1.25rem" }}>
                Where does your journey begin?
              </h2>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "rgba(43,63,81,0.75)", marginBottom: "1rem" }}>
                This diagnostic is not a test. There are no right answers — only honest ones.
              </p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "rgba(43,63,81,0.75)" }}>
                Two minutes of honest reflection will name the specific pattern you are navigating
                and show you exactly where in this book to begin — so the work meets you where you
                actually are, not where you think you should be.
              </p>
            </div>
            <div>
              <BookQuiz quiz={book.quiz} bookStatus={book.status} />
            </div>
          </div>
        </div>
      </section>

      {/* ── BUY / NOTIFY CTA ── */}
      {isAvailable && (
        <section
          id="buy"
          style={{
            backgroundColor: "#0D1B27",
            color: "#FFFFFF",
            borderTop: "3px solid #E92904",
          }}
          className="section-pad"
        >
          <div style={{ maxWidth: "680px" }} className="mx-auto text-center">
            <span className="fire-line" style={{ margin: "0 auto 1.5rem" }} />
            <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>Available now</p>
            <h2 style={{ color: "#FFFFFF", marginBottom: "0.75rem" }}>{book.title}</h2>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "2rem",
                color: "#FD6910",
                marginBottom: "2rem",
              }}
            >
              {book.price}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                marginBottom: "2.5rem",
                fontSize: "1.0625rem",
                lineHeight: 1.8,
              }}
            >
              The diagnostic showed you where your journey begins. The book shows you how to move.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="btn-primary">
                Buy the book — {book.price}
              </a>
              <Link href="/coaching" className="btn-secondary">
                Explore coaching instead
              </Link>
            </div>
          </div>
        </section>
      )}

      {isComingSoon && (
        <section
          id="notify"
          style={{
            backgroundColor: "#0D1B27",
            color: "#FFFFFF",
            borderTop: "3px solid #E92904",
          }}
          className="section-pad"
        >
          <div style={{ maxWidth: "640px" }} className="mx-auto text-center">
            <span className="fire-line" style={{ margin: "0 auto 1.5rem" }} />
            <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>Coming Q3 2026</p>
            <h2 style={{ color: "#FFFFFF", marginBottom: "1.25rem" }}>
              Be the first to know when it lands
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                marginBottom: "2.5rem",
                fontSize: "1.0625rem",
                lineHeight: 1.8,
              }}
            >
              The diagnostic has shown you where you are. When the book is released, you will
              know exactly where to begin. Join the list and we will let you know the moment it is available.
            </p>
            <NewsletterForm placeholder="Your email address" buttonLabel="Notify me at launch" />
          </div>
        </section>
      )}

      {book.status === "future" && (
        <section
          style={{
            backgroundColor: "#0D1B27",
            color: "#FFFFFF",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
          className="section-pad"
        >
          <div style={{ maxWidth: "680px" }} className="mx-auto text-center">
            <p className="eyebrow mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>No release date set</p>
            <h2 style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem" }}>
              This book is in development
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem", fontSize: "1.0625rem", lineHeight: 1.8 }}>
              While you wait, the work begins with Book One.
            </p>
            <Link href="/books/unleash-your-super-power" className="btn-primary">
              Start with Unleash Your Super Power
            </Link>
          </div>
        </section>
      )}

      {/* ── SERIES FOOTER ── */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <p className="eyebrow mb-8" style={{ color: "rgba(43,63,81,0.4)" }}>The series</p>
          <div className="grid md:grid-cols-3 gap-1">
            {[
              { slug: "unleash-your-super-power", n: "Book 1", title: "Unleash Your Super Power" },
              { slug: "building-castles-in-the-sky", n: "Book 2", title: "Building Castles in the Sky" },
              { slug: "overcoming-adversity", n: "Book 3", title: "Overcoming Adversity" },
            ].map((item) => {
              const isCurrent = item.slug === slug;
              return (
                <Link
                  key={item.slug}
                  href={`/books/${item.slug}`}
                  style={{
                    display: "block",
                    padding: "1.75rem",
                    backgroundColor: isCurrent ? "#0D1B27" : "rgba(43,63,81,0.05)",
                    borderLeft: isCurrent ? "3px solid #E92904" : "3px solid transparent",
                    textDecoration: "none",
                    transition: "background-color 0.2s",
                  }}
                >
                  <p className="eyebrow mb-2" style={{ color: isCurrent ? "#FD6910" : "rgba(43,63,81,0.4)" }}>
                    {item.n}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1rem",
                      color: isCurrent ? "#FFFFFF" : "#2B3F51",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

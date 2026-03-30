import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";

const blogPreviews = [
  {
    slug: "the-gap-between-knowing-and-doing",
    title: "The Gap Between Knowing and Doing",
    excerpt:
      "You already know what to do. That much has been established. The question — the one that hasn't been answered by any framework you've read — is why you're not doing it.",
    date: "March 2026",
    readTime: "8 min",
  },
  {
    slug: "what-golden-handcuffs-are-really-made-of",
    title: "What Golden Handcuffs Are Really Made Of",
    excerpt:
      "The constraints that hold capable people in place are rarely financial. Money is the story you tell. The thing holding you is something older, and closer.",
    date: "March 2026",
    readTime: "7 min",
  },
  {
    slug: "the-threshold-is-not-the-enemy",
    title: "The Threshold Is Not the Enemy",
    excerpt:
      "The moment before the next level always feels like failure. That feeling is not a signal to stop. It is the work itself — and learning to read it changes everything.",
    date: "March 2026",
    readTime: "9 min",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF", minHeight: "90vh" }}
        className="flex items-center section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto w-full">
          <div style={{ maxWidth: "820px" }}>
            <p className="eyebrow mb-8" style={{ color: "#FD6910" }}>
              LiberatorGroup — Empowering Freedom & Purpose
            </p>
            <h1 style={{ color: "#FFFFFF", marginBottom: "2rem" }}>
              You deserve a life{" "}
              <span style={{ color: "#E92904" }}>
                you don&apos;t want to retire from.
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.7)",
                maxWidth: "580px",
                marginBottom: "3rem",
              }}
            >
              LiberatorGroup exists to free capable people from the self-limiting beliefs,
              golden handcuffs, and internal patterns keeping them from the life they already
              know is theirs. Not by adding more information — by shifting the internal state
              that determines what is possible.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/coaching" className="btn-primary">
                Begin here
              </Link>
              <Link href="/books" className="btn-secondary">
                Explore the work
              </Link>
            </div>
          </div>

          <div
            style={{
              marginTop: "6rem",
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, #E92904, #FD6910, transparent)",
              opacity: 0.35,
            }}
          />
        </div>
      </section>

      {/* ── 2. THE PROBLEM ── */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <span className="fire-line" />
              <p className="eyebrow mb-4">The real problem</p>
              <h2>
                You&apos;ve read the books. You&apos;ve done the work. You&apos;re still stuck.
              </h2>
            </div>
            <div>
              <p style={{ marginBottom: "1.5rem", fontSize: "1.0625rem" }}>
                That is not a failure of effort or intelligence. You are not missing a framework.
                The people who find their way to LiberatorGroup have already tried everything else —
                and they are still wearing the golden handcuffs, still circling the same internal
                ceiling, still living a life built for someone else&apos;s version of success.
              </p>
              <p style={{ marginBottom: "1.75rem", fontSize: "1.0625rem" }}>
                Liberation is not a productivity upgrade. It begins when the self-limiting belief
                is named precisely enough to dissolve — and the internal state shifts from one
                that makes the next step impossible to one that makes it inevitable.
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  color: "#0D1B27",
                  borderLeft: "3px solid #E92904",
                  paddingLeft: "1.5rem",
                }}
              >
                &ldquo;Freedom is not the absence of constraint. It is the presence of choice.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THE APPROACH ── */}
      <section
        style={{ backgroundColor: "#2B3F51", color: "#FFFFFF" }}
        className="section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div
            style={{ maxWidth: "600px", margin: "0 auto 4rem", textAlign: "center" }}
          >
            <span className="fire-line" style={{ margin: "0 auto 1.5rem" }} />
            <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>
              The approach
            </p>
            <h2 style={{ color: "#FFFFFF" }}>State. Story. Strategy.</h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                marginTop: "1rem",
                fontSize: "1.0625rem",
              }}
            >
              Every piece of work follows this sequence. Nothing else is permitted to lead.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            {[
              {
                number: "01",
                title: "State",
                body: "The internal shift is always invited first. Before any method is introduced, the reader or client is brought into direct contact with their own state. This is where the work begins.",
              },
              {
                number: "02",
                title: "Story",
                body: "The narrative or case study that makes the shift real. Abstract insight is not sufficient. A specific, named story anchors the internal movement in something the reader can hold.",
              },
              {
                number: "03",
                title: "Strategy",
                body: "Method arrives last. Only once State and Story have prepared the ground. Strategy delivered to a stuck person adds to the pile. Delivered to a ready one, it takes root.",
              },
            ].map((item, i) => (
              <Reveal key={item.number} delay={(i + 1) as 1 | 2 | 3}>
                <div
                  className="card-lift"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderLeft: "3px solid #E92904",
                    padding: "2.5rem 2rem",
                    height: "100%",
                  }}
                >
                  <p className="eyebrow mb-5" style={{ color: "#FD6910", fontSize: "0.65rem" }}>
                    {item.number}
                  </p>
                  <h3 style={{ color: "#FFFFFF", marginBottom: "1rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9375rem", lineHeight: 1.8 }}>
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BOOK SPOTLIGHT ── */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="mb-14">
            <span className="fire-line" />
            <p className="eyebrow mb-3">The work</p>
            <h2 style={{ maxWidth: "520px" }}>Books that begin where others stop</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Book 1 — Available */}
            <div
              style={{
                backgroundColor: "#0D1B27",
                color: "#FFFFFF",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 420,
              }}
            >
              <div>
                <p className="eyebrow mb-5" style={{ color: "#FD6910" }}>
                  Available now
                </p>
                <h3
                  style={{
                    color: "#FFFFFF",
                    marginBottom: "1.25rem",
                    lineHeight: 1.2,
                  }}
                >
                  Unleash Your Super Power
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                  }}
                >
                  Find your purpose, break the golden handcuffs, and silence the noise
                  that keeps you from living the life you already know is yours.
                </p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <p
                  style={{
                    color: "#FD6910",
                    fontSize: "1.1rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    marginBottom: "1rem",
                  }}
                >
                  $24.99
                </p>
                <Link href="/books/unleash-your-super-power" className="btn-primary">
                  Get the book
                </Link>
              </div>
            </div>

            {/* Book 2 — Coming Q3 2026 */}
            <div
              style={{
                border: "1px solid rgba(43,63,81,0.15)",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 420,
              }}
            >
              <div>
                <p className="eyebrow mb-5" style={{ color: "#E92904" }}>
                  Coming Q3 2026
                </p>
                <h3 style={{ marginBottom: "1.25rem", lineHeight: 1.2 }}>
                  Building Castles in the Sky
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                    color: "rgba(43,63,81,0.7)",
                  }}
                >
                  How to bring vision to completion — the practice of grounding what you
                  dare to imagine into something real.
                </p>
              </div>
              <Link
                href="/books/building-castles-in-the-sky"
                className="btn-outline-dark"
                style={{ alignSelf: "flex-start", marginTop: "2rem" }}
              >
                Learn more
              </Link>
            </div>

            {/* Book 3 — Coming Soon */}
            <div
              style={{
                border: "1px solid rgba(43,63,81,0.08)",
                padding: "2.5rem 2rem",
                backgroundColor: "rgba(43,63,81,0.025)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 420,
              }}
            >
              <div>
                <p
                  className="eyebrow mb-5"
                  style={{ color: "rgba(43,63,81,0.35)" }}
                >
                  Coming soon
                </p>
                <h3
                  style={{
                    marginBottom: "1.25rem",
                    lineHeight: 1.2,
                    color: "rgba(43,63,81,0.55)",
                  }}
                >
                  Overcoming Adversity
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                    color: "rgba(43,63,81,0.45)",
                  }}
                >
                  What to do when the path meets resistance — resilience not as
                  endurance, but as internal navigation.
                </p>
              </div>
              <span
                className="eyebrow"
                style={{ color: "rgba(43,63,81,0.3)", marginTop: "2rem" }}
              >
                No release date yet
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COACHING TEASER ── */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF" }}
        className="section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="fire-line" />
              <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>
                Coaching & programmes
              </p>
              <h2 style={{ color: "#FFFFFF", maxWidth: "460px" }}>
                Ready to build a life you don&apos;t want to retire from?
              </h2>
            </div>
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1.0625rem",
                  marginBottom: "1.75rem",
                  lineHeight: 1.8,
                }}
              >
                The book names the pattern. The coaching dissolves it. LiberatorGroup works
                directly with individuals and organisations at the level where real liberation
                happens — not in the strategy, but in the internal state from which all
                meaningful choices are made.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1.0625rem",
                  marginBottom: "2.5rem",
                  lineHeight: 1.8,
                }}
              >
                When the self-limiting beliefs are dissolved and the golden handcuffs are off,
                what remains is not a better version of the same life — it is the freedom to
                choose a different one entirely.
              </p>
              <Link href="/coaching" className="btn-primary">
                Explore coaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BLOG PREVIEW ── */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="fire-line" />
              <p className="eyebrow mb-3">From the writing</p>
              <h2 style={{ maxWidth: "420px" }}>Where the thinking lives</h2>
            </div>
            <Link
              href="/blog"
              className="eyebrow hover:opacity-70 transition-opacity"
              style={{ color: "#E92904", whiteSpace: "nowrap" }}
            >
              All writing →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {blogPreviews.map((post, i) => (
              <Reveal key={post.slug} delay={(i + 1) as 1 | 2 | 3}>
              <article
                style={{
                  borderTop: "2px solid rgba(43,63,81,0.1)",
                  paddingTop: "1.75rem",
                }}
              >
                <div className="flex gap-4 mb-4">
                  <span className="eyebrow" style={{ color: "rgba(43,63,81,0.38)" }}>
                    {post.date}
                  </span>
                  <span className="eyebrow" style={{ color: "rgba(43,63,81,0.38)" }}>
                    {post.readTime} read
                  </span>
                </div>
                <h3 style={{ marginBottom: "0.875rem", lineHeight: 1.25 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                    color: "rgba(43,63,81,0.65)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="eyebrow"
                  style={{ color: "#E92904" }}
                >
                  Read →
                </Link>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. NEWSLETTER ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0D1B27 0%, #2B3F51 100%)",
          color: "#FFFFFF",
          borderTop: "3px solid #E92904",
        }}
        className="section-pad"
      >
        <div
          style={{ maxWidth: "640px" }}
          className="mx-auto text-center"
        >
          <span className="fire-line" style={{ margin: "0 auto 1.5rem" }} />
          <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>
            The newsletter
          </p>
          <h2 style={{ color: "#FFFFFF", marginBottom: "1.25rem" }}>
            Stay in the work
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              marginBottom: "2.5rem",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
            }}
          >
            Occasional writing on liberation, self-limiting beliefs, and what it actually
            takes to build a life you don&apos;t want to retire from. No noise. No urgency.
            Only what is true.
          </p>
          <NewsletterForm
            placeholder="Your email address"
            buttonLabel="Stay in the work"
          />
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  );
}

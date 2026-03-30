import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on state, story, and the threshold between where you are and where you know you could be.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF" }}
        className="section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <p className="eyebrow mb-5" style={{ color: "#FD6910" }}>
            From the writing
          </p>
          <h1 style={{ color: "#FFFFFF", maxWidth: "580px", marginBottom: "1.25rem" }}>
            Where the thinking lives
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "520px",
              fontSize: "1.125rem",
              lineHeight: 1.8,
            }}
          >
            Writing on state, story, and the threshold between where you are and where
            you know you could be. Written for people who are ready to think clearly
            about what is actually happening.
          </p>
        </div>
      </section>

      {/* Post list */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          {posts.length === 0 ? (
            <p style={{ color: "rgba(43,63,81,0.5)" }}>No posts yet. Check back soon.</p>
          ) : (
            <div>
              {posts.map((post, i) => (
                <article
                  key={post.slug}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid rgba(43,63,81,0.1)",
                    paddingTop: i === 0 ? 0 : "3.5rem",
                    paddingBottom: "3.5rem",
                  }}
                >
                  <div className="grid md:grid-cols-4 gap-8 md:gap-16 items-start">
                    <div style={{ paddingTop: "0.35rem" }}>
                      <p className="eyebrow mb-2" style={{ color: "rgba(43,63,81,0.4)" }}>
                        {post.date}
                      </p>
                      <p className="eyebrow" style={{ color: "rgba(43,63,81,0.4)" }}>
                        {post.readTime} read
                      </p>
                    </div>
                    <div className="md:col-span-3">
                      <h2
                        style={{
                          marginBottom: "1rem",
                          fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                        }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:opacity-70 transition-opacity"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p
                        style={{
                          fontSize: "1.0625rem",
                          lineHeight: 1.8,
                          color: "rgba(43,63,81,0.65)",
                          maxWidth: "580px",
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
                        Read the piece →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section
        style={{
          backgroundColor: "#2B3F51",
          color: "#FFFFFF",
          borderTop: "3px solid #E92904",
        }}
        className="section-pad"
      >
        <div style={{ maxWidth: "640px" }} className="mx-auto text-center">
          <span className="fire-line" style={{ margin: "0 auto 1.5rem" }} />
          <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>
            Stay in the work
          </p>
          <h2 style={{ color: "#FFFFFF", marginBottom: "1.25rem" }}>
            Get new writing when it lands
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              marginBottom: "2.5rem",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
            }}
          >
            No noise. No urgency. Occasional pieces on the internal territory that
            intelligent people find themselves navigating — and rarely talking about.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flex: 1,
                maxWidth: 340,
                backgroundColor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                padding: "0.875rem 1.25rem",
                fontSize: "0.9rem",
                fontFamily: "'Jost', sans-serif",
              }}
            />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}

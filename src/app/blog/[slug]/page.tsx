import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getAllPosts } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF" }}
        className="section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <Link
            href="/blog"
            className="eyebrow mb-8 inline-block hover:opacity-70 transition-opacity"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            ← All writing
          </Link>
          <div style={{ maxWidth: "720px" }}>
            <div className="flex gap-5 mb-6">
              <span className="eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>
                {post.date}
              </span>
              <span className="eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>
                {post.readTime} read
              </span>
            </div>
            <h1 style={{ color: "#FFFFFF" }}>{post.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-4 gap-16">
            {/* Main content */}
            <div className="md:col-span-3">
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.3rem",
                  fontStyle: "italic",
                  color: "#0D1B27",
                  marginBottom: "3rem",
                  lineHeight: 1.6,
                  borderLeft: "3px solid #E92904",
                  paddingLeft: "1.5rem",
                }}
              >
                {post.excerpt}
              </p>
              <div className="prose-liberator">
                <MDXRemote source={post.content} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden md:block">
              <div
                style={{
                  position: "sticky",
                  top: "7rem",
                  borderLeft: "1px solid rgba(43,63,81,0.12)",
                  paddingLeft: "1.5rem",
                }}
              >
                <p className="eyebrow mb-4" style={{ color: "rgba(43,63,81,0.4)" }}>
                  The work
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: "rgba(43,63,81,0.6)",
                    marginBottom: "1.5rem",
                  }}
                >
                  If this piece named something you have been circling, the next step is
                  the book — or a conversation.
                </p>
                <Link
                  href="/books"
                  className="eyebrow block mb-3"
                  style={{ color: "#E92904" }}
                >
                  Get the book →
                </Link>
                <Link
                  href="/coaching"
                  className="eyebrow block"
                  style={{ color: "#2B3F51" }}
                >
                  Explore coaching →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom nav */}
      <section
        style={{
          backgroundColor: "#2B3F51",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
        className="section-pad"
      >
        <div
          style={{ maxWidth: "1280px" }}
          className="mx-auto flex flex-col md:flex-row justify-between gap-8"
        >
          <div>
            <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>
              Continue reading
            </p>
            <Link
              href="/blog"
              style={{ color: "#FFFFFF", fontSize: "1.25rem", fontFamily: "'Playfair Display', serif" }}
              className="hover:opacity-70 transition-opacity"
            >
              All writing →
            </Link>
          </div>
          <div>
            <p className="eyebrow mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
              Go deeper
            </p>
            <Link
              href="/coaching"
              style={{ color: "#FFFFFF", fontSize: "1.25rem", fontFamily: "'Playfair Display', serif" }}
              className="hover:opacity-70 transition-opacity"
            >
              Book a discovery call →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

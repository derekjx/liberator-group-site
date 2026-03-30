import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Successful",
  robots: { index: false },
};

export default function PurchaseSuccessPage() {
  return (
    <section
      style={{
        backgroundColor: "#0D1B27",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        {/* Fire accent */}
        <div
          style={{
            width: 48,
            height: 3,
            background: "linear-gradient(90deg, #E92904, #FD6910)",
            borderRadius: 2,
            margin: "0 auto 2rem",
          }}
        />

        <p
          className="eyebrow"
          style={{ color: "#FD6910", marginBottom: "1rem" }}
        >
          Order confirmed
        </p>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
          }}
        >
          Your book is on its way.
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            marginBottom: "0.75rem",
          }}
        >
          Check your inbox — your download link will arrive within the next few
          minutes.
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          The link is valid for 7 days. If you don&apos;t see the email, check
          your spam folder or{" "}
          <a
            href="mailto:support@liberatorgroup.com"
            style={{ color: "#FD6910" }}
          >
            contact us
          </a>
          .
        </p>

        {/* Pull quote */}
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.5)",
            borderLeft: "3px solid rgba(233,41,4,0.4)",
            paddingLeft: "1.25rem",
            textAlign: "left",
            marginBottom: "3rem",
            lineHeight: 1.7,
          }}
        >
          &ldquo;A life you don&apos;t want to retire from is not a fantasy. It
          is the work.&rdquo;
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/blog" className="btn-secondary">
            Read the blog
          </Link>
          <Link href="/coaching" className="btn-secondary">
            Explore coaching
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

const links = [
  { href: "/books", label: "Books" },
  { href: "/blog", label: "Blog" },
  { href: "/coaching", label: "Coaching" },
  { href: "/coaching#discovery", label: "Book a Call" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0D1B27", color: "rgba(255,255,255,0.65)" }}>
      <div style={{ maxWidth: "1280px" }} className="mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image src="/phoenix-logo.svg" alt="LiberatorGroup" width={36} height={36} className="w-8 h-8" />
              <Image src="/logo-text.svg" alt="LiberatorGroup" width={140} height={28} className="h-6 w-auto" />
            </Link>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7 }} className="mb-6">
              Freeing capable people from self-limiting beliefs and golden handcuffs — so they can build a life they don&apos;t want to retire from.
            </p>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem" }}>
              EMPOWERING FREEDOM & PURPOSE
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="eyebrow mb-6 text-white">Navigate</p>
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: "0.9rem" }}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <p className="eyebrow mb-2 text-white">Stay in the work</p>
            <p style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Occasional writing on state, story, and the threshold between where you are and where you know you could be.
            </p>
            <NewsletterForm compact />
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem" }}
          className="flex flex-col md:flex-row justify-between gap-4"
        >
          <p style={{ fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} LiberatorGroup. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8rem" }}>
            A life you don&apos;t want to retire from is not a fantasy. It is the work.
          </p>
        </div>
      </div>
    </footer>
  );
}

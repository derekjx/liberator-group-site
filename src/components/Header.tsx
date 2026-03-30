"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/books", label: "Books" },
  { href: "/blog", label: "Blog" },
  { href: "/coaching", label: "Coaching" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{ backgroundColor: "#0D1B27", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      className="sticky top-0 z-50"
    >
      <div
        style={{ maxWidth: "1280px" }}
        className="mx-auto px-6 flex items-center justify-between h-16 md:h-20"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/phoenix-logo.svg"
            alt="LiberatorGroup Phoenix"
            width={36}
            height={36}
            className="w-8 h-8 md:w-9 md:h-9"
          />
          <Image
            src="/logo-text.svg"
            alt="LiberatorGroup"
            width={140}
            height={28}
            className="h-6 md:h-7 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/coaching#discovery" className="btn-primary text-sm py-3 px-6">
            Book a call
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white/70 hover:text-white"
          aria-label="Toggle menu"
        >
          <div style={{ width: 22, height: 2, backgroundColor: "currentColor", marginBottom: 5, transition: "transform 0.2s", transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
          <div style={{ width: 22, height: 2, backgroundColor: "currentColor", opacity: open ? 0 : 1, transition: "opacity 0.2s" }} />
          <div style={{ width: 22, height: 2, backgroundColor: "currentColor", marginTop: 5, transition: "transform 0.2s", transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div
          style={{ backgroundColor: "#0D1B27", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="md:hidden px-6 pb-6 pt-4 flex flex-col gap-5"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="eyebrow text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/coaching#discovery" onClick={() => setOpen(false)} className="btn-primary text-center mt-2">
            Book a call
          </Link>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";

interface Props {
  compact?: boolean;
  placeholder?: string;
  buttonLabel?: string;
}

export default function NewsletterForm({
  compact = false,
  placeholder = "Your email address",
  buttonLabel = "Subscribe",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p style={{ color: "#FD6910", fontSize: "0.9rem", fontFamily: "'Jost', sans-serif" }}>
        You&apos;re in. Watch for the first letter.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex ${compact ? "flex-col gap-2" : "flex-col sm:flex-row gap-3"}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          backgroundColor: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#FFFFFF",
          padding: compact ? "0.7rem 1rem" : "0.875rem 1.25rem",
          fontSize: "0.9rem",
          fontFamily: "'Jost', sans-serif",
          outline: "none",
        }}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ padding: compact ? "0.7rem 1.5rem" : undefined, whiteSpace: "nowrap" }}
      >
        {buttonLabel}
      </button>
    </form>
  );
}

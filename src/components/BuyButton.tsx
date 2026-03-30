"use client";

import { useState } from "react";

interface Props {
  bookSlug: string;
  label: string;
  className?: string;
}

export default function BuyButton({ bookSlug, label, className = "btn-primary" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug }),
      });
      const data = await res.json();
      if (data.error || !data.url) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className={className}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Redirecting to checkout…" : label}
      </button>
      {error && (
        <p style={{ color: "#E92904", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}

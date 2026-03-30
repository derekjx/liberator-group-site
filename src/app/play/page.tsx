"use client";

import { useState, useEffect } from "react";
import { GameProvider } from "@/lib/game/game-context";
import SetupScreen from "@/components/game/SetupScreen";
import GameScreen from "@/components/game/GameScreen";
import { useGame } from "@/lib/game/game-context";

// ── Lead gate ────────────────────────────────────────────────────────────────

function LeadGate({ onUnlock }: { onUnlock: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/game-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim() }),
      });
      // Save to localStorage so we don't gate on refresh
      if (typeof window !== "undefined") {
        localStorage.setItem("col-lead-captured", "1");
      }
      onUnlock();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "2rem 1.5rem",
        background: "#0f0f1a",
      }}
    >
      <div style={{ maxWidth: 400, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              borderRadius: 999,
              background: "rgba(212,168,83,0.13)",
              border: "1px solid rgba(212,168,83,0.3)",
              fontSize: "0.7rem",
              fontFamily: "'Jost', sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#d4a853",
              marginBottom: "1.25rem",
            }}
          >
            Free to play
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
              fontWeight: 700,
              color: "#d4a853",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Circle of Life
          </h1>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9375rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
            }}
          >
            A financial life simulation. Simulate your financial future — make
            investment decisions, manage expenses, and build wealth across
            life&apos;s milestones.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              Your name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                background: "#1a1a2e",
                color: "#f0f0f0",
                border: "1px solid #333",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9375rem",
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              Email address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                background: "#1a1a2e",
                color: "#f0f0f0",
                border: "1px solid #333",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9375rem",
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              Phone number <span style={{ color: "rgba(255,255,255,0.25)" }}>(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                background: "#1a1a2e",
                color: "#f0f0f0",
                border: "1px solid #333",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9375rem",
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#EF4444", fontSize: "0.8125rem", fontFamily: "'Jost', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: 12,
              background: loading ? "#a07830" : "linear-gradient(135deg, #d4a853, #b8873a)",
              color: "#0f0f1a",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 700,
              border: "none",
              cursor: loading ? "wait" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Starting…" : "Play Circle of Life — Free"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'Jost', sans-serif",
              lineHeight: 1.6,
            }}
          >
            No spam. We&apos;ll send you occasional updates from LiberatorGroup.
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Game wrapper (inside GameProvider) ──────────────────────────────────────

function GameWrapper() {
  const { state } = useGame();
  return state.phase === "setup" ? <SetupScreen /> : <GameScreen />;
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PlayPage() {
  const [unlocked, setUnlocked] = useState(false);

  // Check if lead already captured (skip gate on return visits)
  useEffect(() => {
    if (localStorage.getItem("col-lead-captured") === "1") {
      setUnlocked(true);
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#0f0f1a",
        overflow: "hidden",
      }}
    >
      {!unlocked ? (
        <div style={{ height: "100%", overflowY: "auto" }}>
          <LeadGate onUnlock={() => setUnlocked(true)} />
        </div>
      ) : (
        <GameProvider>
          <div style={{ height: "100%" }}>
            <GameWrapper />
          </div>
        </GameProvider>
      )}
    </div>
  );
}

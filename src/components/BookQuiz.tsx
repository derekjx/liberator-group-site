"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { BookQuiz, QuizProfile } from "@/lib/books";
import BuyButton from "@/components/BuyButton";

interface Props {
  quiz: BookQuiz;
  bookSlug: string;
  bookStatus: "available" | "coming-soon" | "future";
}

function resolveProfile(answers: Record<string, string>, profiles: QuizProfile[]): QuizProfile {
  const tally: Record<string, number> = {};
  for (const value of Object.values(answers)) {
    tally[value] = (tally[value] ?? 0) + 1;
  }
  let top = profiles[0];
  let topCount = 0;
  for (const profile of profiles) {
    const count = profile.triggers.reduce((sum, t) => sum + (tally[t] ?? 0), 0);
    if (count > topCount) {
      topCount = count;
      top = profile;
    }
  }
  return top;
}

export default function BookQuiz({ quiz, bookSlug, bookStatus }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizProfile | null>(null);
  const [step, setStep] = useState<"intro" | "questions" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [questionKey, setQuestionKey] = useState(0); // forces re-mount for animation
  const containerRef = useRef<HTMLDivElement>(null);

  const { questions, profiles } = quiz;
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const q = questions[currentQ];
  const progressPct = total > 0 ? ((currentQ + (answers[q?.id] ? 1 : 0)) / total) * 100 : 0;

  // Scroll quiz into view on step change
  useEffect(() => {
    if (step !== "intro") {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [step]);

  function selectAnswer(questionId: string, value: string) {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (currentQ < total - 1) {
      setTimeout(() => {
        setCurrentQ((q) => q + 1);
        setQuestionKey((k) => k + 1);
      }, 300);
    }
  }

  function goBack() {
    setCurrentQ((q) => Math.max(0, q - 1));
    setQuestionKey((k) => k + 1);
  }

  function handleSubmit() {
    setResult(resolveProfile(answers, profiles));
    setStep("result");
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
    setCurrentQ(0);
    setQuestionKey(0);
    setStep("intro");
  }

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: "#0D1B27",
        color: "#FFFFFF",
        padding: "2.75rem 2.5rem",
        maxWidth: 680,
      }}
    >
      {/* ── INTRO ── */}
      {step === "intro" && (
        <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
          <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>Diagnostic</p>
          <h3 style={{ color: "#FFFFFF", marginBottom: "1rem" }}>
            Where are you in your journey?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem", lineHeight: 1.8, marginBottom: "2rem" }}>
            {quiz.intro}
          </p>
          <button className="btn-primary" onClick={() => setStep("questions")}>
            Begin the diagnostic
          </button>
        </div>
      )}

      {/* ── QUESTIONS ── */}
      {step === "questions" && (
        <div key={questionKey} style={{ animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both" }}>
          {/* Progress */}
          <div style={{ marginBottom: "2rem" }}>
            <div className="flex justify-between items-center mb-2">
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>
                {currentQ + 1} / {total}
              </p>
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>
                {Math.round(progressPct)}% complete
              </p>
            </div>
            <div style={{ height: 2, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 1, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #E92904, #FD6910)",
                  transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.5,
              color: "#FFFFFF",
              marginBottom: "1.75rem",
            }}
          >
            {q.question}
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(q.id, opt.value)}
                  className="quiz-option"
                  style={{
                    textAlign: "left",
                    padding: "0.875rem 1.25rem",
                    border: selected ? "2px solid #E92904" : "2px solid rgba(255,255,255,0.1)",
                    backgroundColor: selected ? "rgba(233,41,4,0.14)" : "rgba(255,255,255,0.025)",
                    color: selected ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    fontFamily: "'Jost', sans-serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.875rem",
                    animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s both`,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: selected ? "2px solid #E92904" : "2px solid rgba(255,255,255,0.2)",
                      backgroundColor: selected ? "#E92904" : "transparent",
                      flexShrink: 0,
                      marginTop: "0.15rem",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#fff", display: "block" }} />
                    )}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={goBack}
              disabled={currentQ === 0}
              style={{
                background: "none",
                border: "none",
                color: currentQ === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)",
                cursor: currentQ === 0 ? "default" : "pointer",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: 0,
                transition: "color 0.2s",
              }}
            >
              ← Back
            </button>

            {answered === total ? (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                style={{ animation: "fadeIn 0.4s 0.1s both" }}
              >
                See my result
              </button>
            ) : currentQ < total - 1 && answers[q.id] ? (
              <button
                onClick={() => { setCurrentQ((q) => q + 1); setQuestionKey((k) => k + 1); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: 0,
                }}
              >
                Next →
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {step === "result" && result && (
        <div className="quiz-result-enter">
          <p className="eyebrow mb-2" style={{ color: "#FD6910" }}>Your pattern</p>
          <h3 style={{ color: "#FFFFFF", marginBottom: "1.25rem" }}>{result.title}</h3>

          {/* The named pattern — core brand value moment */}
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.1rem",
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "#FFFFFF",
              borderLeft: "3px solid #E92904",
              paddingLeft: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            {result.pattern}
          </p>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9375rem", lineHeight: 1.8, marginBottom: "1.75rem" }}>
            {result.description}
          </p>

          {/* Book section — updated label */}
          <div
            style={{
              backgroundColor: "rgba(253,105,16,0.07)",
              borderLeft: "3px solid #FD6910",
              padding: "1rem 1.25rem",
              marginBottom: "2rem",
              animation: "fadeUp 0.5s 0.25s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <p className="eyebrow mb-2" style={{ color: "#FD6910", fontSize: "0.65rem" }}>
              The part most likely to shift something for you
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.75 }}>
              {result.bookSection}
            </p>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 mb-5"
            style={{ animation: "fadeUp 0.5s 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {bookStatus === "available" && result.ctaHref === "buy" ? (
              <BuyButton bookSlug={bookSlug} label={result.cta} />
            ) : bookStatus === "available" ? (
              <a href={result.ctaHref} className="btn-primary">{result.cta}</a>
            ) : (
              <a href={result.ctaHref} className="btn-secondary">{result.cta}</a>
            )}
            {result.ctaSecondary && result.ctaSecondaryHref && (
              <Link href={result.ctaSecondaryHref} className="btn-secondary">
                {result.ctaSecondary}
              </Link>
            )}
          </div>

          <button
            onClick={handleReset}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: 0,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            Retake the diagnostic
          </button>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Coaching",
  description:
    "1:1 high-ticket coaching and corporate leadership programmes for capable people and organisations ready for the accelerated version of the work.",
};

const objections = [
  {
    q: "I've tried coaching before. How is this different?",
    a: "Most coaching addresses the symptom — the tactics, the accountability, the plan. This addresses the state that determines whether any plan gets executed. If what you've tried has worked, you wouldn't still be stuck. The fact that you are is not a failure. It is a signal that the work has been aimed at the wrong level.",
  },
  {
    q: "Is this mindset work? I've done mindset work.",
    a: "No. Mindset work is usually reframing — replacing one thought with another. What we address is the internal structure that generates thoughts in the first place. The state that makes the reframe necessary to begin with. That is a different level of work, and it produces a different kind of result.",
  },
  {
    q: "How do I know if I'm ready?",
    a: "If you are asking that question, you are probably ready. The people who are not ready do not wonder whether they are. They are still convinced that the right framework, the right system, or the right level of effort will close the gap. If you suspect the obstacle is internal — and you are tired of being right about that without moving through it — that is the readiness this work requires.",
  },
  {
    q: "What does the investment look like?",
    a: "Coaching at this level is a significant investment. The starting point is a discovery call, which costs nothing. What comes after that conversation will be specific to what is actually needed — not a packaged programme delivered uniformly, but a response to the actual situation.",
  },
];

export default function CoachingPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "#0D1B27", color: "#FFFFFF", minHeight: "65vh" }}
        className="flex items-center section-pad"
      >
        <div style={{ maxWidth: "1280px" }} className="mx-auto w-full">
          <div style={{ maxWidth: "760px" }}>
            <p className="eyebrow mb-6" style={{ color: "#FD6910" }}>
              Coaching & programmes
            </p>
            <h1 style={{ color: "#FFFFFF", marginBottom: "1.5rem" }}>
              The book addresses the pattern.{" "}
              <span style={{ color: "#E92904" }}>Coaching dissolves it.</span>
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "580px",
                marginBottom: "3rem",
              }}
            >
              When the self-limiting beliefs are dissolved and the golden handcuffs come off,
              what becomes available is not a better version of the same life — it is the
              freedom to build one you don&apos;t want to retire from.
            </p>
            <Link href="#discovery" className="btn-primary">
              Book a discovery call
            </Link>
          </div>
        </div>
      </section>

      {/* 1:1 Coaching */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <span className="fire-line" />
              <p className="eyebrow mb-4">1:1 Coaching</p>
              <h2 style={{ maxWidth: "460px", marginBottom: "1.5rem" }}>
                For individuals who are ready to move
              </h2>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                The 1:1 work is for capable, intelligent adults — entrepreneurs, leaders,
                creatives, professionals — who have arrived at the specific kind of stuck
                that effort and information do not resolve.
              </p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Not people who need a plan. People who have the plan and are not executing
                it. Not people who need more knowledge. People who understand the situation
                and cannot close the gap between understanding and action.
              </p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                The work addresses the internal state from which all action flows. When the
                state shifts, the action that was previously impossible becomes the only
                logical next step.
              </p>
              <Link href="#discovery" className="btn-outline-dark">
                Start with a discovery call
              </Link>
            </div>

            <div>
              <p className="eyebrow mb-6" style={{ color: "rgba(43,63,81,0.45)" }}>
                Who this is for
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Leaders who have plateaued and cannot identify why",
                  "Entrepreneurs who keep stopping before the breakthrough",
                  "Creatives who know their vision and cannot execute consistently",
                  "Professionals in transition who are overthinking and paralysed",
                  "High-achievers experiencing conflict between ambition and meaning",
                  "Anyone trapped in golden handcuffs — wanting liberation but unable to move",
                  "People in analysis paralysis — knowing the decision but not taking the step",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.875rem",
                      marginBottom: "1rem",
                      fontSize: "0.9375rem",
                      lineHeight: 1.75,
                      color: "rgba(43,63,81,0.75)",
                      borderBottom: "1px solid rgba(43,63,81,0.07)",
                      paddingBottom: "1rem",
                    }}
                  >
                    <span style={{ color: "#E92904", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section
        style={{ backgroundColor: "#2B3F51", color: "#FFFFFF" }}
        className="section-pad"
      >
        <div style={{ maxWidth: "860px" }} className="mx-auto text-center">
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontStyle: "italic",
              lineHeight: 1.45,
              color: "#FFFFFF",
              marginBottom: "2rem",
            }}
          >
            &ldquo;You don&apos;t need to be fired up. You don&apos;t need another system.
            You need to understand what has been stopping you — and then be free of it.&rdquo;
          </p>
          <span className="fire-line" style={{ margin: "0 auto" }} />
        </div>
      </section>

      {/* Corporate */}
      <section style={{ backgroundColor: "#FDFBF8" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div style={{ order: 2 }}>
              <span className="fire-line" />
              <p className="eyebrow mb-4">Corporate & Leadership</p>
              <h2 style={{ maxWidth: "480px", marginBottom: "1.5rem" }}>
                When the organisation is the client
              </h2>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Leadership programmes for organisations that understand the difference
                between training and transformation. The work is designed for C-suite leaders,
                founders, and senior leadership teams where internal state — not process — is
                the limiting factor on performance.
              </p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Productivity systems optimise the wrong variable. Output increases when the
                internal readiness of the people producing it increases. That is where this
                work operates.
              </p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Corporate engagements begin with a diagnostic conversation — not a generic
                proposal, but a specific response to the actual situation in the organisation.
              </p>
              <Link href="#discovery" className="btn-outline-dark">
                Enquire about corporate programmes
              </Link>
            </div>

            <div style={{ order: 1 }}>
              <p className="eyebrow mb-6" style={{ color: "rgba(43,63,81,0.45)" }}>
                Designed for
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    role: "C-Suite & Founders",
                    desc: "Leaders whose organisations are performing below the ceiling their own capability sets, and who suspect the limitation is internal.",
                  },
                  {
                    role: "Senior Leadership Teams",
                    desc: "Groups where high individual capability is not translating into collective performance — where the friction is relational and internal, not structural.",
                  },
                  {
                    role: "L&D & HR Directors",
                    desc: "Buyers looking for programmes that produce measurable internal change, not participation metrics and satisfaction scores.",
                  },
                ].map((item) => (
                  <div
                    key={item.role}
                    style={{
                      borderLeft: "3px solid #E92904",
                      paddingLeft: "1.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700,
                        fontSize: "1.0625rem",
                        marginBottom: "0.5rem",
                        color: "#0D1B27",
                      }}
                    >
                      {item.role}
                    </p>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "rgba(43,63,81,0.65)" }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objections */}
      <section style={{ backgroundColor: "#0D1B27", color: "#FFFFFF" }} className="section-pad">
        <div style={{ maxWidth: "1280px" }} className="mx-auto">
          <div className="mb-14">
            <span className="fire-line" />
            <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>Honest answers</p>
            <h2 style={{ color: "#FFFFFF", maxWidth: "460px" }}>
              Questions worth asking before you decide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-1">
            {objections.map((item, i) => (
              <Reveal key={i} delay={((i % 2) + 1) as 1|2}>
              <div
                className="card-lift"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  padding: "2.25rem",
                  borderLeft: "3px solid rgba(253,105,16,0.4)",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.0625rem",
                    fontStyle: "italic",
                    color: "#FFFFFF",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;{item.q}&rdquo;
                </p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem", lineHeight: 1.8 }}>
                  {item.a}
                </p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery CTA */}
      <section
        id="discovery"
        style={{
          background: "linear-gradient(135deg, #0D1B27 0%, #2B3F51 100%)",
          color: "#FFFFFF",
          borderTop: "3px solid #E92904",
        }}
        className="section-pad"
      >
        <div style={{ maxWidth: "720px" }} className="mx-auto text-center">
          <span className="fire-line" style={{ margin: "0 auto 1.5rem" }} />
          <p className="eyebrow mb-4" style={{ color: "#FD6910" }}>
            The first step
          </p>
          <h2 style={{ color: "#FFFFFF", marginBottom: "1.25rem" }}>
            A discovery call. No commitment required.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: "3rem",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              maxWidth: "560px",
              margin: "0 auto 3rem",
            }}
          >
            The discovery call is not a sales call. It is a conversation to understand
            whether this is the right work for your specific situation. If it is, we will
            say so. If it is not, we will say that too.
          </p>
          <a
            href="mailto:hello@liberatorgroup.com"
            className="btn-primary"
          >
            Request a discovery call
          </a>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Or email us directly at hello@liberatorgroup.com
          </p>
        </div>
      </section>
    </>
  );
}

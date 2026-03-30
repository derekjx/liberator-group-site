"use client";

import { useEffect, useRef, ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** "up" (default) | "left" | "right" | "fade" */
  direction?: "up" | "left" | "right" | "fade";
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  style?: CSSProperties;
}

export default function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass =
    direction === "left" ? "reveal-left" :
    direction === "right" ? "reveal-right" :
    "reveal";

  const delayClass = delay ? `delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`${dirClass} ${delayClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

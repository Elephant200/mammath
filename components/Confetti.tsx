"use client";

import { useMemo } from "react";

const COLORS = ["var(--accent)", "var(--gold)", "var(--text)"];

export function Confetti({ count = 28 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: COLORS[i % COLORS.length],
        rounded: Math.random() > 0.5,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            background: p.color,
            borderRadius: p.rounded ? "50%" : "1px",
          }}
        />
      ))}
    </div>
  );
}

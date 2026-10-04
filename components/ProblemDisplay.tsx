"use client";

import { useGameStore } from "@/lib/store/useGameStore";

export function ProblemDisplay() {
  const current = useGameStore((s) => s.current);
  const input = useGameStore((s) => s.input);
  const phase = useGameStore((s) => s.phase);

  if (!current) return null;

  const answerStr = String(current.answer);
  const chars = input.split("");

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div className="flex items-center gap-3 leading-none text-5xl md:text-6xl font-semibold tracking-tight">
        <span className="text-sub">{current.text}</span>
        <span className="text-sub">=</span>
        <span className="inline-flex items-center min-w-[0.6em]">
          {chars.map((c, i) => (
            <span
              key={i}
              className={c === answerStr[i] ? "text-text" : "text-error"}
            >
              {c}
            </span>
          ))}
          <span
            className={`caret ${phase === "running" ? "typing" : ""}`}
            style={{ height: "1em", marginLeft: input ? "0.04em" : 0 }}
          />
        </span>
      </div>
    </div>
  );
}

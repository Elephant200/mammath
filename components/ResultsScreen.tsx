"use client";

import { DIFFICULTY_LABELS } from "@/lib/engine/difficulty";
import { OP_SYMBOL, RunResult } from "@/lib/engine/types";
import { useGameStore } from "@/lib/store/useGameStore";
import { Confetti } from "./Confetti";
import { PerOpBreakdown } from "./PerOpBreakdown";
import { SpeedGraph } from "./SpeedGraph";

function Stat({
  label,
  value,
  big,
  accent,
}: {
  label: string;
  value: string;
  big?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sub text-xs uppercase tracking-wider">{label}</span>
      <span
        className={`tabular-nums font-bold ${big ? "text-5xl" : "text-2xl"} ${
          accent ? "text-accent" : "text-text"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function ResultsScreen({ result }: { result: RunResult }) {
  const isPB = useGameStore((s) => s.isPB);
  const restart = useGameStore((s) => s.restart);

  const modeLabel =
    result.mode === "time"
      ? `${result.param}s`
      : `${result.param} problems`;

  return (
    <div className="w-full max-w-2xl mx-auto pop-in">
      {isPB && <Confetti />}

      <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
        <Stat label="opm" value={String(result.opm)} big accent />
        <div className="flex gap-8">
          <Stat label="acc" value={`${result.accuracy}%`} />
          <Stat label="consistency" value={`${result.consistency}%`} />
          <Stat label="solved" value={String(result.problemsSolved)} />
        </div>
      </div>

      {isPB && (
        <div className="mb-5 inline-flex items-center gap-2 text-gold text-sm font-semibold">
          ❄ new personal best — mammathematical!
        </div>
      )}

      <div className="rounded-lg bg-bg-alt p-4 mb-6">
        <SpeedGraph perSecond={result.perSecond} />
      </div>

      <div className="flex flex-wrap gap-x-12 gap-y-6 mb-8">
        <PerOpBreakdown perOp={result.perOp} />
        <div className="text-sm text-sub space-y-1">
          <div className="text-xs uppercase tracking-wider mb-2">test</div>
          <div>
            <span className="text-text">{modeLabel}</span> ·{" "}
            {DIFFICULTY_LABELS[result.difficulty]}
          </div>
          <div className="flex gap-1">
            {result.ops.map((o) => (
              <span key={o} className="text-accent">
                {OP_SYMBOL[o]}
              </span>
            ))}
          </div>
          <div>{result.elapsedSeconds}s elapsed</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={restart}
          className="px-4 py-2 rounded-md bg-accent text-bg font-semibold hover:opacity-90 transition-opacity"
        >
          next test
        </button>
        <span className="text-sub text-xs">
          <kbd className="text-text">enter</kbd> next ·{" "}
          <kbd className="text-text">tab</kbd> restart
        </span>
      </div>
    </div>
  );
}

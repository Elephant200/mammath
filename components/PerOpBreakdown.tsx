"use client";

import { OP_NAME, OP_SYMBOL, PerOpStat } from "@/lib/engine/types";

export function PerOpBreakdown({ perOp }: { perOp: PerOpStat[] }) {
  if (perOp.length === 0) return null;

  const slowest = perOp.reduce((a, b) => (b.avgMs > a.avgMs ? b : a));

  return (
    <div className="w-full">
      <div className="text-sub text-xs uppercase tracking-wider mb-2">
        by operation
      </div>
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 gap-y-1.5 text-sm tabular-nums">
        {perOp.map((s) => {
          const isSlowest = perOp.length > 1 && s.op === slowest.op;
          return (
            <div key={s.op} className="contents">
              <span
                className="text-accent text-base"
                title={OP_NAME[s.op]}
              >
                {OP_SYMBOL[s.op]}
              </span>
              <span className="text-sub self-center">
                {s.count} solved
                {isSlowest && (
                  <span className="text-gold ml-2 text-xs">slowest</span>
                )}
              </span>
              <span
                className="self-center text-right"
                title="average seconds per problem"
              >
                {(s.avgMs / 1000).toFixed(2)}s
              </span>
              <span
                className="self-center text-right text-sub"
                title="solved with no mistake"
              >
                {Math.round(s.accuracy)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

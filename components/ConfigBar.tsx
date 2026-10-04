"use client";

import { useGameStore } from "@/lib/store/useGameStore";
import {
  ALL_OPS,
  COUNT_PARAMS,
  Mode,
  OP_SYMBOL,
  TIME_PARAMS,
} from "@/lib/engine/types";
import { DIFFICULTIES } from "@/lib/engine/difficulty";

function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1 rounded-md transition-colors ${
        active ? "text-accent" : "text-sub hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

export function ConfigBar() {
  const config = useGameStore((s) => s.config);
  const setConfig = useGameStore((s) => s.setConfig);
  const toggleOp = useGameStore((s) => s.toggleOp);

  const params = config.mode === "time" ? TIME_PARAMS : COUNT_PARAMS;

  const setMode = (mode: Mode) => {
    const fallback = mode === "time" ? 30 : 25;
    const list = mode === "time" ? TIME_PARAMS : COUNT_PARAMS;
    const param = list.includes(config.param) ? config.param : fallback;
    setConfig({ mode, param });
  };

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-x-1 gap-y-2 rounded-lg bg-bg-alt px-3 py-2 text-sm">
      {/* ops */}
      <div className="flex items-center">
        {ALL_OPS.map((op) => (
          <Chip
            key={op}
            active={config.ops.includes(op)}
            onClick={() => toggleOp(op)}
            title={`toggle ${OP_SYMBOL[op]}`}
          >
            <span className="text-base leading-none">{OP_SYMBOL[op]}</span>
          </Chip>
        ))}
      </div>

      <Divider />

      {/* difficulty */}
      <div className="flex items-center">
        {DIFFICULTIES.map((d) => (
          <Chip
            key={d}
            active={config.difficulty === d}
            onClick={() => setConfig({ difficulty: d })}
          >
            {d}
          </Chip>
        ))}
      </div>

      <Divider />

      {/* mode */}
      <div className="flex items-center">
        <Chip active={config.mode === "time"} onClick={() => setMode("time")}>
          time
        </Chip>
        <Chip active={config.mode === "count"} onClick={() => setMode("count")}>
          count
        </Chip>
      </div>

      <Divider />

      {/* param */}
      <div className="flex items-center">
        {params.map((p) => (
          <Chip
            key={p}
            active={config.param === p}
            onClick={() => setConfig({ param: p })}
          >
            {p}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-sub-alt" aria-hidden="true" />;
}

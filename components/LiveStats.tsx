"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store/useGameStore";

export function LiveStats() {
  const phase = useGameStore((s) => s.phase);
  const config = useGameStore((s) => s.config);
  const startTime = useGameStore((s) => s.startTime);
  const solved = useGameStore((s) => s.entries.length);
  const finish = useGameStore((s) => s.finish);

  const [elapsedMs, setElapsedMs] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running" || startTime === null) {
      setElapsedMs(0);
      return;
    }
    let active = true;
    const loop = () => {
      if (!active) return;
      const elapsed = performance.now() - startTime;
      setElapsedMs(elapsed);
      if (config.mode === "time" && elapsed >= config.param * 1000) {
        finish();
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [phase, startTime, config.mode, config.param, finish]);

  const elapsedSec = elapsedMs / 1000;
  const liveOpm = elapsedSec > 0.3 ? (solved * 60) / elapsedSec : 0;

  let primary: string;
  if (config.mode === "time") {
    const remaining = Math.max(0, config.param - elapsedSec);
    primary = String(Math.ceil(remaining));
  } else {
    primary = `${solved}/${config.param}`;
  }

  return (
    <div className="flex items-center gap-6 text-accent font-semibold tabular-nums">
      <span className="text-2xl" title={config.mode === "time" ? "seconds left" : "problems"}>
        {primary}
      </span>
      <span className="text-sub text-sm" title="live operations per minute">
        {Math.round(liveOpm)} opm
      </span>
    </div>
  );
}

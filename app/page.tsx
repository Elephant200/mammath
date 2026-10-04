"use client";

import { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { ConfigBar } from "@/components/ConfigBar";
import { ProblemDisplay } from "@/components/ProblemDisplay";
import { LiveStats } from "@/components/LiveStats";
import { ResultsScreen } from "@/components/ResultsScreen";
import { useGameStore } from "@/lib/store/useGameStore";

export default function Home() {
  const hydrate = useGameStore((s) => s.hydrate);
  const phase = useGameStore((s) => s.phase);
  const result = useGameStore((s) => s.result);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // single source of truth for all gameplay keyboard input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore when a modifier is held (browser shortcuts) or typing in a field
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const { phase: p, restart, inputDigit, backspace } = useGameStore.getState();

      if (e.key === "Tab") {
        e.preventDefault();
        restart();
        return;
      }
      if (e.key === "Escape") {
        restart();
        return;
      }
      if (p === "finished") {
        if (e.key === "Enter") {
          e.preventDefault();
          restart();
        }
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        inputDigit(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <TopBar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16 gap-10">
        {phase === "finished" && result ? (
          <ResultsScreen result={result} />
        ) : (
          <>
            <div className="min-h-9 flex items-center">
              {phase === "running" ? <LiveStats /> : <ConfigBar />}
            </div>
            <ProblemDisplay />
            <p className="text-sub text-xs h-4">
              {phase === "idle"
                ? "type the answer to begin · stay mammathematical"
                : ""}
            </p>
          </>
        )}
      </main>
    </>
  );
}

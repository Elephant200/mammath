"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { HistoryChart } from "@/components/HistoryChart";
import { RunResult, describeConfigKey } from "@/lib/engine/types";
import {
  loadHistory,
  loadPersonalBests,
  loadStreak,
  PersonalBests,
} from "@/lib/history";
import { effectiveStreak, StreakState, EMPTY_STREAK } from "@/lib/streak";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-alt px-4 py-3 flex flex-col">
      <span className="text-sub text-xs uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
    </div>
  );
}

export default function StatsPage() {
  const [history, setHistory] = useState<RunResult[]>([]);
  const [pbs, setPbs] = useState<PersonalBests>({});
  const [streak, setStreak] = useState<StreakState>(EMPTY_STREAK);

  useEffect(() => {
    setHistory(loadHistory());
    setPbs(loadPersonalBests());
    setStreak(loadStreak());
  }, []);

  const totalProblems = history.reduce((a, r) => a + r.problemsSolved, 0);
  const totalSeconds = history.reduce((a, r) => a + r.elapsedSeconds, 0);
  const bestOpm = history.reduce((a, r) => Math.max(a, r.opm), 0);
  const recent = history.slice(-50).map((r) => r.opm);

  const pbEntries = Object.entries(pbs).sort((a, b) => b[1] - a[1]);

  const totalMinutes = Math.round(totalSeconds / 60);

  return (
    <>
      <TopBar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">your stats</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="streak" value={`${effectiveStreak(streak)} ❄`} />
          <StatCard label="longest" value={String(streak.longest)} />
          <StatCard label="best opm" value={String(bestOpm)} />
          <StatCard label="tests" value={String(history.length)} />
          <StatCard label="problems" value={String(totalProblems)} />
          <StatCard
            label="time"
            value={totalMinutes >= 1 ? `${totalMinutes}m` : `${Math.round(totalSeconds)}s`}
          />
        </div>

        <section className="mb-10">
          <h2 className="text-sm uppercase tracking-wider text-sub mb-3">
            opm over time (last 50)
          </h2>
          <div className="rounded-lg bg-bg-alt p-4">
            <HistoryChart values={recent} />
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wider text-sub mb-3">
            personal bests
          </h2>
          {pbEntries.length === 0 ? (
            <p className="text-sub text-sm">
              no bests yet — go crunch some numbers, mammath.
            </p>
          ) : (
            <div className="divide-y divide-sub-alt">
              {pbEntries.map(([key, opm]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-sub">{describeConfigKey(key)}</span>
                  <span className="text-accent font-bold tabular-nums">
                    {opm} opm
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

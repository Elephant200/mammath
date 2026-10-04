"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MammothLogo } from "./MammothLogo";
import { ThemeToggle } from "./ThemeToggle";
import { useDisplayStreak, useGameStore } from "@/lib/store/useGameStore";

export function TopBar() {
  const streak = useDisplayStreak();
  const hydrateStreak = useGameStore((s) => s.hydrateStreak);

  // ensure the streak reflects storage even on pages that don't run the game
  useEffect(() => {
    hydrateStreak();
  }, [hydrateStreak]);

  return (
    <header className="w-full max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-accent group-hover:opacity-80 transition-opacity">
          <MammothLogo />
        </span>
        <span className="text-xl font-bold tracking-tight">
          mam<span className="text-accent">math</span>
        </span>
      </Link>

      <nav className="flex items-center gap-5 text-sm">
        <span
          className="flex items-center gap-1 text-sub"
          title="daily streak — play at least one test a day"
        >
          <span className={streak > 0 ? "text-gold" : "text-sub"}>❄</span>
          <span className={streak > 0 ? "text-text" : "text-sub"}>{streak}</span>
        </span>
        <Link
          href="/stats"
          className="text-sub hover:text-text transition-colors"
        >
          stats
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

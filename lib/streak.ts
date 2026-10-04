export interface StreakState {
  current: number;
  longest: number;
  lastPlayedDate: string | null; // local YYYY-MM-DD
}

export const EMPTY_STREAK: StreakState = {
  current: 0,
  longest: 0,
  lastPlayedDate: null,
};

/** Local-time YYYY-MM-DD key. */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/** Apply a completed run on `today` to the streak. */
export function updateStreak(
  prev: StreakState,
  today: string = localDateKey(),
): StreakState {
  if (prev.lastPlayedDate === today) return prev; // already counted today

  let current: number;
  if (prev.lastPlayedDate && daysBetween(prev.lastPlayedDate, today) === 1) {
    current = prev.current + 1;
  } else {
    current = 1;
  }
  return {
    current,
    longest: Math.max(prev.longest, current),
    lastPlayedDate: today,
  };
}

/** Streak to display now: 0 if the last play is older than yesterday (broken). */
export function effectiveStreak(
  s: StreakState,
  today: string = localDateKey(),
): number {
  if (!s.lastPlayedDate) return 0;
  const gap = daysBetween(s.lastPlayedDate, today);
  if (gap <= 0) return s.current; // played today
  if (gap === 1) return s.current; // played yesterday, still alive
  return 0; // broken
}

import { RunResult } from "./engine/types";
import { load, save, STORAGE_KEYS } from "./storage/storage";
import { EMPTY_STREAK, StreakState, updateStreak } from "./streak";

const HISTORY_CAP = 1000;

export type PersonalBests = Record<string, number>;

export function loadHistory(): RunResult[] {
  return load<RunResult[]>(STORAGE_KEYS.history, []);
}

export function loadPersonalBests(): PersonalBests {
  return load<PersonalBests>(STORAGE_KEYS.personalBests, {});
}

export function loadStreak(): StreakState {
  return load<StreakState>(STORAGE_KEYS.streak, EMPTY_STREAK);
}

export interface RecordOutcome {
  isPB: boolean;
  previousBest: number | null;
  streak: StreakState;
}

/** Persist a finished run: history + personal best + streak. */
export function recordRun(result: RunResult): RecordOutcome {
  // history
  const history = loadHistory();
  history.push(result);
  if (history.length > HISTORY_CAP) history.splice(0, history.length - HISTORY_CAP);
  save(STORAGE_KEYS.history, history);

  // personal best (by config), keyed on opm
  const pbs = loadPersonalBests();
  const previousBest = pbs[result.configKey] ?? null;
  const isPB = previousBest === null || result.opm > previousBest;
  if (isPB) {
    pbs[result.configKey] = result.opm;
    save(STORAGE_KEYS.personalBests, pbs);
  }

  // streak
  const streak = updateStreak(loadStreak());
  save(STORAGE_KEYS.streak, streak);

  return { isPB, previousBest, streak };
}

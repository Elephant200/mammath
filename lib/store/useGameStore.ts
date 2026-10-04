"use client";

import { create } from "zustand";
import { generateProblem } from "../engine/generator";
import {
  ALL_OPS,
  GameConfig,
  Op,
  Problem,
  RunResult,
  SolveEntry,
} from "../engine/types";
import { computeResult } from "../results";
import { loadHistory, loadStreak, recordRun } from "../history";
import { load, save, STORAGE_KEYS } from "../storage/storage";
import { effectiveStreak, EMPTY_STREAK, StreakState } from "../streak";

export type Phase = "idle" | "running" | "finished";

const DEFAULT_CONFIG: GameConfig = {
  mode: "time",
  param: 30,
  ops: [...ALL_OPS],
  difficulty: "easy",
};

interface GameState {
  config: GameConfig;
  phase: Phase;
  current: Problem | null;
  input: string;
  entries: SolveEntry[];
  correctKeystrokes: number;
  errorKeystrokes: number;
  startTime: number | null;
  problemStartTime: number | null;
  /** whether the current (in-progress) problem has had a wrong keystroke */
  currentHadError: boolean;
  result: RunResult | null;
  isPB: boolean;
  streak: StreakState;

  hydrate: () => void;
  hydrateStreak: () => void;
  setConfig: (patch: Partial<GameConfig>) => void;
  toggleOp: (op: Op) => void;
  inputDigit: (digit: string) => void;
  backspace: () => void;
  finish: () => void;
  restart: () => void;
}

function persistSettings(config: GameConfig) {
  save(STORAGE_KEYS.settings, config);
}

export const useGameStore = create<GameState>((set, get) => ({
  config: DEFAULT_CONFIG,
  phase: "idle",
  current: null,
  input: "",
  entries: [],
  correctKeystrokes: 0,
  errorKeystrokes: 0,
  startTime: null,
  problemStartTime: null,
  currentHadError: false,
  result: null,
  isPB: false,
  streak: EMPTY_STREAK,

  hydrateStreak: () => {
    set({ streak: loadStreak() });
  },

  hydrate: () => {
    const config = load<GameConfig>(STORAGE_KEYS.settings, DEFAULT_CONFIG);
    // guard against empty op set from old data
    if (!config.ops?.length) config.ops = [...ALL_OPS];
    set({
      config,
      streak: loadStreak(),
      current: generateProblem(config),
      phase: "idle",
      input: "",
      entries: [],
      result: null,
    });
  },

  setConfig: (patch) => {
    const config = { ...get().config, ...patch };
    persistSettings(config);
    set({ config });
    get().restart();
  },

  toggleOp: (op) => {
    const cur = get().config.ops;
    const next = cur.includes(op) ? cur.filter((o) => o !== op) : [...cur, op];
    if (next.length === 0) return; // keep at least one op
    get().setConfig({ ops: next });
  },

  inputDigit: (digit) => {
    const state = get();
    if (state.phase === "finished") return;
    if (!/^[0-9]$/.test(digit)) return;

    const problem = state.current;
    if (!problem) return;
    const answerStr = String(problem.answer);

    // begin run on the first keystroke
    let { startTime, problemStartTime } = state;
    let phase = state.phase;
    if (phase === "idle") {
      const now = performance.now();
      startTime = now;
      problemStartTime = now;
      phase = "running";
    }

    // cap overtyping: never let the buffer grow far past the answer length
    if (state.input.length >= answerStr.length + 2) return;

    const index = state.input.length;
    const input = state.input + digit;

    // Monkeytype-style: wrong digits are accepted and shown in red; the player
    // fixes them with backspace. A digit is correct only if it matches the
    // expected digit at its position.
    const isCorrect = digit === answerStr[index];

    if (input === answerStr) {
      // solved
      const now = performance.now();
      const entry: SolveEntry = {
        op: problem.op,
        ms: now - (problemStartTime ?? now),
        t: now - (startTime ?? now),
        hadError: state.currentHadError,
      };
      const entries = [...state.entries, entry];
      const reachedCount =
        state.config.mode === "count" && entries.length >= state.config.param;

      set({
        phase,
        startTime,
        input: "",
        entries,
        correctKeystrokes: state.correctKeystrokes + 1,
        current: reachedCount ? problem : generateProblem(state.config, problem),
        problemStartTime: now,
        currentHadError: false,
      });

      if (reachedCount) get().finish();
      return;
    }

    set({
      phase,
      startTime,
      problemStartTime,
      input,
      correctKeystrokes: state.correctKeystrokes + (isCorrect ? 1 : 0),
      errorKeystrokes: state.errorKeystrokes + (isCorrect ? 0 : 1),
      currentHadError: state.currentHadError || !isCorrect,
    });
  },

  backspace: () => {
    const state = get();
    if (state.phase !== "running") return; // don't undo across problems / before start
    if (state.input.length === 0) return;
    set({ input: state.input.slice(0, -1) });
  },

  finish: () => {
    const state = get();
    if (state.phase === "finished") return;
    // nothing solved (e.g. time ran out on an untouched run): reset to idle
    if (state.startTime === null || state.entries.length === 0) {
      get().restart();
      return;
    }
    const elapsedMs =
      state.config.mode === "time"
        ? state.config.param * 1000
        : performance.now() - (state.startTime ?? performance.now());

    const result = computeResult({
      config: state.config,
      entries: state.entries,
      elapsedMs,
      correctKeystrokes: state.correctKeystrokes,
      errorKeystrokes: state.errorKeystrokes,
    });

    const outcome = recordRun(result);
    set({
      phase: "finished",
      result,
      isPB: outcome.isPB && result.problemsSolved > 0,
      streak: outcome.streak,
    });
  },

  restart: () => {
    const config = get().config;
    set({
      phase: "idle",
      current: generateProblem(config),
      input: "",
      entries: [],
      correctKeystrokes: 0,
      errorKeystrokes: 0,
      startTime: null,
      problemStartTime: null,
      currentHadError: false,
      result: null,
      isPB: false,
    });
  },
}));

/** Selector: streak count to show in the UI right now. */
export function useDisplayStreak(): number {
  const streak = useGameStore((s) => s.streak);
  return effectiveStreak(streak);
}

/** Non-reactive helper for components that need fresh history. */
export function getHistory(): RunResult[] {
  return loadHistory();
}

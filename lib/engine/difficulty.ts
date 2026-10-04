import { Difficulty, Op } from "./types";

export interface OperandRange {
  aMin: number;
  aMax: number;
  bMin: number;
  bMax: number;
}

/**
 * Operand ranges per difficulty per op.
 * For "/", a-range is the quotient and b-range is the divisor; the dividend is
 * computed as quotient * divisor so division is always clean (integer).
 */
export const DIFFICULTY_RANGES: Record<Difficulty, Record<Op, OperandRange>> = {
  easy: {
    "+": { aMin: 1, aMax: 9, bMin: 1, bMax: 9 },
    "-": { aMin: 1, aMax: 9, bMin: 1, bMax: 9 },
    "*": { aMin: 2, aMax: 9, bMin: 2, bMax: 9 },
    "/": { aMin: 2, aMax: 9, bMin: 2, bMax: 9 },
  },
  medium: {
    "+": { aMin: 10, aMax: 99, bMin: 10, bMax: 99 },
    "-": { aMin: 10, aMax: 99, bMin: 10, bMax: 99 },
    "*": { aMin: 2, aMax: 12, bMin: 11, bMax: 99 },
    "/": { aMin: 2, aMax: 12, bMin: 2, bMax: 12 },
  },
  hard: {
    "+": { aMin: 100, aMax: 999, bMin: 100, bMax: 999 },
    "-": { aMin: 100, aMax: 999, bMin: 100, bMax: 999 },
    "*": { aMin: 11, aMax: 99, bMin: 11, bMax: 99 },
    "/": { aMin: 11, aMax: 99, bMin: 2, bMax: 12 },
  },
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
};

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export type Op = "+" | "-" | "*" | "/";

export const ALL_OPS: Op[] = ["+", "-", "*", "/"];

export const OP_SYMBOL: Record<Op, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

export const OP_NAME: Record<Op, string> = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
};

export type Mode = "time" | "count";
export type Difficulty = "easy" | "medium" | "hard";

export interface Problem {
  a: number;
  b: number;
  op: Op;
  answer: number;
  /** Display text, e.g. "47 × 8" */
  text: string;
}

export interface GameConfig {
  mode: Mode;
  /** seconds (time mode) or number of problems (count mode) */
  param: number;
  ops: Op[];
  difficulty: Difficulty;
}

export interface SolveEntry {
  op: Op;
  /** ms taken to solve this problem */
  ms: number;
  /** ms since run start when solved */
  t: number;
  hadError: boolean;
}

export interface PerOpStat {
  op: Op;
  count: number;
  avgMs: number;
  /** 0-100, share of this op's problems solved with no mistake */
  accuracy: number;
}

export interface RunResult {
  id: string;
  dateISO: string;
  mode: Mode;
  param: number;
  difficulty: Difficulty;
  ops: Op[];
  configKey: string;
  opm: number;
  accuracy: number;
  consistency: number;
  problemsSolved: number;
  elapsedSeconds: number;
  perOp: PerOpStat[];
  /** ops completed in each whole second of the run */
  perSecond: number[];
}

export const TIME_PARAMS = [15, 30, 60, 120];
export const COUNT_PARAMS = [10, 25, 50, 100];

export function configKey(c: GameConfig): string {
  const ops = [...c.ops].sort().join("");
  return `${c.mode}:${c.param}:${c.difficulty}:${ops}`;
}

/** Human-readable label for a configKey, e.g. "30s · easy · + − × ÷". */
export function describeConfigKey(key: string): string {
  const [mode, param, difficulty, ops = ""] = key.split(":");
  const target = mode === "time" ? `${param}s` : `${param} probs`;
  const opSyms = (ops.split("") as Op[])
    .filter((o): o is Op => o in OP_SYMBOL)
    .map((o) => OP_SYMBOL[o])
    .join(" ");
  return `${target} · ${difficulty} · ${opSyms}`;
}

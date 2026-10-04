import {
  configKey,
  GameConfig,
  Op,
  PerOpStat,
  RunResult,
  SolveEntry,
} from "./engine/types";

/** Kogasa transform of a coefficient of variation -> 0..100 consistency. */
export function kogasa(cov: number): number {
  return 100 * (1 - Math.tanh(cov + cov ** 3 / 3 + cov ** 5 / 5));
}

function mean(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const variance = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
  return Math.sqrt(variance);
}

/** Bucket solves into whole-second op counts across the run. */
export function buildPerSecond(entries: SolveEntry[], elapsedMs: number): number[] {
  const seconds = Math.max(1, Math.ceil(elapsedMs / 1000));
  const buckets = new Array(seconds).fill(0);
  for (const e of entries) {
    const idx = Math.min(seconds - 1, Math.floor(e.t / 1000));
    buckets[idx] += 1;
  }
  return buckets;
}

function perOpStats(entries: SolveEntry[]): PerOpStat[] {
  const byOp = new Map<Op, SolveEntry[]>();
  for (const e of entries) {
    const list = byOp.get(e.op) ?? [];
    list.push(e);
    byOp.set(e.op, list);
  }
  const stats: PerOpStat[] = [];
  for (const [op, list] of byOp) {
    const clean = list.filter((e) => !e.hadError).length;
    stats.push({
      op,
      count: list.length,
      avgMs: mean(list.map((e) => e.ms)),
      accuracy: list.length ? (100 * clean) / list.length : 100,
    });
  }
  return stats;
}

export interface ComputeArgs {
  config: GameConfig;
  entries: SolveEntry[];
  elapsedMs: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
}

export function computeResult({
  config,
  entries,
  elapsedMs,
  correctKeystrokes,
  errorKeystrokes,
}: ComputeArgs): RunResult {
  const elapsedSeconds = Math.max(elapsedMs / 1000, 0.001);
  const problemsSolved = entries.length;
  const opm = (problemsSolved * 60) / elapsedSeconds;

  const totalKeys = correctKeystrokes + errorKeystrokes;
  const accuracy = totalKeys ? (100 * correctKeystrokes) / totalKeys : 100;

  const perSecond = buildPerSecond(entries, elapsedMs);
  // Use only fully-elapsed seconds for consistency (drop trailing partial second).
  const fullSeconds =
    perSecond.length > 1 ? perSecond.slice(0, perSecond.length - 1) : perSecond;
  const m = mean(fullSeconds);
  const cov = m > 0 ? stdDev(fullSeconds) / m : 0;
  const consistency = m > 0 ? kogasa(cov) : 0;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dateISO: new Date().toISOString(),
    mode: config.mode,
    param: config.param,
    difficulty: config.difficulty,
    ops: config.ops,
    configKey: configKey(config),
    opm: Math.round(opm * 10) / 10,
    accuracy: Math.round(accuracy * 10) / 10,
    consistency: Math.round(consistency * 10) / 10,
    problemsSolved,
    elapsedSeconds: Math.round(elapsedSeconds * 10) / 10,
    perOp: perOpStats(entries),
    perSecond,
  };
}

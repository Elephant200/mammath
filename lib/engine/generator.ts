import { DIFFICULTY_RANGES } from "./difficulty";
import { Difficulty, GameConfig, Op, OP_SYMBOL, Problem } from "./types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildProblem(op: Op, difficulty: Difficulty): Problem {
  const r = DIFFICULTY_RANGES[difficulty][op];
  let a: number;
  let b: number;
  let answer: number;

  switch (op) {
    case "+": {
      a = randInt(r.aMin, r.aMax);
      b = randInt(r.bMin, r.bMax);
      answer = a + b;
      break;
    }
    case "-": {
      let x = randInt(r.aMin, r.aMax);
      let y = randInt(r.bMin, r.bMax);
      if (y > x) [x, y] = [y, x]; // keep result non-negative
      a = x;
      b = y;
      answer = a - b;
      break;
    }
    case "*": {
      a = randInt(r.aMin, r.aMax);
      b = randInt(r.bMin, r.bMax);
      answer = a * b;
      break;
    }
    case "/": {
      const divisor = randInt(r.bMin, r.bMax);
      const quotient = randInt(r.aMin, r.aMax);
      a = divisor * quotient; // dividend
      b = divisor;
      answer = quotient;
      break;
    }
  }

  return { a, b, op, answer, text: `${a} ${OP_SYMBOL[op]} ${b}` };
}

/** Generate a problem from the config, avoiding an immediate repeat of `prev`. */
export function generateProblem(config: GameConfig, prev?: Problem | null): Problem {
  const ops = config.ops.length ? config.ops : (["+"] as Op[]);
  let p: Problem;
  let tries = 0;
  do {
    const op = ops[randInt(0, ops.length - 1)];
    p = buildProblem(op, config.difficulty);
    tries++;
  } while (prev && p.text === prev.text && tries < 8);
  return p;
}

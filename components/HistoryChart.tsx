"use client";

/** opm across recent runs, oldest -> newest. */
export function HistoryChart({ values }: { values: number[] }) {
  if (values.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-sub text-sm">
        play a few tests to see your progress here
      </div>
    );
  }

  const W = 640;
  const H = 200;
  const padL = 34;
  const padB = 18;
  const padT = 10;
  const padR = 6;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxY = Math.max(10, ...values);
  const n = values.length;

  const x = (i: number) => padL + (i / (n - 1)) * innerW;
  const y = (v: number) => padT + innerH - (v / maxY) * innerH;

  const linePts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaPts = `${padL},${padT + innerH} ${linePts} ${x(n - 1)},${padT + innerH}`;
  const yTicks = [0, Math.round(maxY / 2), Math.round(maxY)];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="opm over time">
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--sub-alt)" strokeWidth={1} />
          <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={9} fill="var(--sub)">
            {t}
          </text>
        </g>
      ))}
      <polygon points={areaPts} fill="var(--accent)" opacity={0.12} />
      <polyline
        points={linePts}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={1.6} fill="var(--accent)" />
      ))}
    </svg>
  );
}

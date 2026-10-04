"use client";

/** Instantaneous opm (ops/second * 60) over the run, drawn as an SVG line+area. */
export function SpeedGraph({ perSecond }: { perSecond: number[] }) {
  const series = perSecond.map((c) => c * 60);
  if (series.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-sub text-sm">
        not enough data for a graph — try a longer test
      </div>
    );
  }

  const W = 600;
  const H = 160;
  const padL = 34;
  const padB = 18;
  const padT = 10;
  const padR = 6;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxY = Math.max(10, ...series);
  const n = series.length;

  const x = (i: number) => padL + (i / (n - 1)) * innerW;
  const y = (v: number) => padT + innerH - (v / maxY) * innerH;

  const linePts = series.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaPts = `${padL},${padT + innerH} ${linePts} ${x(n - 1)},${padT + innerH}`;

  const yTicks = [0, Math.round(maxY / 2), Math.round(maxY)];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="speed over time"
    >
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(t)}
            y2={y(t)}
            stroke="var(--sub-alt)"
            strokeWidth={1}
          />
          <text
            x={padL - 6}
            y={y(t) + 3}
            textAnchor="end"
            fontSize={9}
            fill="var(--sub)"
          >
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
      <text x={padL} y={H - 5} fontSize={9} fill="var(--sub)">
        0s
      </text>
      <text x={W - padR} y={H - 5} fontSize={9} fill="var(--sub)" textAnchor="end">
        {n}s
      </text>
    </svg>
  );
}

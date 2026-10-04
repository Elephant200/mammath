export function MammothLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* tusks */}
      <path
        d="M20 44c-6 2-12 1-15-4"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 47c-5 4-11 5-16 2"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* body + head */}
      <path
        d="M30 14c12 0 20 8 20 20v6c0 6-4 10-10 10h-3v-8h-8v8h-4c-6 0-11-5-11-11 0-3 1-5 2-7-3-2-4-6-3-10 2 1 4 3 5 5 2-4 6-6 12-6Z"
        fill="currentColor"
      />
      {/* eye */}
      <circle cx="38" cy="28" r="2" fill="var(--bg)" />
    </svg>
  );
}

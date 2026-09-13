/**
 * Progress primitives — one bar, one ring, used across every screen.
 */

const BAR_TONES = {
  brand: "bg-brand",
  sage: "bg-sage",
  peach: "bg-peach",
  lilac: "bg-lilac",
  sky: "bg-sky",
  rose: "bg-rose",
  amber: "bg-amber",
};

export function ProgressBar({
  value = 0,
  tone = "brand",
  size = "md",
  className = "",
  label,
  trailing,
}) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className={className}>
      {(label || trailing) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-[0.78rem] text-ink-soft font-medium">{label}</span>}
          {trailing && <span className="text-[0.78rem] font-bold text-ink">{trailing}</span>}
        </div>
      )}
      <div
        className={`w-full ${h} rounded-full bg-canvas-deep overflow-hidden`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            BAR_TONES[tone] || BAR_TONES.brand
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const RING_HEX = {
  brand: "#c86b4a",
  sage: "#789178",
  peach: "#d4805c",
  lilac: "#8c5340",
  sky: "#5f7a60",
  rose: "#b85c4e",
  amber: "#d2a34a",
};

export function ProgressRing({
  value = 0,
  size = 150,
  thickness = 12,
  tone = "brand",
  label,
  caption,
  className = "",
}) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const color = RING_HEX[tone] || RING_HEX.brand;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#eee5d7"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center px-4">
        <div>
          <div
            className="font-bold leading-none tracking-tight"
            style={{ color, fontSize: size / 4 }}
          >
            {label ?? `${pct}%`}
          </div>
          {caption && (
            <div className="sm-eyebrow mt-1.5 text-[0.6rem]">{caption}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * LevelMeter — 3 segments for Beginner / Intermediate / Advanced.
 * `need` draws the target marker so a gap is readable at a glance.
 */
export function LevelMeter({ have = 0, need = null, tone = "brand", className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => {
        const filled = i < have;
        const isTarget = need !== null && i === need - 1;

        return (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              filled ? BAR_TONES[tone] || BAR_TONES.brand : "bg-canvas-deep"
            } ${isTarget && !filled ? "ring-2 ring-offset-1 ring-ink-faint/30 ring-offset-white" : ""}`}
          />
        );
      })}
    </div>
  );
}

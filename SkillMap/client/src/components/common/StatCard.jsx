import Icon from "./Icon";
import { ProgressBar } from "./Progress";

const TONES = {
  brand: { chip: "bg-brand-soft text-brand-deep ring-brand/12", bar: "brand" },
  sage: { chip: "bg-sage-soft text-sage ring-sage/15", bar: "sage" },
  peach: { chip: "bg-peach-soft text-peach ring-peach/15", bar: "peach" },
  lilac: { chip: "bg-lilac-soft text-lilac ring-lilac/12", bar: "lilac" },
  sky: { chip: "bg-sky-soft text-sky ring-sky/15", bar: "sky" },
  rose: { chip: "bg-rose-soft text-rose ring-rose/15", bar: "rose" },
  amber: { chip: "bg-amber-soft text-amber ring-amber/20", bar: "amber" },
};

/**
 * StatCard — the KPI tile used on Dashboard, Analysis and Progress.
 */
export default function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
  tone = "brand",
  progress = null,
  className = "",
}) {
  const t = TONES[tone] || TONES.brand;

  return (
    <div
      className={`sm-card p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_14px_30px_-18px_rgba(41,39,34,.18)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`grid place-items-center w-10 h-10 rounded-[12px] ring-1 ${t.chip}`}>
          <Icon name={icon} size={19} />
        </span>
        {hint && (
          <span className="text-[0.68rem] font-bold text-ink-faint text-right leading-tight max-w-24">
            {hint}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-[1.9rem] font-extrabold leading-none tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-[0.95rem] font-bold text-ink-faint">{suffix}</span>
        )}
      </div>

      <div className="sm-eyebrow mt-2">{label}</div>

      {progress !== null && (
        <ProgressBar value={progress} tone={t.bar} size="sm" className="mt-3" />
      )}
    </div>
  );
}

/* eslint-disable react-refresh/only-export-components --
   shared constants/helpers deliberately live beside their component */
import Icon from "./Icon";

const TONES = {
  neutral: "bg-canvas-deep/70 text-ink-soft border-line",
  brand: "bg-brand-soft text-brand-deep border-brand/15",
  sage: "bg-sage-soft text-sage border-sage/18",
  peach: "bg-peach-soft text-peach border-peach/18",
  lilac: "bg-lilac-soft text-lilac border-lilac/15",
  sky: "bg-sky-soft text-sky border-sky/18",
  rose: "bg-rose-soft text-rose border-rose/18",
  amber: "bg-amber-soft text-amber border-amber/25",
  solid: "bg-ink text-white border-ink",
};

/**
 * Badge — status / priority / meta pill.
 */
export default function Badge({
  tone = "neutral",
  icon,
  dot = false,
  size = "md",
  className = "",
  children,
}) {
  const sizing =
    size === "sm"
      ? "text-[0.665rem] px-2 py-0.5 gap-1"
      : "text-[0.72rem] px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold whitespace-nowrap
        ${TONES[tone] || TONES.neutral} ${sizing} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {icon && <Icon name={icon} size={12} strokeWidth={2.2} />}
      {children}
    </span>
  );
}

/** Maps the app's HIGH / MEDIUM / LOW priorities to a consistent tone. */
export const priorityTone = (p) =>
  p === "HIGH" ? "rose" : p === "MEDIUM" ? "amber" : "sage";

/** Maps skill status to a consistent tone. */
export const statusTone = (s) =>
  s === "matched" ? "sage" : s === "improve" ? "amber" : "rose";

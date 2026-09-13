import Icon from "./Icon";

const VARIANTS = {
  // a thin top highlight + short drop reads as a pressed physical key
  primary:
    "bg-brand text-white border border-brand-deep/25 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.17),0_1px_2px_rgba(41,39,34,.1),0_6px_14px_-9px_rgba(169,84,59,.55)] " +
    "hover:bg-brand-deep active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(41,39,34,.16)]",
  secondary:
    "bg-surface text-ink border border-line shadow-[0_1px_1.5px_rgba(41,39,34,.04)] " +
    "hover:border-brand/35 hover:text-brand-deep hover:bg-brand-soft/40 active:translate-y-px",
  soft:
    "bg-brand-soft text-brand-deep border border-brand/12 " +
    "hover:border-brand/30 active:translate-y-px",
  ghost:
    "bg-transparent text-ink-soft border border-transparent " +
    "hover:bg-brand-soft/55 hover:text-brand-deep",
  sage:
    "bg-sage text-white border border-sage/50 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.17),0_6px_14px_-9px_rgba(120,145,120,.7)] " +
    "hover:brightness-[.96] active:translate-y-px",
  danger:
    "bg-rose text-white border border-rose/50 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_6px_14px_-9px_rgba(184,92,78,.7)] " +
    "hover:brightness-[.96] active:translate-y-px",
};

const SIZES = {
  sm: "text-[0.78rem] px-3.5 py-2 rounded-xl gap-1.5",
  md: "text-[0.86rem] px-5 py-2.5 rounded-[14px] gap-2",
  lg: "text-[0.95rem] px-6 py-3.5 rounded-2xl gap-2.5",
};

/**
 * Button — the one tactile button used everywhere.
 */
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  full = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold tracking-[0.005em] whitespace-nowrap
        transition-all duration-150 disabled:opacity-45 disabled:cursor-not-allowed disabled:translate-y-0
        ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 19 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 19 : 16} />}
    </button>
  );
}

/**
 * IconButton — square, icon-only control (top bar, close actions).
 */
export function IconButton({
  icon,
  label,
  active = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`grid place-items-center w-10 h-10 rounded-[14px] border transition-all duration-150
        ${
          active
            ? "bg-brand-soft border-brand/25 text-brand-deep"
            : "bg-surface border-line text-ink-soft hover:text-brand-deep hover:border-brand/30"
        } ${className}`}
      {...rest}
    >
      <Icon name={icon} size={19} />
      {children}
    </button>
  );
}

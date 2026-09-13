import Icon from "./Icon";

const BASE =
  "w-full px-4 py-3 rounded-[14px] bg-surface border border-line text-[0.88rem] text-ink " +
  "placeholder:text-ink-faint outline-none transition-all duration-150 " +
  "focus:border-brand/45 focus:ring-4 focus:ring-brand/8 disabled:opacity-50";

/**
 * Field — labelled input / select / textarea, one look for every form.
 */
export default function Field({
  label,
  hint,
  required,
  as = "input",
  icon,
  className = "",
  children,
  ...rest
}) {
  const Tag = as;

  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="flex items-center gap-1.5 mb-1.5 text-[0.76rem] font-bold tracking-[0.06em] uppercase text-ink-soft">
          {label}
          {required && <span className="text-rose">*</span>}
        </span>
      )}

      <span className="relative block">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
            <Icon name={icon} size={17} />
          </span>
        )}

        <Tag
          className={`${BASE} ${icon ? "pl-10" : ""} ${
            as === "select" ? "appearance-none cursor-pointer pr-10" : ""
          } ${as === "textarea" ? "min-h-28 resize-y" : ""}`}
          {...rest}
        >
          {children}
        </Tag>

        {as === "select" && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
            <Icon name="chevronDown" size={16} />
          </span>
        )}
      </span>

      {hint && <span className="block mt-1.5 text-[0.74rem] text-ink-faint">{hint}</span>}
    </label>
  );
}

/**
 * FormNotice — inline success / error feedback (replaces blocking alerts).
 */
export function FormNotice({ type = "error", children }) {
  if (!children) return null;

  const styles =
    type === "success"
      ? "bg-sage-soft border-sage/25 text-sage"
      : "bg-rose-soft border-rose/25 text-rose";

  return (
    <div
      role="status"
      className={`flex items-start gap-2.5 px-4 py-3 rounded-[14px] border text-[0.83rem] font-semibold ${styles}`}
    >
      <Icon name={type === "success" ? "checkCircle" : "alert"} size={16} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

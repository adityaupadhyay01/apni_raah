/**
 * Card — the single surface primitive every screen builds on.
 */
export default function Card({
  as: Tag = "div",
  padded = true,
  flat = false,
  hover = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag
      className={`${flat ? "sm-card-flat" : "sm-card"} ${padded ? "p-5 sm:p-6" : ""} ${
        hover
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_14px_30px_-18px_rgba(41,39,34,.18)]"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * CardHeader — title / subtitle on the left, action on the right.
 */
// `icon` / `tone` are still accepted by call sites but no longer rendered —
// section headings read cleaner without a decorative chip in front of them.
export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h3 className="text-[1.02rem] font-semibold leading-snug truncate">{title}</h3>
        {subtitle && (
          <p className="text-[0.8rem] text-ink-faint leading-snug mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

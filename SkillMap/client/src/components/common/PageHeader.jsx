import Icon from "./Icon";

/**
 * PageHeader — consistent page title block across every screen.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && <div className="sm-eyebrow mb-1.5 text-brand/80">{eyebrow}</div>}
        <h1 className="text-[1.6rem] sm:text-[2rem] font-extrabold leading-[1.15]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-ink-soft text-[0.92rem] mt-1.5 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

/**
 * EmptyState — used when a screen genuinely has nothing to show.
 */
export function EmptyState({ icon = "sparkle", title, body, action }) {
  return (
    <div className="sm-card px-6 py-12 text-center">
      <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-soft text-brand mx-auto mb-4">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="text-lg font-bold mb-1.5">{title}</h3>
      {body && <p className="text-ink-soft text-sm max-w-md mx-auto">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

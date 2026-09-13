import { useNavigate } from "react-router-dom";

import Icon from "../common/Icon";
import { BrandLockup } from "../common/Logo";
import Button from "../common/Button";
import { LanguageSwitch } from "../layout/Topbar";
import { useLang } from "../../context/LanguageContext";

const POINTS = [
  { key: "auth_point_1", icon: "chart", tone: "bg-brand-soft text-brand" },
  { key: "auth_point_2", icon: "route", tone: "bg-lilac-soft text-lilac" },
  { key: "auth_point_3", icon: "globe", tone: "bg-sage-soft text-sage" },
];

/**
 * AuthLayout — shared split screen for sign in / sign up.
 */
export default function AuthLayout({ eyebrow, title, subtitle, children, wide = false }) {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      {/* BRAND PANEL */}
      <aside className="hidden lg:flex flex-col justify-between p-10 bg-canvas-deep/70 border-r border-line sm-glow">
        <BrandLockup
          size={42}
          tagline={tr("brand_tagline")}
          onClick={() => navigate("/")}
          className="self-start"
        />

        <div className="max-w-sm">
          <h2 className="text-[2rem] font-extrabold leading-[1.15] mb-4">
            {tr("auth_panel_title")}
          </h2>
          <p className="text-ink-soft text-[0.92rem] leading-relaxed mb-8">
            {tr("auth_panel_sub")}
          </p>

          <ul className="space-y-4">
            {POINTS.map((p) => (
              <li key={p.key} className="flex items-start gap-3">
                <span className={`grid place-items-center w-9 h-9 rounded-xl shrink-0 ${p.tone}`}>
                  <Icon name={p.icon} size={17} />
                </span>
                <span className="text-[0.88rem] font-semibold text-ink-soft leading-snug pt-1.5">
                  {tr(p.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <LanguageSwitch />
      </aside>

      {/* FORM PANEL */}
      <main className="flex flex-col px-5 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" icon="arrowLeft" onClick={() => navigate("/")}>
            {tr("back")}
          </Button>
          <div className="lg:hidden">
            <LanguageSwitch compact />
          </div>
        </div>

        <div
          className={`w-full mx-auto my-auto ${wide ? "max-w-2xl" : "max-w-md"} sm-rise`}
        >
          <div className="mb-7">
            <div className="sm-eyebrow mb-2 text-brand/80">{eyebrow}</div>
            <h1 className="text-[1.9rem] sm:text-[2.2rem] font-extrabold leading-tight">
              {title}
            </h1>
            <p className="text-ink-soft text-[0.92rem] mt-2">{subtitle}</p>
          </div>

          <div className="sm-card p-6 sm:p-7">{children}</div>
        </div>
      </main>
    </div>
  );
}

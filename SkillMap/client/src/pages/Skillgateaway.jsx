import { useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import { BrandLockup } from "../components/common/Logo";
import { LanguageSwitch } from "../components/layout/Topbar";
import { useLang } from "../context/LanguageContext";

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
  sky: "bg-sky-soft text-sky",
  amber: "bg-amber-soft text-amber",
};

function PathCard({ title, body, points, icon, tone, cta, onClick, featured }) {
  return (
    <button
      onClick={onClick}
      className={`group text-left w-full p-6 sm:p-7 rounded-card border transition-all duration-200
        hover:-translate-y-1 ${
          featured
            ? "bg-surface border-brand/25 shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_10px_24px_-16px_rgba(169,84,59,.32)]"
            : "bg-surface border-line shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_10px_24px_-16px_rgba(41,39,34,.16)]"
        } hover:shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_16px_32px_-20px_rgba(41,39,34,.2)]`}
    >
      <div className="mb-5">
        <span className={`grid place-items-center w-12 h-12 rounded-[18px] ${TONE_CHIP[tone]}`}>
          <Icon name={icon} size={23} />
        </span>
      </div>

      <h3 className="text-[1.3rem] font-bold mb-2 leading-tight">{title}</h3>
      <p className="text-[0.9rem] text-ink-soft leading-relaxed mb-5">{body}</p>

      <ul className="space-y-2 mb-6">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[0.84rem] text-ink-soft">
            <span className="grid place-items-center w-4.5 h-4.5 rounded-full bg-sage-soft text-sage shrink-0 mt-0.5">
              <Icon name="check" size={11} strokeWidth={3} />
            </span>
            {p}
          </li>
        ))}
      </ul>

      <span
        className={`inline-flex items-center gap-2 text-[0.87rem] font-bold transition-all duration-200
          group-hover:gap-3 ${featured ? "text-brand" : "text-ink"}`}
      >
        {cta}
        <Icon name="arrowRight" size={17} />
      </span>
    </button>
  );
}

export default function Gateway() {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <div className="min-h-screen flex flex-col sm-glow">
      {/* TOP BAR */}
      <header className="w-full px-5 sm:px-8 py-5 flex items-center justify-between max-w-[1200px] mx-auto shrink-0">
        <BrandLockup size={44} tagline={tr("brand_tagline")} compactTagline />

        <div className="flex items-center gap-2.5">
          <LanguageSwitch />
          <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>
            {tr("gw_signin")}
          </Button>
        </div>
      </header>

      {/* PATH CHOICE — vertically centred in the space below the top bar */}
      <section className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-5 sm-rise">
          <PathCard
            featured
            title={tr("gw_path_a_title")}
            body={tr("gw_path_a_body")}
            points={[tr("gw_path_a_1"), tr("gw_path_a_2"), tr("gw_path_a_3")]}
            icon="compass"
            tone="lilac"
            cta={tr("gw_path_a_cta")}
            onClick={() => navigate("/counselling")}
          />

          <PathCard
            title={tr("gw_path_b_title")}
            body={tr("gw_path_b_body")}
            points={[tr("gw_path_b_1"), tr("gw_path_b_2"), tr("gw_path_b_3")]}
            icon="target"
            tone="brand"
            cta={tr("gw_path_b_cta")}
            onClick={() => navigate("/landing")}
          />
        </div>
      </section>
    </div>
  );
}

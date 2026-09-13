import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Card from "../components/common/Card";
import RoleGrid from "../components/onboarding/RoleGrid";
import { LanguageSwitch } from "../components/layout/Topbar";
import { useLang } from "../context/LanguageContext";
import { ROLES } from "../utils/data";

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
  sky: "bg-sky-soft text-sky",
  amber: "bg-amber-soft text-amber",
};

/** Big choice tile, used for both the mode picker and the intent picker. */
function ChoiceCard({ icon, tone, title, body, cta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full p-6 rounded-card bg-surface border border-line
        shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_10px_24px_-16px_rgba(41,39,34,.16)]
        transition-all duration-200 hover:-translate-y-1
        hover:shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_16px_32px_-20px_rgba(41,39,34,.2)]"
    >
      <span className={`grid place-items-center w-11 h-11 rounded-[16px] mb-4 ${TONE_CHIP[tone]}`}>
        <Icon name={icon} size={21} />
      </span>

      <h3 className="text-[1.1rem] font-bold mb-1.5">{title}</h3>
      <p className="text-[0.85rem] text-ink-soft leading-relaxed mb-5">{body}</p>

      <span className="inline-flex items-center gap-2 text-[0.84rem] font-bold text-brand transition-all group-hover:gap-3">
        {cta}
        <Icon name="arrowRight" size={16} />
      </span>
    </button>
  );
}

function DomainCard({ icon, tone, title, body, roles, onClick }) {
  const { tr } = useLang();

  return (
    <button
      onClick={onClick}
      className="group text-left w-full p-6 rounded-card bg-surface border border-line
        shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_10px_24px_-16px_rgba(41,39,34,.16)]
        transition-all duration-200 hover:-translate-y-1
        hover:shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_16px_32px_-20px_rgba(41,39,34,.2)]"
    >
      <span className={`grid place-items-center w-11 h-11 rounded-[16px] mb-4 ${TONE_CHIP[tone]}`}>
        <Icon name={icon} size={21} />
      </span>

      <h3 className="text-[1.1rem] font-bold mb-1.5">{title}</h3>
      <p className="text-[0.85rem] text-ink-soft leading-relaxed mb-4">{body}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {roles.map((r) => (
          <span
            key={r}
            className="px-2.5 py-1 rounded-full bg-surface-muted border border-line-soft text-[0.72rem] font-semibold text-ink-soft"
          >
            {r}
          </span>
        ))}
      </div>

      <span className="inline-flex items-center gap-2 text-[0.84rem] font-bold text-brand transition-all group-hover:gap-3">
        {tr("ld_explore")}
        <Icon name="arrowRight" size={16} />
      </span>
    </button>
  );
}

/** Small section heading with an optional "change" action. */
function StepHead({ title, sub, onChange, changeLabel }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h2 className="text-[1.15rem] font-bold leading-snug">{title}</h2>
        {sub && <p className="text-[0.85rem] text-ink-soft mt-0.5">{sub}</p>}
      </div>
      {onChange && (
        <Button variant="ghost" size="sm" icon="refresh" onClick={onChange}>
          {changeLabel}
        </Button>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tr, trRole } = useLang();

  // a role suggested by counselling travels with the user through this screen
  const suggestedRole = location.state?.role;
  const carry = suggestedRole ? { state: { role: suggestedRole } } : undefined;

  // mode: null -> choose | "role" -> knows the exact role | "domain" -> knows the field
  const [mode, setMode] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [intent, setIntent] = useState(null); // "update" | "switch"
  const [targetRole, setTargetRole] = useState(null);

  const goToAssessment = (role) =>
    navigate("/onboarding", { state: { role, from: "landing" } });

  // Tech opens the existing guided role-finder, which then hands off to Skills
  const handleTechClick = () => navigate("/tech-consultation", carry);

  const resetRoleFlow = () => {
    setCurrentRole(null);
    setIntent(null);
    setTargetRole(null);
  };

  return (
    <div className="min-h-screen sm-glow">
      <header className="px-5 sm:px-8 py-5 flex items-center justify-between max-w-[1100px] mx-auto">
        <Button
          variant="ghost"
          icon="arrowLeft"
          onClick={() => (mode ? (setMode(null), resetRoleFlow()) : navigate("/"))}
        >
          {tr("back")}
        </Button>
        <LanguageSwitch />
      </header>

      <section className="px-5 sm:px-8 pt-4 pb-16 max-w-[1100px] mx-auto">
        {/* ── STEP 0 — role or domain? ───────────────────── */}
        {!mode && (
          <div className="grid sm:grid-cols-2 gap-5 sm-rise">
            <ChoiceCard
              icon="target"
              tone="brand"
              title={tr("ld_mode_role_title")}
              body={tr("ld_mode_role_body")}
              cta={tr("ld_mode_role_cta")}
              onClick={() => setMode("role")}
            />
            <ChoiceCard
              icon="grid"
              tone="sky"
              title={tr("ld_mode_domain_title")}
              body={tr("ld_mode_domain_body")}
              cta={tr("ld_mode_domain_cta")}
              onClick={() => setMode("domain")}
            />
          </div>
        )}

        {/* ── ROLE PATH ──────────────────────────────────── */}
        {mode === "role" && (
          <div className="sm-rise space-y-5">
            {/* pick the role they are in / targeting */}
            {!currentRole && (
              <Card>
                <StepHead title={tr("ld_pick_role")} sub={tr("ld_pick_role_sub")} />
                <RoleGrid
                  ROLES={ROLES}
                  selectedRole={currentRole}
                  setSelectedRole={(r) => {
                    setCurrentRole(r);
                    setIntent(null);
                  }}
                />
              </Card>
            )}

            {/* what do they want to do about it */}
            {currentRole && !intent && (
              <>
                <Card className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid place-items-center w-10 h-10 rounded-[14px] bg-brand-soft text-brand shrink-0">
                      <Icon name="target" size={19} />
                    </span>
                    <div className="min-w-0">
                      <div className="sm-eyebrow">{tr("ld_current_role")}</div>
                      <p className="text-[1rem] font-bold">{trRole(currentRole)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon="refresh" onClick={resetRoleFlow}>
                    {tr("ld_change")}
                  </Button>
                </Card>

                <div>
                  <StepHead title={tr("ld_intent_title")} sub={tr("ld_intent_sub")} />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <ChoiceCard
                      icon="trending"
                      tone="sage"
                      title={tr("ld_intent_update_title")}
                      body={tr("ld_intent_update_body")}
                      cta={tr("ld_intent_update_cta")}
                      onClick={() => goToAssessment(currentRole)}
                    />
                    <ChoiceCard
                      icon="route"
                      tone="peach"
                      title={tr("ld_intent_switch_title")}
                      body={tr("ld_intent_switch_body")}
                      cta={tr("ld_intent_switch_cta")}
                      onClick={() => setIntent("switch")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* switching — pick the career they want to move into */}
            {currentRole && intent === "switch" && (
              <Card>
                <StepHead
                  title={tr("ld_pick_target")}
                  sub={tr("ld_pick_target_sub", { role: trRole(currentRole) })}
                  onChange={() => setIntent(null)}
                  changeLabel={tr("back")}
                />

                <RoleGrid
                  ROLES={Object.fromEntries(
                    Object.entries(ROLES).filter(([r]) => r !== currentRole)
                  )}
                  selectedRole={targetRole}
                  setSelectedRole={setTargetRole}
                />

                <Button
                  size="lg"
                  className="mt-5"
                  iconRight="arrowRight"
                  disabled={!targetRole}
                  onClick={() => goToAssessment(targetRole)}
                >
                  {tr("cd_start")}
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── DOMAIN PATH ────────────────────────────────── */}
        {mode === "domain" && (
          <div className="sm-rise">
            <StepHead title={tr("ld_pick_domain")} sub={tr("ld_pick_domain_sub")} />

            <div className="grid sm:grid-cols-2 gap-5">
              <DomainCard
                icon="code"
                tone="brand"
                title={tr("ld_tech")}
                body={tr("ld_tech_body")}
                roles={["Web Developer", "Data Analyst", "ML Engineer", "DevOps"]}
                onClick={handleTechClick}
              />
              <DomainCard
                icon="sparkle"
                tone="lilac"
                title={tr("ld_design")}
                body={tr("ld_design_body")}
                roles={["UI/UX", "Product Design", "Graphics"]}
                onClick={() => navigate("/onboarding", carry)}
              />
              <DomainCard
                icon="chart"
                tone="sage"
                title={tr("ld_finance")}
                body={tr("ld_finance_body")}
                roles={["Analyst", "Accounting", "Trading"]}
                onClick={() => navigate("/onboarding", carry)}
              />
              <DomainCard
                icon="compass"
                tone="peach"
                title={tr("ld_explore_title")}
                body={tr("ld_explore_body")}
                roles={["Product", "Research", "Operations"]}
                onClick={() => navigate("/counselling")}
              />
            </div>
          </div>
        )}

        {/* ── ALWAYS AVAILABLE — fall back to the quiz ───── */}
        <div className="mt-9 sm-card p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <span className="grid place-items-center w-11 h-11 rounded-[16px] bg-amber-soft text-amber shrink-0">
              <Icon name="compass" size={21} />
            </span>
            <div>
              <p className="font-bold text-[0.95rem]">{tr("ld_unsure_title")}</p>
              <p className="text-[0.84rem] text-ink-soft">{tr("ld_unsure_body")}</p>
            </div>
          </div>
          <Button iconRight="arrowRight" onClick={() => navigate("/counselling")}>
            {tr("ld_unsure_cta")}
          </Button>
        </div>
      </section>
    </div>
  );
}

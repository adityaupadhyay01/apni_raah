import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import RoleGrid from "../components/onboarding/RoleGrid";
import SkillChips from "../components/onboarding/SkillChips";
import ProficiencyList from "../components/onboarding/ProficiencyList";
import ResumeUpload from "../components/onboarding/ResumeUpload";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";
import { ROLES, ALL_SKILLS, DEFAULT_LEVEL } from "../utils/data";
import { requiredLevel } from "../utils/roadmap";

const STEPS = ["ob_step_role", "ob_step_skills", "ob_step_levels"];

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tr, trRole } = useLang();
  const { completeAssessment } = useProfile();

  // a role can arrive pre-picked from career discovery
  const suggestedRole = ROLES[location.state?.role] ? location.state.role : null;

  const [selectedRole, setSelectedRole] = useState(suggestedRole);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillLevels, setSkillLevels] = useState({});
  const [customSkill, setCustomSkill] = useState("");
  const [resumeActive, setResumeActive] = useState(false);

  const toggleSkill = (s) => {
    setSelectedSkills((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s]
    );
    setSkillLevels((p) => (p[s] ? p : { ...p, [s]: DEFAULT_LEVEL }));
  };

  const setSkillLevel = (skill, level) =>
    setSkillLevels((p) => ({ ...p, [skill]: level }));

  const addCustom = () => {
    const s = customSkill.trim();
    if (s && !selectedSkills.includes(s)) {
      setSelectedSkills((p) => [...p, s]);
      setSkillLevels((p) => ({ ...p, [s]: DEFAULT_LEVEL }));
      setCustomSkill("");
    }
  };

  // simulated resume parsing — pre-fills a few role skills
  const handleResume = () => {
    setResumeActive(true);

    const sim = selectedRole
      ? ROLES[selectedRole].skills.slice(0, 3)
      : ["Python", "SQL", "Excel"];

    setTimeout(() => {
      sim.forEach((s) => {
        setSelectedSkills((p) => (p.includes(s) ? p : [...p, s]));
        setSkillLevels((p) => (p[s] ? p : { ...p, [s]: DEFAULT_LEVEL }));
      });
    }, 700);
  };

  const roleData = selectedRole ? ROLES[selectedRole] : null;

  const requiredLevels = roleData
    ? Object.fromEntries(
        roleData.skills.map((s) => [s, requiredLevel(roleData.priorities?.[s] || "MEDIUM")])
      )
    : {};

  const coverage = roleData
    ? Math.round(
        (roleData.skills.filter((s) => selectedSkills.includes(s)).length /
          roleData.skills.length) *
          100
      )
    : 0;

  const activeStep = !selectedRole ? 0 : selectedSkills.length === 0 ? 1 : 2;
  const canSubmit = Boolean(selectedRole) && selectedSkills.length > 0;

  const submit = () => {
    completeAssessment(selectedRole, selectedSkills, skillLevels);
    navigate("/analysis");
  };

  return (
    <div className="pb-28">
      <PageHeader
        eyebrow={tr("ob_kicker")}
        title={tr("ob_title_1")}
        subtitle={tr("ob_sub")}
      />

      {/* STEPPER */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        {STEPS.map((key, i) => {
          const done = i < activeStep;
          const active = i === activeStep;

          return (
            <div key={key} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full border transition-all ${
                  active
                    ? "border-brand/35 bg-surface shadow-[0_1px_1.5px_rgba(41,39,34,.04)]"
                    : done
                    ? "border-sage/30 bg-sage-soft"
                    : "border-line bg-canvas-deep/60"
                }`}
              >
                <span
                  className={`grid place-items-center w-6 h-6 rounded-full text-[0.72rem] font-bold ${
                    active
                      ? "bg-brand text-white"
                      : done
                      ? "bg-sage text-white"
                      : "bg-surface text-ink-faint border border-line"
                  }`}
                >
                  {done ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`text-[0.8rem] font-bold ${
                    active ? "text-ink" : done ? "text-sage" : "text-ink-faint"
                  }`}
                >
                  {tr(key)}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <Icon name="chevronRight" size={14} className="text-ink-faint" />
              )}
            </div>
          );
        })}
      </div>

      {suggestedRole && (
        <Card className="mb-5 flex flex-wrap items-center gap-3 border-sage/30 bg-sage-soft/40">
          <span className="grid place-items-center w-10 h-10 rounded-[14px] bg-sage text-white">
            <Icon name="compass" size={19} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.88rem] font-bold">{tr("ob_from_discovery")}</p>
            <p className="text-[0.8rem] text-ink-soft">{trRole(suggestedRole)}</p>
          </div>
        </Card>
      )}

      <div className="space-y-5">
        {/* STEP 1 — ROLE */}
        <Card>
          <CardHeader
            icon="target"
            tone="brand"
            title={`1 · ${tr("ob_section_role")}`}
            subtitle={tr("ob_role_sub")}
          />
          <div className="mt-5">
            <RoleGrid
              ROLES={ROLES}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </div>
        </Card>

        {/* STEP 2 — SKILLS */}
        {selectedRole && (
          <Card className="sm-rise">
            <CardHeader
              icon="layers"
              tone="lilac"
              title={`2 · ${tr("ob_section_skills")}`}
              subtitle={tr("ob_skills_sub")}
              action={
                <Badge tone={selectedSkills.length ? "brand" : "neutral"}>
                  {selectedSkills.length} {tr("ob_selected")}
                </Badge>
              }
            />

            <div className="mt-5">
              <SkillChips
                ALL_SKILLS={ALL_SKILLS}
                selectedSkills={selectedSkills}
                toggleSkill={toggleSkill}
                customSkill={customSkill}
                setCustomSkill={setCustomSkill}
                addCustom={addCustom}
                requiredSkills={roleData?.skills || []}
              />
            </div>

            <div className="mt-5 pt-5 border-t border-line-soft">
              <ResumeUpload resumeActive={resumeActive} handleResume={handleResume} />
            </div>
          </Card>
        )}

        {/* STEP 3 — PROFICIENCY */}
        {selectedRole && (
          <Card className="sm-rise">
            <CardHeader
              icon="chart"
              tone="amber"
              title={`3 · ${tr("ob_section_levels")}`}
              subtitle={tr("ob_levels_hint")}
            />

            <div className="mt-5">
              <ProficiencyList
                selectedSkills={selectedSkills}
                skillLevels={skillLevels}
                setSkillLevel={setSkillLevel}
                requiredLevels={requiredLevels}
              />
            </div>
          </Card>
        )}
      </div>

      {/* STICKY SUBMIT BAR */}
      <div className="fixed bottom-0 inset-x-0 z-20 lg:pl-64 xl:pl-70 pointer-events-none">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-7 pb-4">
          <div className="pointer-events-auto sm-card px-4 sm:px-5 py-3.5 flex flex-wrap items-center gap-4 justify-between backdrop-blur-xl bg-surface/95">
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:block">
                <div className="sm-eyebrow">{tr("ob_coverage")}</div>
                <p className="text-[0.95rem] font-bold">
                  {coverage}%{" "}
                  <span className="text-[0.78rem] font-semibold text-ink-faint">
                    {tr("ob_coverage_of", { role: selectedRole ? trRole(selectedRole) : "—" })}
                  </span>
                </p>
              </div>

              {!canSubmit && (
                <p className="text-[0.8rem] text-ink-soft max-w-xs">
                  {!selectedRole ? tr("ob_hint_role") : tr("ob_hint_skill")}
                </p>
              )}
            </div>

            <Button size="lg" disabled={!canSubmit} iconRight="arrowRight" onClick={submit}>
              {tr("ob_cta")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

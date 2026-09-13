import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import StatCard from "../components/common/StatCard";
import PageHeader, { EmptyState } from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/Progress";
import { LanguageSwitch } from "../components/layout/Topbar";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";

// Mock account data — used until the profile API is live
const MOCK_USER = {
  name: "Aarav Sharma",
  level: "Mid-Level",
  streak: 7,
  xp: 3240,
  completedCourses: 5,
  totalCourses: 8,
};

const SKILL_POOL = [
  { name: "TypeScript", icon: "code" },
  { name: "Docker", icon: "briefcase" },
  { name: "GraphQL", icon: "layers" },
  { name: "Testing", icon: "checkCircle" },
];

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-card bg-canvas-deep" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-card bg-canvas-deep" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="h-64 rounded-card bg-canvas-deep" />
        <div className="h-64 rounded-card bg-canvas-deep" />
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { tr, trRole, trSkill } = useLang();
  const { profile, skills, summary, readiness, roadmapProgress } = useProfile();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Non-OK response");
        setAccount(await res.json());
      } catch {
        // API not live yet — fall back to mock account data
        setAccount(MOCK_USER);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Skeleton />;

  if (!account) {
    return (
      <EmptyState
        icon="alert"
        title={tr("pf_error_title")}
        body={tr("pf_error_body")}
        action={<Button onClick={() => navigate("/dashboard")}>{tr("back")}</Button>}
      />
    );
  }

  const name = profile.name || account.name;
  const courseProgress = Math.round(
    (account.completedCourses / account.totalCourses) * 100
  );
  const suggestions = SKILL_POOL.filter(
    (s) => !(profile.skills || []).includes(s.name)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("pf_eyebrow")}
        title={tr("pf_title")}
        subtitle={tr("pf_sub")}
        actions={
          <Button variant="secondary" icon="layers" onClick={() => navigate("/onboarding")}>
            {tr("pf_update_skills")}
          </Button>
        }
      />

      {/* IDENTITY */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <span className="grid place-items-center w-16 h-16 rounded-[22px] bg-brand text-white text-[1.5rem] font-extrabold shrink-0">
            {name.trim().charAt(0).toUpperCase()}
          </span>

          <div className="flex-1 min-w-0">
            <h2 className="text-[1.4rem] font-bold leading-tight">{name}</h2>
            <p className="text-[0.88rem] text-ink-soft mt-0.5">
              {tr("dash_goal")}: {trRole(profile.role)}
            </p>
          </div>

          <div className="shrink-0">
            <div className="sm-eyebrow mb-2">{tr("nav_language")}</div>
            <LanguageSwitch />
          </div>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="flame"
          tone="peach"
          label={tr("pr_streak")}
          value={account.streak}
          suffix={tr("pr_days")}
        />
        <StatCard
          icon="zap"
          tone="amber"
          label={tr("pf_xp")}
          value={account.xp.toLocaleString()}
        />
        <StatCard
          icon="book"
          tone="sage"
          label={tr("pf_courses")}
          value={account.completedCourses}
          suffix={`/ ${account.totalCourses}`}
          progress={courseProgress}
        />
        <StatCard
          icon="layers"
          tone="lilac"
          label={tr("pf_skills")}
          value={(profile.skills || []).length}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* SKILLS */}
        <Card>
          <CardHeader
            icon="layers"
            tone="brand"
            title={tr("pf_your_skills")}
            subtitle={tr("pf_your_skills_sub")}
            action={<Badge tone="neutral">{(profile.skills || []).length}</Badge>}
          />

          <div className="mt-5 flex flex-wrap gap-2">
            {(profile.skills || []).map((s) => (
              <Badge key={s} tone="sage" dot size="md">
                {trSkill(s)}
              </Badge>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-line-soft space-y-3.5">
            <ProgressBar
              value={readiness}
              tone="brand"
              size="sm"
              label={tr("rc_readiness")}
              trailing={`${readiness}%`}
            />
            <ProgressBar
              value={roadmapProgress}
              tone="lilac"
              size="sm"
              label={tr("kpi_roadmap")}
              trailing={`${roadmapProgress}%`}
            />
            <ProgressBar
              value={(summary.matched.length / Math.max(1, skills.length)) * 100}
              tone="sage"
              size="sm"
              label={tr("kpi_matched")}
              trailing={`${summary.matched.length}/${skills.length}`}
            />
          </div>
        </Card>

        {/* SUGGESTIONS */}
        <Card>
          <CardHeader
            icon="sparkle"
            tone="peach"
            title={tr("pf_suggested")}
            subtitle={tr("pf_suggested_sub")}
          />

          <div className="mt-5 space-y-2.5">
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s.name}
                onClick={() => navigate("/onboarding")}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-[16px] bg-surface-muted border border-line-soft transition-all hover:border-brand/35 hover:bg-brand-soft/40"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="grid place-items-center w-8 h-8 rounded-lg bg-surface border border-line text-ink-soft">
                    <Icon name={s.icon} size={15} />
                  </span>
                  <span className="text-[0.87rem] font-bold truncate">{s.name}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[0.76rem] font-bold text-brand shrink-0">
                  {tr("pf_add")}
                  <Icon name="plus" size={13} />
                </span>
              </button>
            ))}

            {suggestions.length === 0 && (
              <p className="text-[0.85rem] text-ink-faint py-3">{tr("pf_all_added")}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

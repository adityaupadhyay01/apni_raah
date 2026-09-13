/* eslint-disable react-refresh/only-export-components --
   shared constants/helpers deliberately live beside their component */
import { NavLink, useNavigate } from "react-router-dom";

import Icon from "../common/Icon";
import { BrandLockup } from "../common/Logo";
import { useLang } from "../../context/LanguageContext";
import { useProfile } from "../../context/ProfileContext";

export const PRIMARY_NAV = [
  { to: "/dashboard", key: "nav_dashboard", icon: "dashboard" },
  { to: "/counselling", key: "nav_career", icon: "compass" },
  { to: "/onboarding", key: "nav_skills", icon: "layers" },
  { to: "/analysis", key: "nav_analysis", icon: "chart" },
  { to: "/roadmap", key: "nav_roadmap", icon: "route" },
  { to: "/learning", key: "nav_learning", icon: "book" },
  { to: "/progress", key: "nav_progress", icon: "trending" },
];

export const SECONDARY_NAV = [
  { to: "/resume", key: "nav_resume", icon: "file" },
  { to: "/consultation", key: "nav_mentors", icon: "users" },
  { to: "/simulation", key: "nav_simulation", icon: "briefcase" },
  { to: "/profile", key: "nav_profile", icon: "user" },
];

function NavItem({ item, onNavigate }) {
  const { tr } = useLang();

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-[0.87rem] font-semibold
         transition-all duration-150 ${
           isActive
             ? "bg-surface text-brand shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_8px_18px_-14px_rgba(41,39,34,.16)]"
             : "text-ink-soft hover:text-ink hover:bg-surface/70"
         }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-brand transition-all duration-200 ${
              isActive ? "h-6 opacity-100" : "h-0 opacity-0"
            }`}
          />
          <Icon name={item.icon} size={19} strokeWidth={isActive ? 2 : 1.7} />
          <span className="truncate">{tr(item.key)}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const { tr } = useLang();
  const { profile, readiness } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-canvas-deep/70 border-r border-line">
      {/* BRAND */}
      <div className="px-5 pt-6 pb-5">
        <BrandLockup
          size={42}
          tagline={tr("brand_tagline")}
          onClick={() => navigate("/dashboard")}
        />
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <p className="sm-eyebrow px-3.5 pb-2 pt-1">{tr("nav_group_main")}</p>
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}

        <div className="sm-hairline my-4 mx-3.5" />

        <p className="sm-eyebrow px-3.5 pb-2">{tr("nav_group_more")}</p>
        {SECONDARY_NAV.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* GOAL CARD */}
      <div className="p-3">
        <div className="sm-card p-4">
          <div className="mb-2.5">
            <span className="sm-eyebrow">{tr("side_goal")}</span>
          </div>

          <p className="text-[0.9rem] font-bold leading-tight mb-3 truncate">
            {profile.careerGoalLabel}
          </p>

          <div className="flex items-center justify-between text-[0.7rem] font-bold mb-1.5">
            <span className="text-ink-faint">{tr("side_readiness")}</span>
            <span className="text-brand">{readiness}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-canvas-deep overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-700"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react-refresh/only-export-components --
   the provider and its useProfile() hook intentionally live together */
import { createContext, useContext, useMemo, useState } from "react";

import { ROLES, DEFAULT_LEVEL } from "../utils/data";
import {
  classifySkills,
  summarizeSkills,
  weightedReadiness,
  buildPersonalizedRoadmap,
  DEFAULT_STUDY_MINUTES,
} from "../utils/roadmap";
import { useLang } from "./LanguageContext";

const STORAGE_KEY = "userData";

/* ------------------------------------------------------------------ */
/* Sample profile — keeps every screen complete before onboarding      */
/* ------------------------------------------------------------------ */
const SAMPLE = {
  role: "Web Developer",
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git",
    "Node.js",
    "REST APIs",
    "Testing",
  ],
  skillLevels: {
    HTML: "Advanced",
    CSS: "Advanced",
    JavaScript: "Intermediate",
    React: "Beginner",
    Git: "Advanced",
    "Node.js": "Intermediate",
    "REST APIs": "Beginner",
    Testing: "Beginner",
  },
  studyTime: 60,
  completedSteps: ["REST APIs"],
};

/* Mock learning + activity data (frontend-only, no backend involved) */
export const LAB_PROGRESS = {
  html: 100,
  css: 62,
  js: 24,
  project: 0,
};

export const WEEKLY_MINUTES = [45, 70, 30, 90, 60, 120, 75];

export const ACTIVITY_FEED = [
  { icon: "checkCircle", tone: "sage", key: "act_lab_done", meta: "HTML · Level 3", when: "act_today" },
  { icon: "chart", tone: "brand", key: "act_assessed", meta: "React · Beginner", when: "act_yesterday" },
  { icon: "route", tone: "lilac", key: "act_step_done", meta: "REST APIs", when: "act_2days" },
  { icon: "award", tone: "amber", key: "act_streak", meta: "7 days", when: "act_3days" },
];

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    return {
      skillLevels: {},
      studyTime: DEFAULT_STUDY_MINUTES,
      completedSteps: [],
      ...JSON.parse(saved),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persist = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — state still works for this session */
  }
};

const readUserName = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.name || null;
  } catch {
    return null;
  }
};

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [saved, setSaved] = useState(load);
  const { trRole } = useLang();

  // saved profile wins; the sample keeps the UI complete for new visitors
  const source = saved || SAMPLE;
  const hasProfile = Boolean(saved);

  /* ---- write paths (same shape the app has always stored) ---- */

  const completeAssessment = (role, skills, skillLevels = {}) => {
    const next = {
      role,
      skills,
      skillLevels,
      studyTime: source.studyTime || DEFAULT_STUDY_MINUTES,
      completedSteps: [],
    };
    setSaved(next);
    persist(next);
  };

  const updateProfile = (patch) => {
    setSaved((prev) => {
      const next = { ...(prev || SAMPLE), ...patch };
      persist(next);
      return next;
    });
  };

  const toggleStep = (skill) => {
    const current = source.completedSteps || [];
    const next = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    updateProfile({ completedSteps: next });
  };

  /* ---- derived analysis (single source of truth for every screen) ---- */

  const derived = useMemo(() => {
    const roleData = ROLES[source.role] || ROLES["Web Developer"];

    const skills = classifySkills(
      source.skills || [],
      source.skillLevels || {},
      roleData
    );

    const summary = summarizeSkills(skills);
    const readiness = weightedReadiness(skills);

    const { steps, totalWeeks } = buildPersonalizedRoadmap(
      skills,
      source.studyTime || DEFAULT_STUDY_MINUTES
    );

    const completed = source.completedSteps || [];
    const doneCount = steps.filter((s) => completed.includes(s.skill)).length;
    const roadmapProgress = steps.length
      ? Math.round((doneCount / steps.length) * 100)
      : 0;

    // highest-impact remaining gap — drives "next action" everywhere
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const topGap =
      [...summary.improve, ...summary.missing]
        .filter((s) => !completed.includes(s.name))
        .sort(
          (a, b) =>
            order[a.priority] - order[b.priority] ||
            (a.status === "improve" ? -1 : 1)
        )[0] || null;

    const criticalGaps = [...summary.improve, ...summary.missing].filter(
      (s) => s.priority === "HIGH"
    );

    const nextStep = steps.find((s) => !completed.includes(s.skill)) || null;

    return {
      roleData,
      skills,
      summary,
      readiness,
      steps,
      totalWeeks,
      doneCount,
      roadmapProgress,
      topGap,
      criticalGaps,
      nextStep,
    };
  }, [source]);

  const value = {
    profile: {
      ...source,
      name: readUserName() || "Aarav",
      hasProfile,
      careerGoalLabel: trRole(source.role),
      defaultLevel: DEFAULT_LEVEL,
    },
    hasProfile,
    completeAssessment,
    updateProfile,
    toggleStep,
    ...derived,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside <ProfileProvider>");
  }
  return ctx;
}

export default ProfileContext;

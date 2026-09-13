import {
  LEVELS,
  DEFAULT_LEVEL,
  REQUIRED_LEVEL_BY_PRIORITY,
} from "./data";

// src/utils/roadmap.js

export function compareSkills(userSkills, requiredSkills) {
  return {
    matched: requiredSkills.filter(s => userSkills.includes(s)),
    missing: requiredSkills.filter(s => !userSkills.includes(s))
  };
}

export function calculateReadiness(matched, total) {
  return total === 0 ? 0 : Math.round((matched / total) * 100);
}

export function detectBlockedSkills(missingSkills, deps) {
  const blocked = new Set();
  missingSkills.forEach(skill => {
    Object.entries(deps).forEach(([depSkill, reqs]) => {
      if (reqs.some(r => missingSkills.includes(r))) {
        blocked.add(depSkill);
      }
    });
  });
  return Array.from(blocked);
}

export function generateRoadmap(missingSkills, deps, priorities, resources) {
  const steps = [];
  const added = new Set();

  function addSkill(skill, depth = 0) {
    if (added.has(skill) || depth > 10) return;

    (deps[skill] || []).forEach(r => {
      if (missingSkills.includes(r)) addSkill(r, depth + 1);
    });

    if (!added.has(skill)) {
      added.add(skill);
      steps.push({
        skill,
        type: "learn",
        priority: priorities[skill] || "MEDIUM",
        resource: resources[skill] || "Search online tutorials",
        deps: (deps[skill] || []).filter(d => missingSkills.includes(d))
      });
    }
  }

  ["HIGH", "MEDIUM", "LOW"].forEach(p => {
    missingSkills
      .filter(s => (priorities[s] || "MEDIUM") === p)
      .forEach(s => addSkill(s));
  });

  steps.push({
    skill: "Build a Portfolio Project",
    type: "project",
    priority: "HIGH",
    resource: "GitHub, personal portfolio site",
    deps: []
  });

  steps.push({
    skill: "Apply & Network",
    type: "project",
    priority: "HIGH",
    resource: "LinkedIn, local meetups, job boards",
    deps: []
  });

  return steps;
}
/* ------------------------------------------------------------------ */
/* PROFICIENCY-AWARE GAP ANALYSIS                                      */
/* ------------------------------------------------------------------ */

// Where a level sits on the Beginner -> Advanced scale.
export function levelIndex(level) {
  const i = LEVELS.indexOf(level);
  return i === -1 ? 0 : i;
}

// The level a role expects for a skill, based on that skill's priority.
export function requiredLevel(priority) {
  return REQUIRED_LEVEL_BY_PRIORITY[priority] || "Intermediate";
}

/**
 * Compare the user's skills AND proficiency levels against a role.
 * Every required skill comes back as one of:
 *   matched  - known at or above the level the role expects
 *   improve  - known, but below the expected level
 *   missing  - not learned yet
 */
export function classifySkills(userSkills = [], skillLevels = {}, roleData) {
  if (!roleData) return [];

  const deps = roleData.deps || {};
  const priorities = roleData.priorities || {};
  const known = new Set(userSkills);

  const base = roleData.skills.map((name) => {
    const priority = priorities[name] || "MEDIUM";
    const need = requiredLevel(priority);
    const have = known.has(name) ? skillLevels[name] || DEFAULT_LEVEL : null;

    let status = "missing";
    if (have) {
      status = levelIndex(have) >= levelIndex(need) ? "matched" : "improve";
    }

    return { name, priority, need, have, status };
  });

  // A skill is "blocked" when one of its prerequisites is itself a gap.
  const weak = new Set(
    base.filter((s) => s.status !== "matched").map((s) => s.name)
  );

  return base.map((s) => {
    const blockers = (deps[s.name] || []).filter((d) => weak.has(d));

    return {
      ...s,
      deps: deps[s.name] || [],
      blockers,
      blocked: s.status !== "matched" && blockers.length > 0,
    };
  });
}

// Bucket the classified skills for the dashboard cards / tabs.
export function summarizeSkills(skills = []) {
  return {
    matched: skills.filter((s) => s.status === "matched"),
    improve: skills.filter((s) => s.status === "improve"),
    missing: skills.filter((s) => s.status === "missing"),
    blocked: skills.filter((s) => s.blocked),
  };
}

// Readiness that gives partial credit for half-learned skills.
export function weightedReadiness(skills = []) {
  if (skills.length === 0) return 0;

  const score = skills.reduce((sum, s) => {
    if (s.status === "matched") return sum + 1;
    if (s.status === "improve") return sum + 0.5;
    return sum;
  }, 0);

  return Math.round((score / skills.length) * 100);
}

/* ------------------------------------------------------------------ */
/* PERSONALISED ROADMAP                                                */
/* ------------------------------------------------------------------ */

// Mock effort estimates (hours) for learning a skill from scratch.
const BASE_HOURS = { HIGH: 40, MEDIUM: 25, LOW: 15 };

export const STUDY_TIME_OPTIONS = [
  { minutes: 30, key: "time_30" },
  { minutes: 60, key: "time_60" },
  { minutes: 120, key: "time_120" },
  { minutes: 180, key: "time_180" },
];

export const DEFAULT_STUDY_MINUTES = 60;

// Topping up an existing skill costs less than starting from zero.
export function estimateHours(item) {
  const base = BASE_HOURS[item.priority] ?? 25;

  if (item.status === "improve") {
    const gap = Math.max(1, levelIndex(item.need) - levelIndex(item.have));
    return Math.max(6, Math.round(base * 0.4 * gap));
  }

  return base;
}

// Hours -> weeks at the study time the user actually has.
export function hoursToWeeks(hours, minutesPerDay = DEFAULT_STUDY_MINUTES) {
  const hoursPerWeek = (minutesPerDay / 60) * 7;
  return Math.max(1, Math.ceil(hours / hoursPerWeek));
}

/**
 * Build the study plan: prerequisites first, then HIGH -> MEDIUM -> LOW,
 * with an effort estimate per step based on available study time.
 * Returns { steps, totalWeeks }.
 */
export function buildPersonalizedRoadmap(
  skills = [],
  minutesPerDay = DEFAULT_STUDY_MINUTES
) {
  const gaps = skills.filter((s) => s.status !== "matched");
  const byName = Object.fromEntries(gaps.map((s) => [s.name, s]));

  const added = new Set();
  const ordered = [];

  const addSkill = (item, depth = 0) => {
    if (!item || added.has(item.name) || depth > 10) return;

    // learn prerequisites that are still gaps first
    item.blockers.forEach((d) => addSkill(byName[d], depth + 1));

    if (added.has(item.name)) return;
    added.add(item.name);
    ordered.push(item);
  };

  ["HIGH", "MEDIUM", "LOW"].forEach((p) => {
    gaps.filter((s) => s.priority === p).forEach((s) => addSkill(s));
  });

  let cursor = 0;

  const steps = ordered.map((item) => {
    const hours = estimateHours(item);
    const weeks = hoursToWeeks(hours, minutesPerDay);
    const startWeek = cursor + 1;
    cursor += weeks;

    return {
      skill: item.name,
      type: item.status === "improve" ? "improve" : "learn",
      status: item.status,
      priority: item.priority,
      have: item.have,
      need: item.need,
      blocked: item.blocked,
      deps: item.blockers,
      hours,
      weeks,
      startWeek,
      endWeek: cursor,
    };
  });

  // Closing milestones (kept from the original roadmap)
  steps.push({
    skill: "PORTFOLIO_PROJECT",
    type: "project",
    priority: "HIGH",
    deps: [],
    weeks: 2,
    startWeek: cursor + 1,
    endWeek: cursor + 2,
  });

  steps.push({
    skill: "APPLY_AND_NETWORK",
    type: "project",
    priority: "HIGH",
    deps: [],
    weeks: 2,
    startWeek: cursor + 3,
    endWeek: cursor + 4,
  });

  return { steps, totalWeeks: cursor + 4 };
}

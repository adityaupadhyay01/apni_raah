// src/services/authService.js
//
// MOCK AUTH — no backend, no database.
// Accounts live in localStorage so sign up / sign in work offline during demos.
// Swap the bodies of loginUser / registerUser for real API calls when the
// backend auth is brought back.

const USERS_KEY = "skillmap_mock_users";
const SESSION_KEY = "user";

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage blocked — session still works in memory for this page */
  }
};

/** Small delay so the UI's loading state is visible, like a real request. */
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

/** Store the signed-in user; the app reads this key for the display name. */
export const setSession = (user) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
};

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
};

/**
 * Mock sign in.
 * Matches a previously mocked sign-up when one exists; otherwise accepts any
 * credentials and derives a friendly name from the email, so a demo never
 * dead-ends on a missing account.
 */
export async function loginUser({ email, password }) {
  await delay();

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  const users = readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (found && found.password !== password) {
    return { ok: false, message: "Incorrect password." };
  }

  const user = found || {
    name: email.split("@")[0].replace(/[._-]+/g, " ").trim() || "Learner",
    email: email.trim(),
    targetRole: "",
  };

  const safeUser = { ...user };
  delete safeUser.password;
  setSession(safeUser);

  return { ok: true, user: safeUser };
}

/** Mock sign up — saves the account locally and signs the user straight in. */
export async function registerUser(form) {
  await delay();

  const required = ["name", "email", "password", "domain", "targetRole"];
  const missing = required.filter((f) => !form[f]);

  if (missing.length) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  const users = readUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === form.email.trim().toLowerCase()
  );

  if (exists) {
    return { ok: false, message: "An account with this email already exists." };
  }

  const user = {
    ...form,
    email: form.email.trim(),
    knownSkills: String(form.knownSkills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    learningGoals: String(form.learningGoals || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  writeUsers([...users, user]);

  const safeUser = { ...user };
  delete safeUser.password;
  setSession(safeUser);

  return { ok: true, user: safeUser };
}

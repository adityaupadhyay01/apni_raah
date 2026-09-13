import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/common/Button";
import Field, { FormNotice } from "../components/common/Field";
import { useLang } from "../context/LanguageContext";
import { registerUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    domain: "",
    targetRole: "",
    experienceLevel: "",
    knownSkills: "",
    learningGoals: "",
  });
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);

    try {
      // mock auth — no backend call
      const res = await registerUser(form);

      if (res.ok) {
        setNotice({ type: "success", text: tr("auth_signup_ok") });
        // carry the chosen role into the existing skill assessment
        navigate("/onboarding", { state: { role: form.targetRole } });
      } else {
        setNotice({ type: "error", text: res.message || tr("auth_failed") });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      wide
      eyebrow={tr("auth_step_1")}
      title={tr("auth_signup_title")}
      subtitle={tr("auth_signup_sub")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {notice && <FormNotice type={notice.type}>{notice.text}</FormNotice>}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label={tr("auth_name")}
            name="name"
            type="text"
            icon="user"
            placeholder={tr("auth_name_ph")}
            value={form.name}
            onChange={handleChange}
            required
          />

          <Field
            label={tr("auth_email")}
            name="email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Field
            className="sm:col-span-2"
            label={tr("auth_password")}
            name="password"
            type="password"
            icon="lock"
            placeholder={tr("auth_password_ph")}
            value={form.password}
            onChange={handleChange}
            required
          />

          <Field
            as="select"
            label={tr("auth_domain")}
            name="domain"
            value={form.domain}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              {tr("auth_select_domain")}
            </option>
            <option value="tech">Tech</option>
            <option value="non-tech">Non-Tech</option>
            <option value="arts">Arts</option>
          </Field>

          <Field
            as="select"
            label={tr("auth_experience")}
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              {tr("auth_select_level")}
            </option>
            <option value="student">Student</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
          </Field>

          <Field
            as="select"
            className="sm:col-span-2"
            label={tr("auth_target_role")}
            name="targetRole"
            value={form.targetRole}
            onChange={handleChange}
            required
          >
            <option value="">{tr("auth_select_role")}</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="ML Engineer">ML Engineer</option>
          </Field>
        </div>

        <Button type="submit" size="lg" full iconRight="arrowRight" disabled={busy}>
          {busy ? tr("auth_working") : tr("auth_create")}
        </Button>

        <p className="text-center text-[0.85rem] text-ink-soft pt-1">
          {tr("auth_have_account")}{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-bold text-brand hover:text-brand-deep transition-colors"
          >
            {tr("auth_signin")}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

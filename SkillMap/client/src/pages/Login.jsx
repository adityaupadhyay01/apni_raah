import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/common/Button";
import Field, { FormNotice } from "../components/common/Field";
import { useLang } from "../context/LanguageContext";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const [form, setForm] = useState({ email: "", password: "" });
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);

    try {
      // mock auth — no backend call
      const res = await loginUser(form);

      if (res.ok) {
        setNotice({ type: "success", text: tr("auth_login_ok") });
        // existing user signing back in lands on their dashboard
        navigate("/dashboard");
      } else {
        setNotice({ type: "error", text: res.message || tr("auth_failed") });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={tr("auth_welcome_back")}
      title={tr("auth_login_title")}
      subtitle={tr("auth_login_sub")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {notice && <FormNotice type={notice.type}>{notice.text}</FormNotice>}

        <Field
          label={tr("auth_email")}
          name="email"
          type="email"
          icon="user"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Field
          label={tr("auth_password")}
          name="password"
          type="password"
          icon="lock"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-[0.78rem] font-semibold text-brand hover:text-brand-deep transition-colors"
          >
            {tr("auth_forgot")}
          </button>
        </div>

        <Button type="submit" size="lg" full iconRight="arrowRight" disabled={busy}>
          {busy ? tr("auth_working") : tr("auth_signin")}
        </Button>

        <p className="text-center text-[0.85rem] text-ink-soft pt-1">
          {tr("auth_no_account")}{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-bold text-brand hover:text-brand-deep transition-colors"
          >
            {tr("auth_signup")}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

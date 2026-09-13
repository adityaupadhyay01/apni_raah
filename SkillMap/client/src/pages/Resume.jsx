import { useState } from "react";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import Field from "../components/common/Field";
import PageHeader from "../components/common/PageHeader";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";

export default function Resume() {
  const { tr, trRole } = useLang();
  const { profile, summary } = useProfile();

  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [result, setResult] = useState(null);

  // prefill from the assessment so the builder is never a blank page
  const prefill = () => {
    setRole(trRole(profile.role));
    setSkills((profile.skills || []).join(", "));
    setProjects("Portfolio Website\nSkill Tracker App");
  };

  const handleGenerate = () => {
    const targetRole = role || trRole(profile.role);
    const userSkills = (skills || (profile.skills || []).join(", "))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const matched = userSkills.slice(0, 4);
    const missing = summary.missing.map((s) => s.name);

    setResult({
      name: profile.name || "Your Name",
      email: "your.email@gmail.com",
      phone: "+91 XXXXX XXXXX",
      location: "India",

      summary: `Motivated and detail-oriented aspiring ${targetRole} with a strong foundation in ${matched.join(
        ", "
      )}. Adept at building responsive and scalable applications with a focus on performance and user experience. Demonstrates strong problem-solving abilities and a commitment to continuous learning.`,

      skills: {
        core: userSkills.slice(0, 3),
        additional: userSkills.slice(3),
      },

      projects: projects
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => ({
          title: p,
          points: [
            `Developed ${p} using ${userSkills.join(", ")}, focusing on modular architecture and clean code practices.`,
            "Implemented key features improving usability and responsiveness across devices.",
            "Demonstrated strong understanding of real-world development workflows and debugging techniques.",
          ],
        })),

      education: {
        degree: "B.Tech in Computer Science",
        institute: "Your College Name",
        year: "2024 - Present",
      },

      achievements: [
        "Built multiple real-world projects demonstrating end-to-end development skills",
        "Strong grasp of fundamentals and problem-solving",
      ],

      keywords: missing,
    });
  };

  const downloadPDF = () => window.print();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("rs_eyebrow")}
        title={tr("rs_title")}
        subtitle={tr("rs_sub")}
        actions={
          <Button variant="secondary" icon="sparkle" onClick={prefill}>
            {tr("rs_prefill")}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[380px_1fr] gap-5 items-start">
        {/* INPUTS */}
        <Card className="print:hidden lg:sticky lg:top-24">
          <CardHeader
            icon="file"
            tone="brand"
            title={tr("rs_details")}
            subtitle={tr("rs_details_sub")}
          />

          <div className="mt-5 space-y-4">
            <Field
              label={tr("rs_target_role")}
              placeholder={trRole(profile.role)}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <Field
              as="textarea"
              label={tr("rs_skills")}
              hint={tr("rs_skills_hint")}
              placeholder="HTML, CSS, JavaScript, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <Field
              as="textarea"
              label={tr("rs_projects")}
              hint={tr("rs_projects_hint")}
              placeholder="Portfolio Website"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
            />

            <Button full size="lg" icon="sparkle" onClick={handleGenerate}>
              {tr("rs_generate")}
            </Button>
          </div>
        </Card>

        {/* OUTPUT */}
        {result ? (
          <div className="space-y-5">
            <Card className="print:shadow-none">
              <div className="text-center pb-5 mb-5 border-b border-line">
                <h2 className="text-[1.6rem] font-extrabold tracking-tight">{result.name}</h2>
                <p className="text-[0.84rem] text-ink-soft mt-1">
                  {result.email} · {result.phone} · {result.location}
                </p>
              </div>

              <section className="mb-6">
                <h3 className="sm-eyebrow mb-2">{tr("rs_summary")}</h3>
                <p className="text-[0.88rem] text-ink-soft leading-relaxed">{result.summary}</p>
              </section>

              <section className="mb-6">
                <h3 className="sm-eyebrow mb-2.5">{tr("rs_tech_skills")}</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {result.skills.core.map((s) => (
                    <Badge key={s} tone="brand" size="md">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.skills.additional.map((s) => (
                    <Badge key={s} tone="neutral" size="md">
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>

              {result.projects.length > 0 && (
                <section className="mb-6">
                  <h3 className="sm-eyebrow mb-2.5">{tr("rs_projects")}</h3>
                  {result.projects.map((proj, i) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <p className="text-[0.92rem] font-bold mb-1">{proj.title}</p>
                      <ul className="space-y-1">
                        {proj.points.map((point, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-[0.84rem] text-ink-soft"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-ink-faint shrink-0 mt-2" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              <section className="mb-6">
                <h3 className="sm-eyebrow mb-2">{tr("rs_education")}</h3>
                <p className="text-[0.9rem] font-bold">{result.education.degree}</p>
                <p className="text-[0.84rem] text-ink-soft">
                  {result.education.institute} ({result.education.year})
                </p>
              </section>

              <section>
                <h3 className="sm-eyebrow mb-2">{tr("rs_achievements")}</h3>
                <ul className="space-y-1">
                  {result.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.84rem] text-ink-soft">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint shrink-0 mt-2" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            </Card>

            {result.keywords.length > 0 && (
              <Card className="print:hidden border-amber/25 bg-amber-soft/40">
                <div className="flex items-start gap-3.5">
                  <span className="grid place-items-center w-10 h-10 rounded-[14px] bg-amber text-white shrink-0">
                    <Icon name="alert" size={19} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[0.92rem] mb-1">{tr("rs_improve")}</p>
                    <p className="text-[0.84rem] text-ink-soft">
                      {tr("rs_improve_body")}: {result.keywords.join(", ")}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="print:hidden flex justify-end">
              <Button size="lg" icon="file" onClick={downloadPDF}>
                {tr("rs_download")}
              </Button>
            </div>
          </div>
        ) : (
          <Card className="print:hidden flex flex-col items-center justify-center text-center py-16">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-soft text-brand mb-4">
              <Icon name="file" size={26} />
            </span>
            <h3 className="text-[1.05rem] font-bold mb-1.5">{tr("rs_empty_title")}</h3>
            <p className="text-[0.86rem] text-ink-soft max-w-sm">{tr("rs_empty_body")}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";

const PROJECTS = [
  {
    id: "landing",
    title: "Landing Page Builder",
    icon: "🚀",
    description: "Build a product landing page from scratch",
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; font-family: sans-serif; background: #fff; color: #111; }
  </style>
</head>
<body>
  <h1>My Product</h1>
  <p>Welcome to my landing page</p>
</body>
</html>`,
  },
  {
    id: "portfolio",
    title: "Portfolio Builder",
    icon: "💼",
    description: "Create your personal developer portfolio",
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; font-family: sans-serif; background: #fff; color: #111; }
  </style>
</head>
<body>
  <h1>My Name</h1>
  <p>Web Developer</p>
  <p>Projects | Skills | Contact</p>
</body>
</html>`,
  },
];

export default function ProjectLab() {
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState("");

  const handleSelect = (project) => {
    setSelected(project);
    setCode(project.defaultCode);
  };

  const handleBack = () => {
    setSelected(null);
    setCode("");
  };

  if (!selected) {
    return (
      <div style={s.root}>
        <div style={s.header}>
          <span style={s.tag}>// PROJECT LAB</span>
          <h2 style={s.title}>Choose a Project</h2>
          <p style={s.sub}>Select a project to start building with live preview</p>
        </div>

        <div style={s.grid}>
          {PROJECTS.map((p) => (
            <button key={p.id} style={s.card} onClick={() => handleSelect(p)}>
              <span style={s.cardIcon}>{p.icon}</span>
              <span style={s.cardTitle}>{p.title}</span>
              <span style={s.cardDesc}>{p.description}</span>
              <span style={s.cardCta}>Start Building →</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.editorHeader}>
        <button style={s.backBtn} onClick={handleBack}>← Back</button>
        <span style={s.editorTitle}>
          {selected.icon} {selected.title}
        </span>
        <span style={s.liveIndicator}>● LIVE</span>
      </div>

      <div style={s.workspace}>
        {/* Editor */}
        <div style={s.editorPane}>
          <div style={s.paneLabel}>// index.html</div>
          <textarea
            style={s.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div style={s.previewPane}>
          <div style={s.paneLabel}>// preview</div>
          <iframe
            style={s.iframe}
            srcDoc={code}
            title="live-preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    background: "#070707",
    minHeight: "100%",
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    padding: "24px",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: 32,
  },
  tag: {
    fontSize: 11,
    color: "#7fbf96",
    letterSpacing: 2,
    display: "block",
    marginBottom: 8,
  },
  title: {
    margin: "0 0 8px",
    fontSize: 22,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
  },
  sub: {
    margin: 0,
    fontSize: 13,
    color: "#4a5568",
    fontFamily: "system-ui, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    maxWidth: 640,
  },
  card: {
    background: "#0d0d0d",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.2s",
    outline: "none",
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
  },
  cardDesc: {
    fontSize: 12,
    color: "#4a5568",
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.5,
  },
  cardCta: {
    fontSize: 12,
    color: "#7fbf96",
    marginTop: 8,
    fontWeight: 600,
  },
  editorHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: "1px solid #1a1a1a",
  },
  backBtn: {
    background: "none",
    border: "1px solid #333",
    color: "#94a3b8",
    fontSize: 12,
    padding: "6px 14px",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  editorTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
  },
  liveIndicator: {
    fontSize: 11,
    color: "#7fbf96",
    letterSpacing: 1.5,
    fontWeight: 700,
  },
  workspace: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    height: "calc(100vh - 160px)",
    minHeight: 480,
  },
  editorPane: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #333",
    borderRadius: 6,
    overflow: "hidden",
  },
  previewPane: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #333",
    borderRadius: 6,
    overflow: "hidden",
  },
  paneLabel: {
    fontSize: 10,
    color: "#7fbf96",
    letterSpacing: 1.5,
    padding: "8px 14px",
    background: "#0a0a0a",
    borderBottom: "1px solid #1a1a1a",
    fontWeight: 700,
  },
  textarea: {
    flex: 1,
    background: "#000000",
    color: "#7fbf96",
    border: "none",
    outline: "none",
    padding: "16px",
    fontSize: 12,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    lineHeight: 1.8,
    resize: "none",
    tabSize: 2,
  },
  iframe: {
    flex: 1,
    border: "none",
    width: "100%",
    background: "#ffffff",
  },
};
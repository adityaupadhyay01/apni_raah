import { useState, useEffect, useRef } from "react";

const LEVELS = [
  {
    id: 1,
    title: "Level 1 — Color Basics",
    badge: "BASIC",
    badgeColor: "#7fbf96",
    task: "Style the box below with a blue background and white text.",
    requirements: [
      { label: "background: blue", check: (code) => /background(-color)?\s*:\s*(blue|#0000ff|rgb\(0,\s*0,\s*255\))/i.test(code) },
      { label: "color: white", check: (code) => /color\s*:\s*(white|#fff(fff)?|rgb\(255,\s*255,\s*255\))/i.test(code) },
    ],
    starterCode: "/* Style the .box element */\n.box {\n  \n}",
    previewHTML: `<div class="box" style="padding:24px;font-size:18px;font-weight:600;border-radius:8px;transition:all 0.3s;">Hello, CSS World!</div>`,
    hint: "Try: background: blue; and color: white;",
  },
  {
    id: 2,
    title: "Level 2 — Flexbox Centering",
    badge: "INTERMEDIATE",
    badgeColor: "#d8b25a",
    task: "Center the inner box inside the container using Flexbox properties.",
    requirements: [
      { label: "display: flex", check: (code) => /display\s*:\s*flex/i.test(code) },
      { label: "justify-content: center", check: (code) => /justify-content\s*:\s*center/i.test(code) },
      { label: "align-items: center", check: (code) => /align-items\s*:\s*center/i.test(code) },
    ],
    starterCode: "/* Center .inner inside .container */\n.container {\n  height: 200px;\n  background: #1e1e2e;\n  \n}\n\n.inner {\n  background: #8b7ac0;\n  color: white;\n  padding: 16px 28px;\n  border-radius: 8px;\n}",
    previewHTML: `<div class="container" style="height:200px;background:#1e1e2e;border-radius:10px;"><div class="inner" style="background:#8b7ac0;color:white;padding:16px 28px;border-radius:8px;font-weight:600;">Center me!</div></div>`,
    hint: "Add display: flex; justify-content: center; align-items: center; to .container",
  },
  {
    id: 3,
    title: "Level 3 — Card Styling",
    badge: "ADVANCED",
    badgeColor: "#d08d95",
    task: "Style the card with border-radius, box-shadow, and padding to make it look polished.",
    requirements: [
      { label: "border-radius", check: (code) => /border-radius\s*:/i.test(code) },
      { label: "box-shadow", check: (code) => /box-shadow\s*:/i.test(code) },
      { label: "padding", check: (code) => /padding\s*:/i.test(code) },
    ],
    starterCode: "/* Style the .card */\n.card {\n  background: #1e1e2e;\n  color: #e2e8f0;\n  max-width: 300px;\n  \n}",
    previewHTML: `<div class="card" style="background:#1e1e2e;color:#e2e8f0;max-width:300px;"><h3 style="margin:0 0 8px;font-size:18px;">✦ My Card</h3><p style="margin:0;opacity:0.7;font-size:14px;">A beautifully styled card component using CSS properties.</p></div>`,
    hint: "Try: padding: 24px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);",
  },
];

const CERT_STARTER = `<div style="border: 4px solid gold; padding: 48px; text-align: center; font-family: Georgia, serif; background: #fffdf0; border-radius: 16px; max-width: 500px; margin: auto;">
  <h1 style="color: #b8860b; font-size: 28px; margin-bottom: 8px;">Certificate of Completion</h1>
  <p style="font-size: 16px; color: #555;">This certifies that</p>
  <h2 style="color: #1a1a1a; font-size: 24px; margin: 8px 0;">Your Name Here</h2>
  <p style="color: #555;">has successfully completed the</p>
  <h3 style="color: #8b7ac0; font-size: 20px;">CSS Lab Challenge 🎉</h3>
  <p style="font-size: 13px; color: #999; margin-top: 24px;">Issued on ${new Date().toLocaleDateString()}</p>
</div>`;

export default function CSSLab() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [code, setCode] = useState(LEVELS[0].starterCode);
  const [results, setResults] = useState([]);
  const [ran, setRan] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [certCode, setCertCode] = useState(CERT_STARTER);
  const [showHint, setShowHint] = useState(false);
  const previewRef = useRef(null);
  const certRef = useRef(null);

  const level = LEVELS[levelIndex];

  useEffect(() => {
    setCode(level.starterCode);
    setResults([]);
    setRan(false);
    setPassed(false);
    setShowHint(false);
  }, [levelIndex]);

  const runCode = () => {
    const checks = level.requirements.map((req) => ({
      label: req.label,
      ok: req.check(code),
    }));
    setResults(checks);
    const allPassed = checks.every((c) => c.ok);
    setPassed(allPassed);
    setRan(true);
    applyPreview(code);
  };

  const applyPreview = (cssCode) => {
    if (!previewRef.current) return;
    const doc = previewRef.current.contentDocument || previewRef.current.contentWindow.document;
    const safeCSS = cssCode.replace(/<\/style>/gi, "");
    doc.open();
    doc.write(`
      <html>
        <head>
          <style>
            body { margin: 0; padding: 24px; background: #0f0f1a; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
            ${safeCSS}
          </style>
        </head>
        <body>${level.previewHTML}</body>
      </html>
    `);
    doc.close();
  };

  const applyCertPreview = (html) => {
    if (!certRef.current) return;
    const doc = certRef.current.contentDocument || certRef.current.contentWindow.document;
    doc.open();
    doc.write(`<html><head><style>body{margin:0;padding:32px;background:#f5f5f5;display:flex;justify-content:center;align-items:center;min-height:100vh;box-sizing:border-box;font-family:serif;}</style></head><body>${html}</body></html>`);
    doc.close();
  };

  useEffect(() => {
    if (showCert) applyCertPreview(certCode);
  }, [certCode, showCert]);

  // Initialize preview on mount
  useEffect(() => {
    const timer = setTimeout(() => applyPreview(code), 100);
    return () => clearTimeout(timer);
  }, []);

  if (showCert) {
    return (
      <div style={styles.root}>
        <div style={styles.certHeader}>
          <div style={styles.logoRow}>
            <span style={styles.logo}>⬡ CSS Lab</span>
            <span style={{ ...styles.badge, background: "#8b7ac0" }}>CERTIFICATE</span>
          </div>
          <h1 style={styles.certTitle}>Build Your Own Certificate</h1>
          <p style={styles.certSub}>You've mastered all 3 levels. Now craft your achievement certificate using HTML.</p>
        </div>

        <div style={styles.certLayout}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelLabel}>HTML Editor</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Edit the HTML below</span>
            </div>
            <textarea
              style={styles.editor}
              value={certCode}
              onChange={(e) => setCertCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelLabel}>Live Preview</span>
              <span style={{ fontSize: 12, color: "#7fbf96" }}>● Live</span>
            </div>
            <iframe ref={certRef} style={styles.iframe} title="cert-preview" />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button style={styles.btnSecondary} onClick={() => { setShowCert(false); setLevelIndex(0); }}>
            ↩ Restart Lab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <span style={styles.logo}>⬡ CSS Lab</span>
          <div style={styles.levelPips}>
            {LEVELS.map((l, i) => (
              <div
                key={l.id}
                style={{
                  ...styles.pip,
                  background: i < levelIndex ? "#7fbf96" : i === levelIndex ? level.badgeColor : "#2d2d44",
                  boxShadow: i === levelIndex ? `0 0 8px ${level.badgeColor}88` : "none",
                }}
              />
            ))}
          </div>
        </div>
        <div style={styles.levelMeta}>
          <span style={{ ...styles.badge, background: level.badgeColor + "22", color: level.badgeColor, border: `1px solid ${level.badgeColor}44` }}>
            {level.badge}
          </span>
          <h2 style={styles.levelTitle}>{level.title}</h2>
          <p style={styles.taskText}>{level.task}</p>
          <button style={styles.hintBtn} onClick={() => setShowHint(!showHint)}>
            {showHint ? "▾ Hide Hint" : "▸ Show Hint"}
          </button>
          {showHint && <div style={styles.hint}>{level.hint}</div>}
        </div>
      </div>

      {/* Main layout */}
      <div style={styles.layout}>
        {/* Editor panel */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelLabel}>CSS Editor</span>
            <div style={styles.dots}>
              <span style={{ ...styles.dot, background: "#d08d95" }} />
              <span style={{ ...styles.dot, background: "#d8b25a" }} />
              <span style={{ ...styles.dot, background: "#7fbf96" }} />
            </div>
          </div>
          <textarea
            style={styles.editor}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Write your CSS here..."
          />
          <div style={styles.editorFooter}>
            <button style={styles.runBtn} onClick={runCode}>
              ▶ Run Code
            </button>
            <button style={styles.resetBtn} onClick={() => { setCode(level.starterCode); setResults([]); setRan(false); setPassed(false); applyPreview(level.starterCode); }}>
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelLabel}>Live Preview</span>
            <span style={{ fontSize: 12, color: "#7fbf96" }}>● Live</span>
          </div>
          <iframe ref={previewRef} style={styles.iframe} title="preview" />

          {/* Results */}
          {ran && (
            <div style={styles.results}>
              <div style={styles.resultsTitle}>Test Results</div>
              {results.map((r) => (
                <div key={r.label} style={styles.resultRow}>
                  <span style={{ color: r.ok ? "#7fbf96" : "#d08d95", fontSize: 16 }}>{r.ok ? "✔" : "✘"}</span>
                  <span style={{ color: r.ok ? "#cbd5e1" : "#94a3b8", fontFamily: "monospace", fontSize: 13 }}>{r.label}</span>
                </div>
              ))}
              {passed && (
                <div style={styles.successBox}>
                  <span style={{ fontSize: 20 }}>🎉</span>
                  <span>All test cases passed!</span>
                </div>
              )}
              {!passed && (
                <div style={styles.failBox}>
                  <span style={{ fontSize: 16 }}>⚠</span>
                  <span>Some checks failed. Keep going!</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {passed && (
            <div style={styles.navRow}>
              {levelIndex < LEVELS.length - 1 ? (
                <button style={styles.nextBtn} onClick={() => setLevelIndex(levelIndex + 1)}>
                  Next Level →
                </button>
              ) : (
                <button style={{ ...styles.nextBtn, background: "linear-gradient(135deg, #8b7ac0, #a855f7)" }} onClick={() => setShowCert(true)}>
                  🏆 Get Certificate
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: 520,
    background: "#0a0a15",
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    padding: "24px",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: 24,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#a78bfa",
    letterSpacing: "-0.5px",
  },
  levelPips: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  pip: {
    width: 32,
    height: 6,
    borderRadius: 3,
    transition: "all 0.3s",
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 4,
    letterSpacing: 1.5,
    display: "inline-block",
    marginBottom: 8,
  },
  levelMeta: {
    background: "#12122a",
    border: "1px solid #1e1e3a",
    borderRadius: 12,
    padding: "20px 24px",
  },
  levelTitle: {
    margin: "6px 0 8px",
    fontSize: 20,
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "system-ui, sans-serif",
  },
  taskText: {
    margin: "0 0 12px",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: "system-ui, sans-serif",
  },
  hintBtn: {
    background: "none",
    border: "1px solid #2d2d44",
    color: "#64748b",
    fontSize: 12,
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: 4,
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  hint: {
    marginTop: 10,
    padding: "10px 14px",
    background: "#1a1a2e",
    border: "1px solid #2d2d44",
    borderRadius: 6,
    fontSize: 12,
    color: "#d8b25a",
    fontFamily: "monospace",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  panel: {
    background: "#0f0f1f",
    border: "1px solid #1e1e3a",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #1e1e3a",
    background: "#0a0a18",
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dots: {
    display: "flex",
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    opacity: 0.7,
  },
  editor: {
    flex: 1,
    background: "#0c0c1e",
    color: "#a5f3fc",
    border: "none",
    outline: "none",
    padding: "20px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    lineHeight: 1.8,
    resize: "none",
    minHeight: 220,
    tabSize: 2,
  },
  editorFooter: {
    display: "flex",
    gap: 10,
    padding: "12px 16px",
    borderTop: "1px solid #1e1e3a",
    background: "#0a0a18",
  },
  runBtn: {
    background: "linear-gradient(135deg, #16a34a, #7fbf96)",
    color: "#0a1a0a",
    border: "none",
    padding: "9px 22px",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: 0.5,
  },
  resetBtn: {
    background: "none",
    color: "#64748b",
    border: "1px solid #2d2d44",
    padding: "9px 16px",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  iframe: {
    flex: 1,
    border: "none",
    width: "100%",
    minHeight: 220,
    background: "#0f0f1a",
  },
  results: {
    borderTop: "1px solid #1e1e3a",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  resultsTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#475569",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  resultRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  successBox: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#052e16",
    border: "1px solid #16a34a44",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#7fbf96",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "system-ui, sans-serif",
  },
  failBox: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#1c0a0a",
    border: "1px solid #d08d9544",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#d08d95",
    fontSize: 13,
    fontFamily: "system-ui, sans-serif",
  },
  navRow: {
    padding: "12px 16px",
    borderTop: "1px solid #1e1e3a",
    background: "#0a0a18",
  },
  nextBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #4f46e5, #8b7ac0)",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: 0.5,
  },
  certHeader: {
    marginBottom: 24,
  },
  certTitle: {
    margin: "8px 0 6px",
    fontSize: 26,
    fontWeight: 800,
    color: "#f1f5f9",
    fontFamily: "system-ui, sans-serif",
  },
  certSub: {
    color: "#64748b",
    fontSize: 14,
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },
  certLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    minHeight: 500,
  },
  btnSecondary: {
    background: "none",
    color: "#64748b",
    border: "1px solid #2d2d44",
    padding: "10px 24px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
  },
};

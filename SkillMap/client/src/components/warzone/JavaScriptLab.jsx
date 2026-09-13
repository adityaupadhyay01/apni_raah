import { useState, useRef, useEffect } from "react";

const LEVELS = [
  {
    id: 1,
    badge: "BASIC",
    badgeColor: "#7fbf96",
    title: "Level 1 — Variables",
    task: 'Declare a variable named "name" and assign your name to it.',
    example: 'let name = "Alice";',
    starter: '// Declare a variable called "name"\n',
    requirements: [
      { label: 'Variable named "name" declared', check: (code) => /\b(let|const|var)\s+name\b/.test(code) },
    ],
  },
  {
    id: 2,
    badge: "INTERMEDIATE",
    badgeColor: "#d8b25a",
    title: "Level 2 — Functions",
    task: "Create a function that takes two numbers and returns their sum.",
    example: "function add(a, b) { return a + b; }",
    starter: "// Write a function that returns the sum of 2 numbers\n",
    requirements: [
      { label: '"function" keyword used', check: (code) => /\bfunction\b/.test(code) },
      { label: '"return" keyword used', check: (code) => /\breturn\b/.test(code) },
    ],
  },
  {
    id: 3,
    badge: "ADVANCED",
    badgeColor: "#d08d95",
    title: "Level 3 — Loops & Arrays",
    task: 'Write code that loops through an array and prints each value using console.log().',
    example: 'const arr = [1,2,3]; arr.forEach(x => console.log(x));',
    starter: "// Loop through an array and print each value\nconst arr = [1, 2, 3];\n",
    requirements: [
      { label: '"for", "forEach", or "map" used', check: (code) => /\bfor\b|\bforEach\b|\bmap\b/.test(code) },
    ],
  },
];

const CERT_STARTER = `<div style="border: 4px double gold; padding: 48px; text-align: center; font-family: Georgia, serif; background: #fffdf0; border-radius: 16px; max-width: 520px; margin: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
  <div style="font-size: 36px; margin-bottom: 8px;">🏆</div>
  <h1 style="color: #b8860b; font-size: 26px; margin: 0 0 6px;">Certificate of Completion</h1>
  <p style="color: #888; font-size: 14px; margin: 0 0 20px;">This certifies that</p>
  <h2 style="color: #1a1a1a; font-size: 28px; margin: 0 0 8px; font-style: italic;">Your Name Here</h2>
  <p style="color: #555; font-size: 15px; margin: 0 0 20px;">has successfully completed the</p>
  <h3 style="color: #4f46e5; font-size: 20px; margin: 0 0 24px;">JavaScript Lab Challenge ✨</h3>
  <hr style="border: none; border-top: 1px solid #e2c97e; margin: 0 0 20px;" />
  <p style="font-size: 12px; color: #aaa; margin: 0;">Issued · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
</div>`;

function runUserCode(code) {
  const logs = [];
  const fakeConsole = { log: (...args) => logs.push(args.map(String).join(" ")) };
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code);
    const result = fn(fakeConsole);
    if (result !== undefined) logs.push(String(result));
  } catch (err) {
    return { logs: [], error: err.message };
  }
  return { logs, error: null };
}

export default function JavaScriptLab() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [code, setCode] = useState(LEVELS[0].starter);
  const [output, setOutput] = useState([]);
  const [results, setResults] = useState([]);
  const [ran, setRan] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [certCode, setCertCode] = useState(CERT_STARTER);
  const certRef = useRef(null);

  const level = LEVELS[levelIndex];

  useEffect(() => {
    setCode(level.starter);
    setResults([]);
    setOutput([]);
    setRan(false);
    setPassed(false);
    setShowHint(false);
  }, [levelIndex]);

  useEffect(() => {
    if (showCert && certRef.current) renderCert(certCode);
  }, [certCode, showCert]);

  const renderCert = (html) => {
    const doc = certRef.current.contentDocument || certRef.current.contentWindow.document;
    doc.open();
    doc.write(`<html><head><style>body{margin:0;padding:32px;background:#f0f0f5;display:flex;justify-content:center;align-items:center;min-height:100vh;box-sizing:border-box;}</style></head><body>${html}</body></html>`);
    doc.close();
  };

  const handleRun = () => {
    const checks = level.requirements.map((r) => ({ label: r.label, ok: r.check(code) }));
    const { logs, error } = runUserCode(code);

    setResults(checks);
    setRan(true);

    const allPassed = checks.every((c) => c.ok);
    setPassed(allPassed);

    const outputLines = [];
    if (error) outputLines.push({ type: "error", text: `⚠ Error: ${error}` });
    logs.forEach((l) => outputLines.push({ type: "log", text: l }));
    if (allPassed) outputLines.push({ type: "success", text: "✔ All test cases passed!" });
    else if (!error) outputLines.push({ type: "fail", text: "✘ Some checks failed. Review your code." });

    setOutput(outputLines);
  };

  if (showCert) {
    return (
      <div style={s.root}>
        <div style={s.certTop}>
          <span style={s.logo}>⟨/⟩ JS Lab</span>
          <h1 style={s.certTitle}>Create Your Certificate</h1>
          <p style={s.certSub}>You crushed all 3 levels. Edit the HTML below to personalize your certificate.</p>
        </div>
        <div style={s.certGrid}>
          <div style={s.panel}>
            <div style={s.panelHead}>
              <span style={s.panelLabel}>HTML Editor</span>
              <span style={{ fontSize: 11, color: "#475569" }}>Edit freely</span>
            </div>
            <textarea
              style={{ ...s.editor, minHeight: 360 }}
              value={certCode}
              onChange={(e) => setCertCode(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div style={s.panel}>
            <div style={s.panelHead}>
              <span style={s.panelLabel}>Live Preview</span>
              <span style={{ fontSize: 11, color: "#7fbf96" }}>● Live</span>
            </div>
            <iframe ref={certRef} style={s.iframe} title="cert" />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button style={s.ghostBtn} onClick={() => { setShowCert(false); setLevelIndex(0); }}>↩ Restart Lab</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.topRow}>
          <span style={s.logo}>⟨/⟩ JS Lab</span>
          <div style={s.pips}>
            {LEVELS.map((l, i) => (
              <div key={l.id} style={{
                ...s.pip,
                background: i < levelIndex ? "#7fbf96" : i === levelIndex ? level.badgeColor : "#1e1e3a",
                boxShadow: i === levelIndex ? `0 0 10px ${level.badgeColor}66` : "none",
              }} />
            ))}
          </div>
        </div>
        <div style={s.taskCard}>
          <span style={{ ...s.badge, background: level.badgeColor + "1a", color: level.badgeColor, border: `1px solid ${level.badgeColor}44` }}>
            {level.badge}
          </span>
          <h2 style={s.levelTitle}>{level.title}</h2>
          <p style={s.taskText}>{level.task}</p>
          <div style={s.hintRow}>
            <button style={s.hintToggle} onClick={() => setShowHint(!showHint)}>
              {showHint ? "▾ Hide Example" : "▸ Show Example"}
            </button>
            {showHint && <code style={s.hintCode}>{level.example}</code>}
          </div>
        </div>
      </div>

      {/* Editor + Output */}
      <div style={s.grid}>
        {/* Editor */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <div style={s.trafficLights}>
              <span style={{ ...s.tl, background: "#d08d95" }} />
              <span style={{ ...s.tl, background: "#d8b25a" }} />
              <span style={{ ...s.tl, background: "#7fbf96" }} />
            </div>
            <span style={s.panelLabel}>script.js</span>
            <button style={s.resetBtn} onClick={() => { setCode(level.starter); setOutput([]); setResults([]); setRan(false); setPassed(false); }}>
              ↺ Reset
            </button>
          </div>
          <textarea
            style={s.editor}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Write your JavaScript here..."
          />
          <div style={s.editorFoot}>
            <button style={s.runBtn} onClick={handleRun}>▶ Run Code</button>
          </div>
        </div>

        {/* Output */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelLabel}>Console Output</span>
            <span style={{ fontSize: 11, color: output.length ? "#7fbf96" : "#334155" }}>
              {output.length ? `${output.length} line${output.length > 1 ? "s" : ""}` : "No output yet"}
            </span>
          </div>

          <div style={s.console}>
            {!ran && (
              <div style={s.consolePlaceholder}>Press "Run Code" to see output here...</div>
            )}
            {output.map((line, i) => (
              <div key={i} style={{
                ...s.consoleLine,
                color: line.type === "error" ? "#d08d95" : line.type === "success" ? "#7fbf96" : line.type === "fail" ? "#fb923c" : "#a5f3fc",
              }}>
                <span style={{ color: "#334155", userSelect: "none", marginRight: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                {line.text}
              </div>
            ))}
          </div>

          {/* Test Results */}
          {ran && (
            <div style={s.tests}>
              <div style={s.testsLabel}>Test Cases</div>
              {results.map((r) => (
                <div key={r.label} style={s.testRow}>
                  <span style={{ color: r.ok ? "#7fbf96" : "#d08d95", fontSize: 15, marginRight: 8 }}>{r.ok ? "✔" : "✘"}</span>
                  <span style={{ color: r.ok ? "#cbd5e1" : "#64748b", fontFamily: "monospace", fontSize: 12 }}>{r.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          {passed && (
            <div style={s.navArea}>
              {levelIndex < LEVELS.length - 1 ? (
                <button style={s.nextBtn} onClick={() => setLevelIndex(levelIndex + 1)}>
                  Next Level →
                </button>
              ) : (
                <button style={{ ...s.nextBtn, background: "linear-gradient(135deg, #8b7ac0, #a855f7)" }} onClick={() => setShowCert(true)}>
                  🏆 Claim Certificate
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: 520,
    background: "#080812",
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    padding: "24px",
    boxSizing: "border-box",
  },
  header: { marginBottom: 20 },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 14,
  },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    color: "#d8b25a",
    letterSpacing: "-0.5px",
  },
  pips: { display: "flex", gap: 8 },
  pip: {
    width: 36,
    height: 5,
    borderRadius: 3,
    transition: "all 0.3s",
  },
  taskCard: {
    background: "#0d0d1f",
    border: "1px solid #1e1e3a",
    borderRadius: 10,
    padding: "18px 22px",
  },
  badge: {
    fontSize: 10,
    fontWeight: 800,
    padding: "3px 10px",
    borderRadius: 4,
    letterSpacing: 2,
    textTransform: "uppercase",
    display: "inline-block",
    marginBottom: 8,
  },
  levelTitle: {
    margin: "4px 0 6px",
    fontSize: 18,
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "system-ui, sans-serif",
  },
  taskText: {
    margin: "0 0 10px",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: "system-ui, sans-serif",
  },
  hintRow: { display: "flex", flexDirection: "column", gap: 8 },
  hintToggle: {
    background: "none",
    border: "1px solid #1e1e3a",
    color: "#475569",
    fontSize: 12,
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: 4,
    fontFamily: "inherit",
    width: "fit-content",
  },
  hintCode: {
    background: "#0a0a20",
    border: "1px solid #d8b25a33",
    color: "#d8b25a",
    padding: "8px 14px",
    borderRadius: 6,
    fontSize: 12,
    display: "block",
    fontFamily: "inherit",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  panel: {
    background: "#0c0c1e",
    border: "1px solid #1a1a30",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  panelHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderBottom: "1px solid #1a1a30",
    background: "#090916",
  },
  panelLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: 700,
    color: "#334155",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  trafficLights: { display: "flex", gap: 5 },
  tl: { width: 10, height: 10, borderRadius: "50%", opacity: 0.8 },
  resetBtn: {
    background: "none",
    border: "1px solid #1e1e3a",
    color: "#475569",
    fontSize: 11,
    cursor: "pointer",
    padding: "3px 8px",
    borderRadius: 4,
    fontFamily: "inherit",
  },
  editor: {
    flex: 1,
    background: "#08081a",
    color: "#a5f3fc",
    border: "none",
    outline: "none",
    padding: "18px",
    fontSize: 13,
    fontFamily: "inherit",
    lineHeight: 1.9,
    resize: "none",
    minHeight: 200,
    tabSize: 2,
  },
  editorFoot: {
    padding: "10px 14px",
    borderTop: "1px solid #1a1a30",
    background: "#090916",
  },
  runBtn: {
    background: "linear-gradient(135deg, #15803d, #7fbf96)",
    color: "#021a0a",
    border: "none",
    padding: "9px 24px",
    borderRadius: 6,
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: 0.5,
  },
  console: {
    flex: 1,
    minHeight: 180,
    padding: "14px",
    overflowY: "auto",
    background: "#06060f",
  },
  consolePlaceholder: {
    color: "#1e293b",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 8,
  },
  consoleLine: {
    fontSize: 13,
    lineHeight: 1.8,
    display: "flex",
    alignItems: "flex-start",
  },
  tests: {
    borderTop: "1px solid #1a1a30",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  testsLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#334155",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  testRow: {
    display: "flex",
    alignItems: "center",
  },
  navArea: {
    padding: "12px 14px",
    borderTop: "1px solid #1a1a30",
    background: "#090916",
  },
  nextBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #1d4ed8, #6366f1)",
    color: "white",
    border: "none",
    padding: "11px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
  },
  // Cert styles
  certTop: { marginBottom: 20 },
  certTitle: {
    margin: "8px 0 4px",
    fontSize: 24,
    fontWeight: 800,
    color: "#f1f5f9",
    fontFamily: "system-ui, sans-serif",
  },
  certSub: {
    margin: 0,
    color: "#475569",
    fontSize: 14,
    fontFamily: "system-ui, sans-serif",
  },
  certGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    minHeight: 440,
  },
  iframe: {
    flex: 1,
    border: "none",
    width: "100%",
    minHeight: 380,
    background: "#f0f0f5",
  },
  ghostBtn: {
    background: "none",
    color: "#475569",
    border: "1px solid #1e1e3a",
    padding: "9px 22px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
  },
};
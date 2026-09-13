import { useState, useRef } from "react";

const STARTER_CODE = `<!DOCTYPE html>
<html>
  <head>
    <title>My Certificate</title>
  </head>
  <body>
    <h1>Certificate of Completion</h1>
    <p>Awarded to: Your Name</p>
  </body>
</html>`;

function validateCode(code) {
  const hasDoctype = /<!DOCTYPE\s+html>/i.test(code);
  const hasHTML = /<html[\s>]/i.test(code) && /<\/html>/i.test(code);
  const hasBody = /<body[\s>]/i.test(code) && /<\/body>/i.test(code);
  return { hasDoctype, hasHTML, hasBody, passed: hasDoctype && hasHTML && hasBody };
}

export default function CertificateBuilder({ onBack }) {
  const [code, setCode] = useState(STARTER_CODE);
  const [testResult, setTestResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const textareaRef = useRef(null);

  const handleRunTests = () => {
    setAnimating(true);
    setTimeout(() => {
      setTestResult(validateCode(code));
      setAnimating(false);
    }, 800);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validation = testResult;

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← RETREAT</button>
        <div style={styles.titleBlock}>
          <span style={styles.levelBadge}>FINAL LEVEL</span>
          <h2 style={styles.title}>Certificate Builder</h2>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.statusDot(testResult?.passed)} />
          <span style={styles.statusLabel}>
            {testResult === null ? "AWAITING TEST" : testResult.passed ? "MISSION COMPLETE" : "FIX & RETRY"}
          </span>
        </div>
      </div>

      {/* Scan line effect bar */}
      <div style={styles.scanBar} />

      {/* Main split layout */}
      <div style={styles.workspace}>
        {/* LEFT: Editor */}
        <div style={styles.editorPanel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelIcon}>⌨</span>
            <span style={styles.panelLabel}>HTML EDITOR</span>
            <span style={styles.panelMeta}>{code.length} chars</span>
          </div>
          <textarea
            ref={textareaRef}
            style={styles.editor}
            value={code}
            onChange={(e) => { setCode(e.target.value); setTestResult(null); }}
            spellCheck={false}
          />

          {/* Test Results */}
          <div style={styles.resultsBox}>
            <div style={styles.resultsTitle}>TEST CASES</div>
            <CheckRow
              label="<!DOCTYPE html> present"
              state={testResult === null ? "pending" : testResult.hasDoctype ? "pass" : "fail"}
            />
            <CheckRow
              label="<html>...</html> present"
              state={testResult === null ? "pending" : testResult.hasHTML ? "pass" : "fail"}
            />
            <CheckRow
              label="<body>...</body> present"
              state={testResult === null ? "pending" : testResult.hasBody ? "pass" : "fail"}
            />
          </div>

          {/* Action Buttons */}
          <div style={styles.actionRow}>
            <button
              style={styles.runBtn}
              onClick={handleRunTests}
              disabled={animating}
            >
              {animating ? (
                <span style={styles.runningText}>⟳ RUNNING...</span>
              ) : (
                "▶ RUN TEST CASES"
              )}
            </button>

            {testResult && (
              <div style={styles.verdict(testResult.passed)}>
                {testResult.passed
                  ? "✅ All test cases passed"
                  : "❌ Test cases failed"}
              </div>
            )}

            {testResult?.passed && (
              <button style={styles.downloadBtn} onClick={handleDownload}>
                🏅 DOWNLOAD CERTIFICATE
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div style={styles.previewPanel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelIcon}>◉</span>
            <span style={styles.panelLabel}>LIVE PREVIEW</span>
            <span style={styles.liveDot} />
          </div>
          <div style={styles.previewFrame}>
            <div
              style={styles.previewInner}
              dangerouslySetInnerHTML={{ __html: code }}
            />
          </div>
          <div style={styles.previewFooter}>
            Renders in real-time as you type
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckRow({ label, state }) {
  const icon = state === "pending" ? "○" : state === "pass" ? "✓" : "✗";
  const color = state === "pending" ? "#555" : state === "pass" ? "#7fbf96" : "#b85c4e";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: "1px solid #1a1a1a" }}>
      <span style={{ color, fontFamily: "monospace", fontSize: 14, width: 16 }}>{icon}</span>
      <span style={{ color: state === "pending" ? "#555" : "#ccc", fontFamily: "monospace", fontSize: 12 }}>{label}</span>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Courier New', monospace",
    color: "#ccc",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "#0f0f0f",
    borderBottom: "2px solid #d4805c",
    gap: 16,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#888",
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 1,
    transition: "all 0.2s",
  },
  titleBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  levelBadge: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#d4805c",
    background: "rgba(255,106,0,0.1)",
    padding: "2px 10px",
    border: "1px solid #d4805c",
  },
  title: { margin: 0, fontSize: 18, color: "#fff", letterSpacing: 2, fontWeight: 700 },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  statusDot: (passed) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: passed === null ? "#444" : passed ? "#7fbf96" : "#b85c4e",
    boxShadow: passed === true ? "0 0 8px #7fbf96" : passed === false ? "0 0 8px #b85c4e" : "none",
    transition: "all 0.3s",
  }),
  statusLabel: { fontSize: 10, letterSpacing: 2, color: "#666" },
  scanBar: {
    height: 2,
    background: "linear-gradient(90deg, transparent, #d4805c, transparent)",
    animation: "scan 3s linear infinite",
  },
  workspace: {
    flex: 1,
    display: "flex",
    gap: 0,
    overflow: "hidden",
    minHeight: "calc(100vh - 80px)",
  },
  editorPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e1e1e",
    minWidth: 0,
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    background: "#111",
    borderBottom: "1px solid #1e1e1e",
  },
  panelIcon: { fontSize: 14, color: "#d4805c" },
  panelLabel: { fontSize: 10, letterSpacing: 3, color: "#888", flex: 1 },
  panelMeta: { fontSize: 10, color: "#444" },
  liveDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#7fbf96", boxShadow: "0 0 6px #7fbf96",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  editor: {
    flex: 1,
    background: "#0d0d0d",
    color: "#e8e8e8",
    border: "none",
    outline: "none",
    padding: "16px",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    lineHeight: 1.7,
    resize: "none",
    minHeight: 280,
    tabSize: 2,
  },
  resultsBox: {
    background: "#0f0f0f",
    borderTop: "1px solid #1e1e1e",
    padding: "10px 16px",
  },
  resultsTitle: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#444",
    marginBottom: 8,
  },
  actionRow: {
    padding: "12px 16px",
    background: "#0a0a0a",
    borderTop: "1px solid #1e1e1e",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  runBtn: {
    padding: "10px 0",
    background: "linear-gradient(135deg, #d4805c, #b85c4e)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: 700,
    width: "100%",
    transition: "opacity 0.2s",
  },
  runningText: { display: "inline-block", animation: "spin 1s linear infinite" },
  verdict: (passed) => ({
    textAlign: "center",
    padding: "8px",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 1,
    color: passed ? "#7fbf96" : "#b85c4e",
    background: passed ? "rgba(57,255,133,0.07)" : "rgba(255,68,68,0.07)",
    border: `1px solid ${passed ? "#7fbf96" : "#b85c4e"}`,
  }),
  downloadBtn: {
    padding: "10px 0",
    background: "transparent",
    color: "#7fbf96",
    border: "2px solid #7fbf96",
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: 700,
    width: "100%",
    transition: "all 0.2s",
  },
  previewPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  previewFrame: {
    flex: 1,
    background: "#fff",
    margin: 16,
    border: "1px solid #2a2a2a",
    overflow: "auto",
    minHeight: 300,
  },
  previewInner: {
    width: "100%",
    height: "100%",
    minHeight: 300,
    fontFamily: "sans-serif",
    color: "#000",
    padding: 16,
    boxSizing: "border-box",
  },
  previewFooter: {
    textAlign: "center",
    fontSize: 10,
    color: "#333",
    paddingBottom: 10,
    letterSpacing: 1,
  },
};

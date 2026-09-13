import { useState } from "react";

/**
 * LabScreen.jsx
 * Split-panel coding playground: instructions + editor + live preview
 */
export default function LabScreen({ level, onBack, onPass }) {
  const [code, setCode] = useState(level.starterCode);
  const [result, setResult] = useState(null); // null | "pass" | "fail"
  const [showHint, setShowHint] = useState(false);

  const handleRun = () => {
    const passed = code.includes(level.answer);
    setResult(passed ? "pass" : "fail");
    if (passed && onPass) onPass(level.id, level.xp);
  };

  const handleReset = () => {
    setCode(level.starterCode);
    setResult(null);
    setShowHint(false);
  };

  return (
    <div style={s.root}>
      {/* ── Top Bar ── */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={onBack}>← BACK</button>
        <div style={s.topCenter}>
          <span style={s.levelTag}>LEVEL {level.id}</span>
          <span style={s.levelTitle}>{level.title}</span>
        </div>
        <span style={s.xpTag}>+{level.xp} XP</span>
      </div>

      {/* ── Main Split Layout ── */}
      <div style={s.workspace}>

        {/* LEFT — Instructions & Controls */}
        <div style={s.leftPanel}>
          <div style={s.sectionLabel}>📋 MISSION BRIEF</div>
          <pre style={s.instructions}>{level.instruction}</pre>

          {/* Hint toggle */}
          <button
            style={s.hintBtn}
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "▲ Hide Hint" : "💡 Show Hint"}
          </button>
          {showHint && (
            <div style={s.hintBox}>{level.hint}</div>
          )}

          {/* Result banner */}
          {result && (
            <div style={s.resultBanner(result === "pass")}>
              {result === "pass"
                ? "✅ All test cases passed!"
                : "❌ Test cases failed — check your code and try again."}
            </div>
          )}

          {/* Action buttons */}
          <div style={s.btnRow}>
            <button style={s.runBtn} onClick={handleRun}>
              ▶ RUN CODE
            </button>
            <button style={s.resetBtn} onClick={handleReset}>
              ↺ RESET
            </button>
          </div>

          {/* Validation rule display */}
          <div style={s.ruleBox}>
            <div style={s.ruleLabel}>VALIDATION RULE</div>
            <code style={s.ruleCode}>
              code must contain: <span style={s.ruleAnswer}>{level.answer}</span>
            </code>
          </div>
        </div>

        {/* RIGHT — Editor + Preview */}
        <div style={s.rightPanel}>
          {/* Editor */}
          <div style={s.editorBlock}>
            <div style={s.panelHeader}>
              <span style={s.dot("#ff5f57")} />
              <span style={s.dot("#febc2e")} />
              <span style={s.dot("#28c840")} />
              <span style={s.panelLabel}>index.html</span>
            </div>
            <textarea
              style={s.editor}
              value={code}
              onChange={(e) => { setCode(e.target.value); setResult(null); }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          {/* Live Preview */}
          <div style={s.previewBlock}>
            <div style={s.panelHeader}>
              <span style={s.previewIcon}>◉</span>
              <span style={s.panelLabel}>LIVE PREVIEW</span>
              <span style={s.liveTag}>LIVE</span>
            </div>
            <div style={s.previewArea}>
              <div
                style={s.previewContent}
                dangerouslySetInnerHTML={{ __html: code }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const FONT = "'Courier New', Courier, monospace";
const ORANGE = "#d4805c";
const GREEN = "#7fbf96";
const BG = "#0a0a0a";
const PANEL = "#0f0f0f";
const BORDER = "#1e1e1e";

const s = {
  root: {
    minHeight: 520,
    background: BG,
    fontFamily: FONT,
    color: "#ccc",
    display: "flex",
    flexDirection: "column",
  },

  /* Top bar */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: PANEL,
    borderBottom: `2px solid ${ORANGE}`,
    gap: 12,
  },
  backBtn: {
    background: "transparent",
    border: `1px solid #333`,
    color: "#777",
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1,
    flexShrink: 0,
  },
  topCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  levelTag: {
    fontSize: 9,
    letterSpacing: 4,
    color: ORANGE,
    border: `1px solid ${ORANGE}`,
    background: "rgba(255,106,0,0.08)",
    padding: "2px 10px",
  },
  levelTitle: {
    fontSize: 15,
    color: "#fff",
    fontWeight: 700,
    letterSpacing: 1,
  },
  xpTag: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: 900,
    letterSpacing: 2,
    flexShrink: 0,
  },

  /* Workspace */
  workspace: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    minHeight: 460,
  },

  /* LEFT panel */
  leftPanel: {
    width: 320,
    flexShrink: 0,
    borderRight: `1px solid ${BORDER}`,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    overflowY: "auto",
    background: "#0c0c0c",
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#555",
  },
  instructions: {
    margin: 0,
    fontSize: 12,
    color: "#aaa",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
    fontFamily: FONT,
    background: "#111",
    border: `1px solid ${BORDER}`,
    padding: "12px 14px",
    borderLeft: `3px solid ${ORANGE}`,
  },
  hintBtn: {
    background: "transparent",
    border: `1px solid #2a2a2a`,
    color: "#666",
    padding: "7px 14px",
    cursor: "pointer",
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: "left",
    transition: "border-color 0.2s",
  },
  hintBox: {
    background: "rgba(57,255,133,0.05)",
    border: `1px solid ${GREEN}`,
    color: GREEN,
    padding: "10px 14px",
    fontSize: 12,
    lineHeight: 1.6,
  },
  resultBanner: (passed) => ({
    padding: "12px 14px",
    background: passed ? "rgba(57,255,133,0.07)" : "rgba(255,68,68,0.07)",
    border: `1px solid ${passed ? GREEN : "#b85c4e"}`,
    color: passed ? GREEN : "#b85c4e",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    lineHeight: 1.5,
  }),
  btnRow: {
    display: "flex",
    gap: 10,
  },
  runBtn: {
    flex: 1,
    padding: "10px 0",
    background: `linear-gradient(135deg, ${ORANGE}, #b85c4e)`,
    border: "none",
    color: "#fff",
    fontFamily: FONT,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: 700,
    cursor: "pointer",
  },
  resetBtn: {
    padding: "10px 14px",
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#555",
    fontFamily: FONT,
    fontSize: 12,
    cursor: "pointer",
    letterSpacing: 1,
  },
  ruleBox: {
    marginTop: "auto",
    padding: "12px 14px",
    background: "#111",
    border: `1px solid ${BORDER}`,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  ruleLabel: { fontSize: 9, color: "#444", letterSpacing: 3 },
  ruleCode: { fontSize: 11, color: "#666" },
  ruleAnswer: { color: ORANGE, fontWeight: 700 },

  /* RIGHT panel */
  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  editorBlock: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderBottom: `1px solid ${BORDER}`,
    minHeight: 0,
  },
  previewBlock: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    background: "#111",
    borderBottom: `1px solid ${BORDER}`,
    flexShrink: 0,
  },
  dot: (color) => ({
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  panelLabel: { fontSize: 10, color: "#555", letterSpacing: 2, flex: 1 },
  previewIcon: { fontSize: 12, color: ORANGE },
  liveTag: {
    fontSize: 9,
    color: GREEN,
    border: `1px solid ${GREEN}`,
    padding: "1px 6px",
    letterSpacing: 2,
  },
  editor: {
    flex: 1,
    background: "#080808",
    color: "#4ec94e",           // green text for code
    border: "none",
    outline: "none",
    padding: "16px",
    fontFamily: FONT,
    fontSize: 13,
    lineHeight: 1.75,
    resize: "none",
    tabSize: 2,
  },
  previewArea: {
    flex: 1,
    background: "#fff",
    overflow: "auto",
    margin: 12,
    border: `1px solid #2a2a2a`,
  },
  previewContent: {
    padding: 16,
    fontFamily: "sans-serif",
    color: "#000",
    fontSize: 14,
    lineHeight: 1.6,
    minHeight: "100%",
  },
};

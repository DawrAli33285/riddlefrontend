import { useState } from "react";
import { MapPin, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";

const C = "#00a2ce";
const CGLOW = "rgba(0,162,206,0.5)";
const CDIM = "rgba(0,162,206,0.12)";

function ProgressBar({ current, total }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px" }}>PROGRESS</span>
        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px" }}>{current - 1} / {total} SPOTS</span>
      </div>
      <div style={{ width: "100%", height: 6, borderRadius: 999, background: CDIM, border: "1px solid rgba(0,162,206,0.2)", marginBottom: 8 }}>
        <div style={{
          height: "100%",
          borderRadius: 999,
          width: `${((current - 1) / total) * 100}%`,
          background: `linear-gradient(90deg, ${C}, #00d4ff)`,
          transition: "width 0.7s ease",
          animation: "progressGlow 2s ease-in-out infinite",
        }} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => {
          const done = i + 1 < current;
          const active = i + 1 === current;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                transition: "all 0.5s",
                background: done ? C : active ? CGLOW : "rgba(0,162,206,0.08)",
                border: `1px solid ${done || active ? "rgba(0,162,206,0.5)" : "rgba(0,162,206,0.12)"}`,
                animation: done || active ? "capsuleGlow 2s ease-in-out infinite" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function CodeInput({ onSubmit, levelId }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [shake, setShake] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    const correct = await onSubmit(code);
    if (correct) {
      setStatus("success");
      setCode("");
      setTimeout(() => setStatus("idle"), 1500); 
    } else {
      setStatus("error");
      setShake(true);
      setTimeout(() => { setShake(false); setStatus("idle"); }, 1200);
    }
  };


  return (
    <div>
      <label style={{ fontSize: 11, letterSpacing: "2px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 8 }}>SECRET CODE</label>
      <div style={{ display: "flex", gap: 10, transform: shake ? "translateX(4px)" : "none", transition: "transform 0.1s" }}>
        <input
          key={levelId}
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="ENTER CODE FOUND AT SPOT..."
          style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: "2px", color: "#fff", background: "rgba(0,162,206,0.06)", border: `1px solid ${C}`, borderRadius: 6, padding: "12px 16px", outline: "none", boxShadow: `0 0 0 1px rgba(0,162,206,0.15)` }}
          disabled={status === "success"}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "success" || status === "loading" || !code.trim()}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: C, color: "#0a1628", fontSize: 11, fontWeight: 700, letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace", border: "none", borderRadius: 6, cursor: "pointer", boxShadow: `0 0 16px ${CGLOW}`, opacity: (status === "success" || !code.trim()) ? 0.4 : 1 }}
        >
          SUBMIT <ChevronRight size={14} />
        </button>
      </div>
      {status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "#f87171", fontFamily: "'JetBrains Mono', monospace" }}>
          <AlertTriangle size={12} /><span>INVALID CODE — TRY AGAIN.</span>
        </div>
      )}
      {status === "success" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}>
          <CheckCircle size={12} /><span>CODE ACCEPTED — UNLOCKING NEXT MISSION...</span>
        </div>
      )}
    </div>
  );
}

export default function GameScreen({ mission, currentLevel, completedMissions, totalMissions, onSubmitCode, onHome, loading }) {
  const [hintVisible, setHintVisible] = useState(false);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: C, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px" }}>
        LOADING MISSION...
      </span>
    </div>
  );

  if (!mission) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 50, borderLeft: "none", borderRight: "none", borderTop: "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
                <path d="M32 4C20.95 4 12 12.95 12 24c0 16 20 36 20 36s20-20 20-36C52 12.95 43.05 4 32 4z" fill="#1a3a5c" />
                <circle cx="32" cy="24" r="10" fill="white" />
                <circle cx="32" cy="24" r="6" fill="#1a3a5c" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: C, letterSpacing: "3px" }}>SPOTHUNT</div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace" }}>THE CHALLENGE</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <button onClick={onHome} style={{ fontSize: 11, letterSpacing: "2px", color: "#64748b", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>HOME</button>
            <button style={{ fontSize: 11, letterSpacing: "2px", color: C, background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textShadow: `0 0 10px ${CGLOW}` }}>PLAY</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 768, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 32 }}>
        <ProgressBar current={completedMissions + 1} total={totalMissions} />
        </div>

        <div className="glass scanline" style={{ borderRadius: 12, overflow: "hidden", position: "relative", border: "1px solid rgba(0,162,206,0.35)", boxShadow: `0 0 30px rgba(0,162,206,0.08)` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 24px", borderBottom: "1px solid rgba(0,162,206,0.2)", background: "rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={12} color={C} />
              <span style={{ fontSize: 11, color: C, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px" }}>CURRENT MISSION</span>
            </div>
            <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>LVL {completedMissions + 1} / {totalMissions}</span>
          </div>

          <div style={{ padding: 32 }}>
            <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 700, color: C, textShadow: `0 0 20px ${CGLOW}`, marginBottom: 6, marginTop: 0 }}>MISSION {mission.mission_number}</h2>
<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
  <MapPin size={11} /><span>FIND THE SPOT</span>
</div>
            </div>

            <div style={{ borderLeft: `2px solid ${C}`, paddingLeft: 20, marginBottom: 28 }}>
              <p style={{ fontSize: 10, letterSpacing: "2px", color: C, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8, marginTop: 0 }}>RIDDLE</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8, margin: 0 }}>{mission.riddle}</p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <button
                onClick={() => setHintVisible(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "2px", color: C, fontFamily: "'JetBrains Mono', monospace", background: hintVisible ? CDIM : "transparent", border: "1px solid rgba(0,162,206,0.3)", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}
              >
                <MapPin size={12} color={C} />
                {hintVisible ? "HIDE HINT" : "REVEAL HINT"}
              </button>
              {hintVisible && (
                <div style={{ marginTop: 10, padding: "14px 16px", borderRadius: 6, background: CDIM, border: "1px solid rgba(0,162,206,0.25)", fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>
              {mission.tip}
                </div>
              )}
            </div>

            <CodeInput onSubmit={onSubmitCode} levelId={currentLevel} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button onClick={onHome} style={{ fontSize: 11, letterSpacing: "2px", color: "#475569", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>↺ ABORT MISSION</button>
        </div>
      </div>
    </div>
  );
}
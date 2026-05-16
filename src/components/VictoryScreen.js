import { useState, useEffect } from "react";
import { Trophy, RotateCcw, Home } from "lucide-react";

const C = "#00a2ce";
const CGLOW = "rgba(0,162,206,0.5)";

export default function VictoryScreen({ onRestart, onHome,totalMissions,totalMissionsLoading }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(0,162,206,0.1)", border: `2px solid ${C}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", boxShadow: `0 0 40px ${CGLOW}` }} className="animate-pulse-glow">
          <Trophy size={40} color={C} />
        </div>

        <p style={{ fontSize: 11, letterSpacing: "3px", color: C, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>// OPERATION COMPLETE</p>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 48, fontWeight: 900, lineHeight: 1, color: "#fff", marginBottom: 4 }}>MISSION</div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 48, fontWeight: 900, lineHeight: 1, color: C, textShadow: `0 0 30px ${CGLOW}`, marginBottom: 32 }}>ACCOMPLISHED</div>

        <div className="glass" style={{ borderRadius: 12, padding: 32, marginBottom: 32, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, letterSpacing: "2px", color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}>ALL SIGNALS CONFIRMED</span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>
            You have successfully completed all five missions. Every code cracked, every location found. You are among the few who made it to the final signal.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, paddingTop: 24, borderTop: "1px solid rgba(0,162,206,0.2)" }}>
            {[[`${totalMissionsLoading?'...':totalMissions+'/'+totalMissions} `, "MISSIONS"], ["ELITE", "RANK"], ["COMPLETE", "STATUS"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 700, color: C, textShadow: `0 0 12px ${CGLOW}`, marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 10, letterSpacing: "2px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button onClick={onHome} className="glass" style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 6, fontSize: 11, letterSpacing: "2px", color: "#94a3b8", background: "none", border: "1px solid rgba(0,162,206,0.25)", cursor: "pointer", fontFamily: "'Orbitron', sans-serif" }}>
            <Home size={14} /> HOME
          </button>
          <button onClick={onRestart} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", background: C, color: "#0a1628", fontSize: 11, fontWeight: 700, letterSpacing: "2px", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Orbitron', sans-serif", boxShadow: `0 0 20px ${CGLOW}` }}>
            <RotateCcw size={14} /> RESTART HUNT
          </button>
        </div>

        <p style={{ fontSize: 10, color: "#334155", letterSpacing: "3px", marginTop: 32, fontFamily: "'JetBrains Mono', monospace" }}>SPOTHUNT CHALLENGE — OPERATIVE CLEARANCE: OMEGA</p>
      </div>
    </div>
  );
}
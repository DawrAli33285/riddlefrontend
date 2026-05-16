import { useState, useEffect } from "react";
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../baseurl";

const C = "#00a2ce";
const CGLOW = "rgba(0,162,206,0.5)";



const BOOT = [
  "> initializing_secure_channel ......",
  "> verifying_clearance_level ........",
  "> awaiting_operative_credentials ...",
];

export default function AuthScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    BOOT.forEach((_, i) => setTimeout(() => setLines(i + 1), i * 600 + 300));
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      onLogin();
    } catch (err) {
      console.log(err.message)
      setError("ACCESS DENIED — INVALID CREDENTIALS");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0d1b2e", backgroundImage: "linear-gradient(rgba(0,162,206,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,162,206,0.05) 1px,transparent 1px),radial-gradient(ellipse at top,#142236 0%,#0a1420 70%)", backgroundSize: "40px 40px,40px 40px,100% 100%" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border-2" style={{ borderColor: C, background: "rgba(0,162,206,0.1)", boxShadow: `0 0 30px ${CGLOW}` }}>
            <Shield size={28} color={C} />
          </div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: C, letterSpacing: "4px", textShadow: `0 0 20px ${CGLOW}` }}>ADMIN ACCESS</div>
          <div className="text-xs text-slate-500 tracking-widest font-mono mt-1">CLASSIFIED — AUTHORIZED PERSONNEL ONLY</div>
        </div>

        <div className="glass rounded-xl p-4 mb-6" style={{ border: "1px solid rgba(0,162,206,0.2)" }}>
          {BOOT.map((line, i) => (
            <div key={i} className="text-[11px] font-mono mb-1 transition-opacity duration-300" style={{ opacity: lines > i ? 1 : 0, color: i < 2 ? "#4ade80" : C }}>
              {line} {lines > i ? (i < 2 ? "OK" : "█") : ""}
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-6" style={{ border: `1px solid rgba(0,162,206,0.3)`, boxShadow: `0 0 40px rgba(0,162,206,0.1)` }}>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={14} color={C} />
            <span className="text-xs tracking-widest font-mono" style={{ color: C }}>ENTER PASSPHRASE</span>
          </div>

          <div className="relative mb-4">
  <input
    type="email"
    value={email}
    onChange={e => { setEmail(e.target.value); setError(""); }}
    onKeyDown={e => e.key === "Enter" && handleLogin()}
    placeholder="operative@domain.com"
    className="w-full bg-black/40 border rounded-lg px-4 py-3 text-sm font-mono text-white outline-none"
    style={{ borderColor: error ? "#ef4444" : "rgba(0,162,206,0.3)" }}
  />
</div>

          <div className="relative mb-4">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••••••"
              className="w-full bg-black/40 border rounded-lg px-4 py-3 text-sm font-mono text-white outline-none pr-12"
              style={{ borderColor: error ? "#ef4444" : "rgba(0,162,206,0.3)", letterSpacing: "4px" }}
            />
            <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 text-red-400 text-[11px] font-mono">
              <AlertTriangle size={12} /> {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password || !email}
            className="w-full py-3 rounded-lg font-mono text-xs tracking-widest font-bold transition-all"
            style={{ background: loading || !password || !email ? "rgba(0,162,206,0.3)" : C, color: "#0a1628", cursor: loading || !password || !email ? "not-allowed" : "pointer", boxShadow: loading || !password || !email ? "none" : `0 0 20px ${CGLOW}` }}
          >
            {loading ? "VERIFYING..." : "AUTHENTICATE →"}
          </button>

        
        </div>
      </div>
    </div>
  );
}
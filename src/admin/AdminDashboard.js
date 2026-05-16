import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../baseurl";

import {
  Shield, Save, LogOut, Edit3, Zap, RefreshCw,
  RotateCcw, CheckCircle, AlertTriangle,Trash2
} from "lucide-react";
import LevelCard from "./LevelCard";
import { DEFAULT_LEVELS } from "./levels";

const C = "#00a2ce";
const CGLOW = "rgba(0,162,206,0.5)";

function StatsBar({ stats }) {
  const items = [
    { label: "TOTAL MISSIONS", value: stats.totalMissions ?? "...", color: C },
    { label: "TOTAL USERS",    value: stats.totalUsers ?? "...",    color: "#4ade80" },
    { label: "COMPLETED GAME", value: stats.completedUsers ?? "...", color: "#a78bfa" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {items.map(s => (
        <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(10,25,45,0.75)", border: "1px solid rgba(0,162,206,0.15)" }}>
          <div className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
          <div className="text-[9px] text-slate-500 font-mono tracking-widest mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {

  const [globalSaved, setGlobalSaved] = useState(false);
const [resetConfirm, setResetConfirm] = useState(false);
const [levels, setLevels] = useState([]);
const [fetchError, setFetchError] = useState("");
const [stats, setStats] = useState({});
const [createModal, setCreateModal] = useState(false);
const [newRiddle, setNewRiddle] = useState({ mission_number: "", riddle: "", secret_code: "", tip: "" });
const [createError, setCreateError] = useState("");
const [creating, setCreating] = useState(false);
const [deleteConfirm, setDeleteConfirm] = useState(null); 
const [deleting, setDeleting] = useState(false);

  
  useEffect(() => {
      const fetchRiddles = async () => {
          try {
              const token = localStorage.getItem("adminToken");
              const res = await axios.get(`${BASE_URL}/admin/getRiddles`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log(res.data.riddles)

              const sorted = res.data.riddles.sort((a, b) => a.mission_number - b.mission_number); 
              setLevels(sorted);
              const token2 = localStorage.getItem("adminToken");
const statsRes = await axios.get(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token2}` }
});
setStats(statsRes.data);
          } catch (err) {
              setFetchError("Failed to load missions.");
              console.log(err.message);
          }
      };
      fetchRiddles();
  }, []);


  const deleteRiddle = async () => {
    setDeleting(true);
    try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`${BASE_URL}/admin/riddle`,
            {
                headers: { Authorization: `Bearer ${token}` },
                data: { mission_number: deleteConfirm }
            }
        );
        setLevels(prev => prev.filter(l => l.mission_number !== deleteConfirm));
        setDeleteConfirm(null);
    } catch (err) {
        alert(err.response?.data?.error || "Failed to delete mission.");
    } finally {
        setDeleting(false);
    }
};


  const createRiddle = async () => {
    if (!newRiddle.mission_number || !newRiddle.riddle || !newRiddle.secret_code || !newRiddle.tip) {
        setCreateError("All fields are required.");
        return;
    }
    setCreating(true);
    setCreateError("");
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.post(`${BASE_URL}/admin/riddle`,
            { ...newRiddle, mission_number: parseInt(newRiddle.mission_number) },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = [...levels, res.data.riddle].sort((a, b) => a.mission_number - b.mission_number);
        setLevels(updated);
        setCreateModal(false);
        setNewRiddle({ mission_number: "", riddle: "", secret_code: "", tip: "" });
    } catch (err) {
        setCreateError(err.response?.data?.error || "Failed to create mission.");
    } finally {
        setCreating(false);
    }
};

  const updateLevel = (index, updated) => {
    const next = [...levels];
    next[index] = updated;
    next.sort((a, b) => a.mission_number - b.mission_number);
    setLevels(next);
};


const saveAll = async () => {
  try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${BASE_URL}/admin/riddles/all`, 
          { riddles: levels },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setGlobalSaved(true);
      setTimeout(() => setGlobalSaved(false), 2500);
  } catch (err) {
      console.log(err.message);
      alert("Failed to save missions. Please try again.");
  }
};

  const resetGame = () => {
    localStorage.removeItem("spothunt_state");
    setResetConfirm(false);
  };

  const resetLevels = () => {
    setLevels(DEFAULT_LEVELS);
    localStorage.setItem("spothunt_levels", JSON.stringify(DEFAULT_LEVELS));
  };

  return (
    <div className="min-h-screen" style={{ background: "#0d1b2e", backgroundImage: "linear-gradient(rgba(0,162,206,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,162,206,0.05) 1px,transparent 1px),radial-gradient(ellipse at top,#142236 0%,#0a1420 70%)", backgroundSize: "40px 40px,40px 40px,100% 100%" }}>

      <nav style={{ background: "rgba(10,25,45,0.9)", borderBottom: "1px solid rgba(0,162,206,0.2)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
                <path d="M32 4C20.95 4 12 12.95 12 24c0 16 20 36 20 36s20-20 20-36C52 12.95 43.05 4 32 4z" fill="#1a3a5c" />
                <circle cx="32" cy="24" r="10" fill="white" />
                <circle cx="32" cy="24" r="6" fill="#1a3a5c" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: C, letterSpacing: "3px" }}>SPOTHUNT</div>
              <div className="text-[9px] text-slate-500 font-mono tracking-widest">ADMIN CONTROL CENTER</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {globalSaved && (
              <div className="flex items-center gap-1.5 text-green-400 text-[11px] font-mono animate-pulse">
                <CheckCircle size={12} /> ALL CHANGES SAVED
              </div>
            )}
            <button onClick={saveAll} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest" style={{ background: C, color: "#0a1628", boxShadow: `0 0 16px ${CGLOW}` }}>
              <Save size={12} /> SAVE ALL
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30">
              <LogOut size={12} /> EXIT
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} color={C} />
            <span className="text-[10px] font-mono tracking-widest" style={{ color: C }}>CLASSIFIED DASHBOARD</span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "2px" }}>MISSION CONTROL</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Edit riddles, hints, and secret codes for all 5 missions.</p>
        </div>

        <StatsBar stats={stats} />
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Edit3 size={13} color={C} />
            <span className="text-xs font-mono tracking-widest" style={{ color: C }}>MISSION EDITOR</span>
          </div>
          <div className="flex gap-2">
    <button onClick={() => setCreateModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest border transition-all"
        style={{ color: C, borderColor: "rgba(0,162,206,0.4)", background: "rgba(0,162,206,0.1)" }}>
        + NEW MISSION
    </button>
</div>
        </div>

        {resetConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="rounded-xl p-6 max-w-sm w-full mx-4" style={{ background: "#0d1b2e", border: "1px solid rgba(239,68,68,0.4)", boxShadow: "0 0 40px rgba(239,68,68,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} color="#ef4444" />
                <span className="text-sm font-mono font-bold text-red-400 tracking-widest">WARNING</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed mb-5">This will erase all player progress and lock the game.</p>
              <div className="flex gap-3">
                <button onClick={resetGame} className="flex-1 py-2 rounded-lg text-xs font-mono font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">CONFIRM RESET</button>
                <button onClick={() => setResetConfirm(false)} className="flex-1 py-2 rounded-lg text-xs font-mono text-slate-400 border border-white/10 hover:border-white/20 transition-colors">CANCEL</button>
              </div>
            </div>
          </div>
        )}
{fetchError && (
    <div className="text-red-400 text-xs font-mono mb-4">{fetchError}</div>
)}
{levels.length === 0 && !fetchError && (
    <div className="text-slate-500 text-xs font-mono mb-4">LOADING MISSIONS...</div>
)}

        <div className="flex flex-col gap-3">
          {levels.map((level, i) => (
        <LevelCard key={level.id} level={level} index={i} onChange={updated => updateLevel(i, updated)} onDelete={() => setDeleteConfirm(level.mission_number)} />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={saveAll} className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-mono font-bold tracking-widest" style={{ background: C, color: "#0a1628", boxShadow: `0 0 24px ${CGLOW}` }}>
            <Save size={15} /> SAVE ALL MISSIONS
          </button>
        </div>

        <div className="mt-6 text-center text-[10px] text-slate-600 font-mono">
          SPOTHUNT ADMIN v1.0 — CHANGES SAVED TO LOCALSTORAGE AND REFLECT IMMEDIATELY IN-GAME
        </div>
      </div>

      {createModal && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="rounded-xl p-6 max-w-lg w-full mx-4" style={{ background: "#0d1b2e", border: "1px solid rgba(0,162,206,0.4)", boxShadow: "0 0 40px rgba(0,162,206,0.15)" }}>
            <div className="flex items-center gap-2 mb-5">
                <Zap size={14} color={C} />
                <span className="text-sm font-mono font-bold tracking-widest" style={{ color: C }}>CREATE NEW MISSION</span>
            </div>

            <div className="grid gap-3">
                <div>
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 mb-1 block">MISSION NUMBER</label>
                    <input
                        type="number"
                        value={newRiddle.mission_number}
                        onChange={e => setNewRiddle(v => ({ ...v, mission_number: e.target.value }))}
                        className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 mb-1 block">RIDDLE</label>
                    <textarea
                        value={newRiddle.riddle}
                        onChange={e => setNewRiddle(v => ({ ...v, riddle: e.target.value }))}
                        rows={3}
                        className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 mb-1 block">HINT</label>
                    <input
                        value={newRiddle.tip}
                        onChange={e => setNewRiddle(v => ({ ...v, tip: e.target.value }))}
                        className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 mb-1 block">SECRET CODE</label>
                    <input
                        value={newRiddle.secret_code}
                        onChange={e => setNewRiddle(v => ({ ...v, secret_code: e.target.value.toUpperCase() }))}
                        className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-yellow-400 outline-none"
                        style={{ letterSpacing: "3px" }}
                    />
                </div>
            </div>

            {createError && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-[11px] font-mono">
                    <AlertTriangle size={11} /> {createError}
                </div>
            )}

            <div className="flex gap-3 mt-5">
                <button onClick={createRiddle} disabled={creating}
                    className="flex-1 py-2 rounded-lg text-xs font-mono font-bold tracking-widest transition-all"
                    style={{ background: creating ? "rgba(0,162,206,0.3)" : C, color: "#0a1628", cursor: creating ? "not-allowed" : "pointer" }}>
                    {creating ? "CREATING..." : "CREATE MISSION"}
                </button>
                <button onClick={() => { setCreateModal(false); setCreateError(""); setNewRiddle({ mission_number: "", riddle: "", secret_code: "", tip: "" }); }}
                    className="flex-1 py-2 rounded-lg text-xs font-mono text-slate-400 border border-white/10 hover:border-white/20 transition-colors">
                    CANCEL
                </button>
            </div>
        </div>
    </div>
)}

{deleteConfirm !== null && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="rounded-xl p-6 max-w-sm w-full mx-4" style={{ background: "#0d1b2e", border: "1px solid rgba(239,68,68,0.4)", boxShadow: "0 0 40px rgba(239,68,68,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
                <Trash2 size={16} color="#ef4444" />
                <span className="text-sm font-mono font-bold text-red-400 tracking-widest">DELETE MISSION</span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed mb-5">
                Are you sure you want to delete <span style={{ color: "#ef4444" }}>MISSION {deleteConfirm}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
                <button onClick={deleteRiddle} disabled={deleting}
                    className="flex-1 py-2 rounded-lg text-xs font-mono font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                    {deleting ? "DELETING..." : "CONFIRM DELETE"}
                </button>
                <button onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2 rounded-lg text-xs font-mono text-slate-400 border border-white/10 hover:border-white/20 transition-colors">
                    CANCEL
                </button>
            </div>
        </div>
    </div>
)}

    </div>
  );
}
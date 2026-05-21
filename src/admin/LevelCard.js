import { useState, useEffect } from "react";
import { ChevronRight, Eye, EyeOff, FileText, Zap, Key, Hash, Trash2 } from "lucide-react";

const C = "#00a2ce";
const STATUS_COLORS = ["#f59e0b", "#00a2ce", "#4ade80", "#a78bfa", "#f472b6"];

export default function LevelCard({ level, index, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(index === 0);
  const [showCode, setShowCode] = useState(false);
  const [local, setLocal] = useState(level); // ✅ local copy for editing
  const accent = STATUS_COLORS[index % STATUS_COLORS.length];

  // ✅ sync if parent pushes new data (e.g. socket update)
  useEffect(() => {
    setLocal(level);
  }, [level]);

  const handleBlur = () => {
    onChange(local); // ✅ only notify parent on blur, not every keystroke
  };

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300" style={{ border: `1px solid ${expanded ? accent + "60" : "rgba(0,162,206,0.15)"}`, background: "rgba(10,25,45,0.75)", boxShadow: expanded ? `0 0 30px ${accent}20` : "none" }}>

      <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono" style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>
            {String(local.mission_number).padStart(2, "0")}
          </div>
          <div className="text-left">
            <div className="text-xs font-mono font-bold tracking-widest" style={{ color: accent }}>MISSION {local.mission_number}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 max-w-xs truncate">{local.riddle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <Trash2 size={13} />
          </button>
          <ChevronRight size={14} color="#64748b" style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          <div className="grid gap-4 mt-4">

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest mb-2" style={{ color: C }}>
                <Hash size={10} /> MISSION NUMBER
              </label>
              <input
                type="number"
                value={local.mission_number}
                onChange={e => setLocal(v => ({ ...v, mission_number: parseInt(e.target.value) || 1 }))}
                onBlur={handleBlur} // ✅ sort/re-render only on blur
                className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[rgba(0,162,206,0.5)] transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest mb-2" style={{ color: C }}>
                <FileText size={10} /> RIDDLE / MISSION BRIEFING
              </label>
              <textarea
                value={local.riddle}
                onChange={e => setLocal(v => ({ ...v, riddle: e.target.value }))}
                onBlur={handleBlur}
                rows={3}
                className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[rgba(0,162,206,0.5)] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest mb-2" style={{ color: C }}>
                <Zap size={10} /> OPERATIVE HINT
              </label>
              <input
                value={local.tip}
                onChange={e => setLocal(v => ({ ...v, tip: e.target.value }))}
                onBlur={handleBlur}
                className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[rgba(0,162,206,0.5)] transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest mb-2" style={{ color: "#f59e0b" }}>
                <Key size={10} /> SECRET CODE (ANSWER)
              </label>
              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  value={local.secret_code}
                  onChange={e => setLocal(v => ({ ...v, secret_code: e.target.value.toUpperCase() }))}
                  onBlur={handleBlur}
                  className="w-full bg-black/40 border rounded-lg px-3 py-2 text-xs font-mono text-yellow-400 outline-none pr-10 transition-colors"
                  style={{ borderColor: "rgba(245,158,11,0.4)", letterSpacing: "3px" }}
                />
                <button onClick={() => setShowCode(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400 transition-colors">
                  {showCode ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <div>
    <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest mb-2" style={{ color: C }}>
        <Zap size={10} /> GOOGLE MAP LINK
    </label>
    <input
        value={local.google_map_link || ""}
        onChange={e => setLocal(v => ({ ...v, google_map_link: e.target.value }))}
        onBlur={handleBlur}
        placeholder="https://maps.google.com/..."
        className="w-full bg-black/40 border border-[rgba(0,162,206,0.2)] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 outline-none focus:border-[rgba(0,162,206,0.5)] transition-colors"
    />
</div>
          </div>
        </div>
      )}
    </div>
  );
}
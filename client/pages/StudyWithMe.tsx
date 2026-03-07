import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Play, Pause, RotateCcw, SkipForward,
  Volume2, VolumeX, CheckCircle2, Circle, Plus, X,
  Timer, Target, Flame, Coffee, Moon, Zap, BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "work" | "short-break" | "long-break";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

// ─── Web Audio — generate sounds without any audio files ─────────────────────
function createBeep(
  ctx: AudioContext,
  freq: number,
  duration: number,
  vol = 0.4,
  type: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playWorkEnd(ctx: AudioContext) {
  // Ascending triumphant chord
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => createBeep(ctx, f, 0.5, 0.35), i * 120);
  });
}

function playBreakEnd(ctx: AudioContext) {
  // Gentle descending wake-up
  [784, 659, 523].forEach((f, i) => {
    setTimeout(() => createBeep(ctx, f, 0.4, 0.3), i * 150);
  });
}

function playTick(ctx: AudioContext) {
  createBeep(ctx, 1000, 0.04, 0.08, "square");
}

function playStart(ctx: AudioContext) {
  createBeep(ctx, 440, 0.15, 0.25);
  setTimeout(() => createBeep(ctx, 660, 0.2, 0.25), 150);
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PHASE_DURATIONS: Record<Phase, number> = {
  work: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

const PHASE_CONFIG: Record<Phase, {
  label: string; emoji: string;
  from: string; to: string; glow: string;
  ring1: string; ring2: string;
  bgFrom: string; bgTo: string;
  particle: string;
}> = {
  work: {
    label: "Deep Focus", emoji: "🔥",
    from: "#7c3aed", to: "#4f46e5", glow: "rgba(124,58,237,0.55)",
    ring1: "#a78bfa", ring2: "#818cf8",
    bgFrom: "from-[#0d0a1a]", bgTo: "to-[#0f0d2e]",
    particle: "bg-violet-500",
  },
  "short-break": {
    label: "Short Break", emoji: "☕",
    from: "#059669", to: "#0d9488", glow: "rgba(5,150,105,0.5)",
    ring1: "#34d399", ring2: "#2dd4bf",
    bgFrom: "from-[#030f0a]", bgTo: "to-[#021210]",
    particle: "bg-emerald-500",
  },
  "long-break": {
    label: "Long Break", emoji: "🌙",
    from: "#d97706", to: "#ea580c", glow: "rgba(217,119,6,0.5)",
    ring1: "#fbbf24", ring2: "#fb923c",
    bgFrom: "from-[#110d00]", bgTo: "to-[#120800]",
    particle: "bg-amber-500",
  },
};

const TIPS = [
  "During breaks, look away for 20 seconds to rest your eyes — the 20-20-20 rule.",
  "Keep a water bottle at your desk. Dehydration kills focus faster than distraction.",
  "Write distracting thoughts on paper — don't let them live rent-free in your head.",
  "Silence notifications before each session. Every interruption costs 23 minutes.",
  "Breaks aren't laziness. Memory consolidation happens during rest, not studying.",
  "One topic per Pomodoro. Multitasking cuts efficiency by up to 40%.",
  "Stretch for 2 minutes during breaks. Blood flow equals brain power.",
  "After 4 Pomodoros, earn a 15-minute break. Your brain physically needs it.",
];

const MOTIVATIONAL_QUOTES = [
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
];

// ─── Floating Particle ────────────────────────────────────────────────────────
function Particle({ color, index }: { color: string; index: number }) {
  const s = {
    left: `${(index * 37 + 11) % 100}%`,
    top: `${(index * 53 + 7) % 100}%`,
    width: `${2 + (index % 4)}px`,
    height: `${2 + (index % 4)}px`,
    animationDuration: `${8 + (index % 12)}s`,
    animationDelay: `${(index % 6) * 1.3}s`,
    opacity: 0.1 + (index % 3) * 0.08,
  };
  return <div className={`absolute rounded-full ${color} animate-pulse transition-colors duration-[2000ms]`} style={s} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StudyWithMe() {
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [quoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  const [completedToday, setCompletedToday] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback(
    (fn: (ctx: AudioContext) => void) => {
      if (!soundOn) return;
      try { fn(getAudioCtx()); } catch { /* ignore */ }
    },
    [soundOn, getAudioCtx]
  );

  // Timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // Phase ended
            setRunning(false);
            if (phase === "work") {
              playSound(playWorkEnd);
              setPomodoroCount((c) => {
                const next = c + 1;
                if (next % 4 === 0) {
                  setPhase("long-break");
                  setTimeLeft(PHASE_DURATIONS["long-break"]);
                } else {
                  setPhase("short-break");
                  setTimeLeft(PHASE_DURATIONS["short-break"]);
                }
                return next;
              });
              setCompletedToday((c) => c + 1);
            } else {
              playSound(playBreakEnd);
              setPhase("work");
              setTimeLeft(PHASE_DURATIONS.work);
            }
            return 0;
          }
          if (phase === "work") setTotalFocusSeconds((s) => s + 1);
          // Tick on every minute mark
          if (t % 60 === 0) playSound(playTick);
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, playSound]);

  const handleStartPause = () => {
    if (!running) playSound(playStart);
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setTimeLeft(PHASE_DURATIONS[phase]);
  };

  const handleSkip = () => {
    setRunning(false);
    if (phase === "work") {
      const next = pomodoroCount + 1;
      if (next % 4 === 0) {
        setPhase("long-break");
        setTimeLeft(PHASE_DURATIONS["long-break"]);
      } else {
        setPhase("short-break");
        setTimeLeft(PHASE_DURATIONS["short-break"]);
      }
    } else {
      setPhase("work");
      setTimeLeft(PHASE_DURATIONS.work);
    }
  };

  const handleSwitchPhase = (p: Phase) => {
    setRunning(false);
    setPhase(p);
    setTimeLeft(PHASE_DURATIONS[p]);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((t) => [...t, { id: Date.now(), text: newTask.trim(), done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) =>
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

  const deleteTask = (id: number) =>
    setTasks((t) => t.filter((task) => task.id !== id));

  // ── Display vars ──────────────────────────────────────────
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const progress = ((PHASE_DURATIONS[phase] - timeLeft) / PHASE_DURATIONS[phase]) * 100;
  const focusMins = Math.floor(totalFocusSeconds / 60);
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];
  const cfg = PHASE_CONFIG[phase];

  // SVG ring params
  const R = 130; const CX = 160; const CY = 160; const SIZE = 320;
  const circumference = 2 * Math.PI * R;
  const dash = circumference * (progress / 100);
  const gap = circumference - dash;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${cfg.bgFrom} ${cfg.bgTo} transition-all duration-[2000ms] relative overflow-x-hidden`}>

      {/* ── Ambient background ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} color={cfg.particle} index={i} />
        ))}
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.18] transition-all duration-[3000ms]"
          style={{ background: cfg.from, top: "-10%", left: "-10%" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.13] transition-all duration-[3000ms]"
          style={{ background: cfg.to, bottom: "-5%", right: "-5%" }} />
        {running && (
          <div className="absolute w-[350px] h-[350px] rounded-full blur-[90px] opacity-[0.09] animate-pulse transition-all duration-[2000ms]"
            style={{ background: cfg.from, top: "45%", left: "30%", transform: "translate(-50%,-50%)" }} />
        )}
      </div>

      {/* ── Sticky header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.35)" }}>
        <div className="container px-4 h-14 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white/90">Study With Me</span>
              {running && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                  style={{ background: `${cfg.from}35`, color: cfg.ring1, border: `1px solid ${cfg.from}50` }}>
                  ● LIVE
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-700"
              style={{ background: `${cfg.from}20`, color: cfg.ring1, border: `1px solid ${cfg.from}30` }}>
              {cfg.emoji} {cfg.label}
            </span>
            <button onClick={() => setSoundOn(s => !s)}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/45 hover:text-white/85">
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main layout ────────────────────────────────────────── */}
      <main className="container px-4 max-w-6xl mx-auto py-8 lg:py-12 relative z-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ══════════════════════════════════════════════════════ */}
          {/* LEFT — Timer                                           */}
          {/* ══════════════════════════════════════════════════════ */}
          <div className="space-y-5 flex flex-col items-center">

            {/* Phase selector pills */}
            <div className="flex gap-2 p-1.5 rounded-2xl backdrop-blur-sm w-fit"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {([
                { p: "work" as Phase, icon: Flame, label: "Focus" },
                { p: "short-break" as Phase, icon: Coffee, label: "Break" },
                { p: "long-break" as Phase, icon: Moon, label: "Long" },
              ] as const).map(({ p, icon: Icon, label }) => (
                <button key={p} onClick={() => handleSwitchPhase(p)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-400"
                  style={phase === p ? {
                    background: `linear-gradient(135deg, ${PHASE_CONFIG[p].from}, ${PHASE_CONFIG[p].to})`,
                    color: "#fff",
                    boxShadow: `0 4px 20px ${PHASE_CONFIG[p].glow}`,
                  } : { color: "rgba(255,255,255,0.35)" }}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* ── 3-D Glow Ring Timer ─────────────────────────── */}
            <div className="relative flex flex-col items-center" style={{ perspective: "1000px" }}>
              <div className="relative"
                style={{ width: SIZE, height: SIZE, filter: running ? `drop-shadow(0 0 40px ${cfg.glow})` : undefined, transition: "filter 1s ease" }}>

                {/* Outer pulse when running */}
                {running && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-[0.07]"
                    style={{ background: `radial-gradient(circle, ${cfg.from}, transparent 70%)` }} />
                )}

                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                  <defs>
                    <linearGradient id={`rg-${phase}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={cfg.ring1} />
                      <stop offset="100%" stopColor={cfg.ring2} />
                    </linearGradient>
                    <filter id="glow-f">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Outer decorative ring */}
                  <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="20" />
                  {/* Track ring */}
                  <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />

                  {/* Glow duplicate ring */}
                  <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke={`url(#rg-${phase})`} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${dash} ${gap}`}
                    transform={`rotate(-90 ${CX} ${CY})`}
                    style={{ transition: "stroke-dasharray 1s linear", filter: "url(#glow-f)", opacity: 0.45 }} />

                  {/* Main progress ring */}
                  <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke={`url(#rg-${phase})`} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${dash} ${gap}`}
                    transform={`rotate(-90 ${CX} ${CY})`}
                    style={{ transition: "stroke-dasharray 1s linear" }} />

                  {/* Tip dot */}
                  {progress > 1 && (
                    <circle
                      cx={CX + R * Math.cos(((progress / 100) * 360 - 90) * Math.PI / 180)}
                      cy={CY + R * Math.sin(((progress / 100) * 360 - 90) * Math.PI / 180)}
                      r="7" fill={cfg.ring1} style={{ filter: "url(#glow-f)" }} />
                  )}
                </svg>

                {/* Center overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="absolute w-52 h-52 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.25) 100%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(24px)",
                    }} />
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums"
                      style={{ textShadow: `0 0 50px ${cfg.glow}` }}>
                      {mins}:{secs}
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: cfg.ring1 }}>
                      {cfg.label}
                    </span>
                    {running && (
                      <div className="flex gap-1.5 mt-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: cfg.ring1, animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-5 -mt-6">
                <button onClick={handleReset}
                  className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white/80">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={handleStartPause}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-95 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
                    boxShadow: `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}>
                  {running
                    ? <Pause className="w-7 h-7 fill-white" />
                    : <Play className="w-7 h-7 fill-white ml-1" />}
                </button>
                <button onClick={handleSkip}
                  className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white/80">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Session dots */}
            <div className="flex items-center gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full transition-all duration-500"
                  style={i < pomodoroCount % 4 ? {
                    background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
                    boxShadow: `0 0 10px ${cfg.glow}`,
                    transform: "scale(1.1)",
                  } : { background: "rgba(255,255,255,0.1)" }} />
              ))}
              <span className="text-white/30 text-xs ml-1">{pomodoroCount} sessions today</span>
            </div>

            {/* Stats chips */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {[
                { label: "Pomodoros", value: completedToday, icon: Flame, c: "#f97316" },
                { label: "Focus Min", value: focusMins, icon: Timer, c: cfg.ring1 },
                { label: "Tasks Done", value: tasks.filter(t => t.done).length, icon: Target, c: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center backdrop-blur-sm hover:bg-white/8 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.c }} />
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div className="rounded-2xl p-4 flex gap-3 items-start max-w-md w-full"
              style={{ background: `${cfg.from}10`, border: `1px solid ${cfg.from}22` }}>
              <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cfg.ring1 }} />
              <p className="text-sm text-white/55 leading-relaxed">
                <span className="font-semibold text-white/90">Pro tip: </span>
                {TIPS[tipIndex]}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════ */}
          {/* RIGHT — Sidebar                                        */}
          {/* ══════════════════════════════════════════════════════ */}
          <div className="space-y-4 lg:sticky lg:top-20">

            {/* Tasks */}
            <div className="rounded-2xl p-5 space-y-4 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
                <Target className="w-4 h-4" style={{ color: cfg.ring1 }} />
                Session Tasks
              </h3>
              <div className="flex gap-2">
                <input value={newTask} onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTask()}
                  placeholder="Add a task..." className="flex-1 text-xs rounded-xl px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
                <button onClick={addTask}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` }}>
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              {tasks.length === 0 ? (
                <p className="text-[11px] text-white/20 text-center py-4">Add what you plan to study this session</p>
              ) : (
                <ul className="space-y-2 max-h-52 overflow-y-auto">
                  {tasks.map(task => (
                    <li key={task.id} className="flex items-center gap-2.5 group">
                      <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                        {task.done
                          ? <CheckCircle2 className="w-4 h-4" style={{ color: cfg.ring1 }} />
                          : <Circle className="w-4 h-4 text-white/25" />}
                      </button>
                      <span className={`flex-1 text-xs ${task.done ? "line-through text-white/25" : "text-white/75"}`}>{task.text}</span>
                      <button onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/50 hover:text-red-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quote */}
            <div className="rounded-2xl p-5 space-y-3 relative overflow-hidden backdrop-blur-sm"
              style={{ background: `${cfg.from}0e`, border: `1px solid ${cfg.from}22` }}>
              <div className="absolute -top-2 -left-1 text-5xl opacity-[0.08] select-none" style={{ color: cfg.ring1 }}>"</div>
              <p className="text-sm italic text-white/55 leading-relaxed relative z-10">"{quote.quote}"</p>
              <p className="text-xs font-bold text-right" style={{ color: cfg.ring1 }}>— {quote.author}</p>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl p-5 backdrop-blur-sm space-y-1"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">Quick Links</p>
              {[
                { label: "Mock Tests", href: "/govt-practice", emoji: "📝" },
                { label: "Previous Papers", href: "/prev-year-questions", emoji: "📚" },
                { label: "Current Affairs", href: "/current-affairs", emoji: "📰" },
                { label: "AI Chat", href: "/chatbot", emoji: "🤖" },
              ].map(l => (
                <Link key={l.label} to={l.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all text-white/50 hover:text-white/90 group">
                  <span className="text-base">{l.emoji}</span>
                  <span className="text-xs font-medium">{l.label}</span>
                  <span className="ml-auto text-white/20 group-hover:text-white/50 text-xs transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Science section ──────────────────────────────────── */}
        <section className="mt-16 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">The Science Behind Pomodoro</h2>
            <p className="text-white/35 text-sm max-w-md mx-auto">
              Cognitive neuroscience explains why 25-minute intervals outperform marathon study sessions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "🧠", title: "Prevents Cognitive Fatigue", desc: "The prefrontal cortex tires within 20-30 minutes. Breaks reset neural circuits before they saturate.", stat: "40% better recall" },
              { emoji: "⏱️", title: "Time Pressure = Flow State", desc: "A running timer triggers mild urgency that activates the dorsal attention network without a real stress spike.", stat: "2× task speed" },
              { emoji: "📈", title: "Quantified Progress", desc: "Completed dots trigger dopamine — the same reward loop that makes games addictive, now working for your prep.", stat: "87% more motivated" },
              { emoji: "💧", title: "Memory Consolidation", desc: "During 5-minute breaks, your hippocampus replays what you just learned. Skip breaks, skip consolidation.", stat: "23% better retention" },
              { emoji: "🎯", title: "Single-Task Mastery", desc: "Multitasking costs 15 IQ points (Univ. of London). One topic per Pomodoro eliminates this penalty entirely.", stat: "15 IQ pts recovered" },
              { emoji: "🏆", title: "WBCS Topper Average", desc: "Top-100 rankers averaged 6-8 structured study sessions daily in the final 3 months before results.", stat: "6-8 sessions/day" },
            ].map(c => (
              <div key={c.title} className="rounded-2xl p-5 space-y-3 hover:bg-white/8 transition-all duration-300 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-3xl">{c.emoji}</div>
                <div>
                  <h3 className="text-sm font-bold text-white/90 mb-1.5">{c.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{c.desc}</p>
                </div>
                <div className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${cfg.from}22`, color: cfg.ring1, border: `1px solid ${cfg.from}30` }}>
                  {c.stat}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


    
import { useState, useEffect } from "react";

/**
 * Interactive interview mock UI for the hero section.
 * Shows an AI question, voice waveform animation, and live scoring bars.
 */
export default function HeroAvatar() {
  const [barsState, setBarsState] = useState<number[]>(Array(14).fill(3));
  const [scores, setScores] = useState({ confidence: 0, communication: 0, clarity: 0 });
  const [questionVisible, setQuestionVisible] = useState(false);
  const [waveActive, setWaveActive] = useState(false);
  const [scoresVisible, setScoresVisible] = useState(false);

  // Animate waveform bars randomly
  useEffect(() => {
    if (!waveActive) return;
    const id = setInterval(() => {
      setBarsState(Array(14).fill(0).map(() => Math.random() * 28 + 4));
    }, 120);
    return () => clearInterval(id);
  }, [waveActive]);

  // Staged reveal animation
  useEffect(() => {
    const t1 = setTimeout(() => setQuestionVisible(true), 400);
    const t2 = setTimeout(() => setWaveActive(true), 1200);
    const t3 = setTimeout(() => setScoresVisible(true), 2000);
    const t4 = setTimeout(() => {
      // Animate scores counting up
      const target = { confidence: 85, communication: 72, clarity: 90 };
      const duration = 1000;
      const steps = 25;
      let step = 0;
      const counter = setInterval(() => {
        step++;
        const p = step / steps;
        setScores({
          confidence: Math.round(target.confidence * p),
          communication: Math.round(target.communication * p),
          clarity: Math.round(target.clarity * p),
        });
        if (step >= steps) clearInterval(counter);
      }, duration / steps);
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between gap-4 relative select-none">
      {/* AI Question Bubble */}
      <div
        className={`transition-all duration-500 ${
          questionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-indigo-600">AI Interviewer</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/70 rounded-xl px-4 py-3">
          <p className="text-slate-700 text-sm leading-relaxed font-medium">
            "Tell me about a time you showed leadership in a difficult situation. What was the outcome?"
          </p>
        </div>
      </div>

      {/* User Voice Response Area */}
      <div
        className={`transition-all duration-500 delay-200 ${
          waveActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center gap-2 mb-2 justify-end">
          <span className="text-xs font-semibold text-emerald-600">Your Answer</span>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200/70 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1 h-8 justify-center">
            {barsState.map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-100"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <p className="text-emerald-600 text-[10px] text-center mt-1.5 font-medium">
            🎤 Speaking... 0:12
          </p>
        </div>
      </div>

      {/* Live Scores Panel */}
      <div
        className={`transition-all duration-500 delay-300 ${
          scoresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-white/80 border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Real-time Score
          </p>
          <div className="space-y-2.5">
            {[
              { label: "Confidence", value: scores.confidence, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-100" },
              { label: "Communication", value: scores.communication, color: "from-amber-500 to-orange-500", bg: "bg-amber-100" },
              { label: "Clarity", value: scores.clarity, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-100" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">{s.label}</span>
                  <span className="font-bold text-slate-800 tabular-nums">{s.value}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${s.bg} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-500">
          <span>🌐</span>
          <span>বাংলা + English supported</span>
        </div>
      </div>
    </div>
  );
}

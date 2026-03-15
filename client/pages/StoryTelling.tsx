import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  BookOpen,
  Volume2,
  VolumeX,
  Loader2,
  StopCircle,
  Sparkles,
  Mic,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

// ─── ElevenLabs Bengali TTS ───────────────────────────────────────────────────
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as
  | string
  | undefined;

// "Adam" voice — deep, warm, perfect for storytelling with eleven_multilingual_v2
// Swap this voice ID with a native Bengali ElevenLabs voice from your voice library
// e.g. search "Bengali" in https://elevenlabs.io/voice-library for native speakers
const BENGALI_STORY_VOICE_ID =
  (import.meta.env.VITE_ELEVENLABS_BENGALI_VOICE_ID as string | undefined) ??
  "pNInz6obpgDQGcFmaJgB";

async function speakBengali(text: string): Promise<HTMLAudioElement | null> {
  if (!ELEVENLABS_API_KEY) return null;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${BENGALI_STORY_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0.45,          // expressive storytelling
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`ElevenLabs error: ${res.status}`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.addEventListener("ended", () => URL.revokeObjectURL(url));
  return audio;
}

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "পলাশীর যুদ্ধ",
  "মোগল সাম্রাজ্যের পতন",
  "নেতাজি সুভাষ চন্দ্র বসু",
  "রবীন্দ্রনাথ ঠাকুরের জীবন",
  "বাংলাদেশের মুক্তিযুদ্ধ",
  "সিপাহি বিদ্রোহ ১৮৫৭",
];

// ─── Animated waveform bars ───────────────────────────────────────────────────
function SoundWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-0.5 rounded-full transition-all duration-300"
          style={{
            background: active ? "#a78bfa" : "rgba(167,139,250,0.3)",
            height: active ? `${8 + Math.sin(i * 1.2) * 6}px` : "3px",
            animationDuration: `${0.6 + i * 0.12}s`,
            animation: active ? "bounce 0.6s infinite alternate" : "none",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StoryTelling() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageIdRef = useRef(0);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setSpeaking(false);
  }, [currentAudio]);

  const addMessage = (role: "user" | "assistant", text: string): Message => {
    const msg: Message = {
      id: ++messageIdRef.current,
      role,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const handleSend = useCallback(
    async (text?: string) => {
      const query = (text ?? input).trim();
      if (!query || loading) return;

      stopAudio();
      setInput("");
      setLoading(true);
      addMessage("user", query);

      try {
        const res = await fetch("/api/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: query }),
        });

        const data = (await res.json()) as { story?: string; error?: string };
        const story =
          data.story ?? "দুঃখিত, এই মুহূর্তে গল্পটি পাওয়া যাচ্ছে না।";
        addMessage("assistant", story);

        // Speak via ElevenLabs Bengali TTS
        if (audioEnabled) {
          try {
            const audio = await speakBengali(story);
            if (audio) {
              setCurrentAudio(audio);
              setSpeaking(true);
              audio.play();
              audio.addEventListener("ended", () => {
                setSpeaking(false);
                setCurrentAudio(null);
              });
            }
          } catch (ttsErr) {
            console.warn("ElevenLabs TTS unavailable:", ttsErr);
          }
        }
      } catch (err) {
        addMessage(
          "assistant",
          "দুঃখিত, সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।"
        );
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, loading, audioEnabled, stopAudio]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("bn-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    /* Fixed full-screen container — absolutely no page scroll */
    <div className="fixed inset-0 bg-gradient-to-br from-[#0d0a1a] to-[#0f0d2e] flex flex-col overflow-hidden">
      {/* ── Ambient bg orbs ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.12]"
          style={{ background: "#7c3aed", top: "-15%", left: "-10%" }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.09]"
          style={{ background: "#4f46e5", bottom: "-8%", right: "-5%" }}
        />
        {speaking && (
          <div
            className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.07] animate-pulse"
            style={{
              background: "#a78bfa",
              top: "40%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
        )}
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="relative z-20 flex-shrink-0 border-b border-white/8 backdrop-blur-xl"
        style={{ background: "rgba(0,0,0,0.4)" }}
      >
        <div className="px-4 h-14 flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Link
              to="/study-with-me"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Study With Me</span>
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white/90">
                গল্প বলা
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                BENGALI · AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {speaking && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <SoundWave active />
                <span className="text-[10px] font-bold text-violet-300 animate-pulse">
                  বলছি...
                </span>
              </div>
            )}
            {speaking && (
              <button
                onClick={stopAudio}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-red-400/70 hover:text-red-400"
                title="থামাও"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                if (audioEnabled) stopAudio();
                setAudioEnabled((v) => !v);
              }}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/45 hover:text-white/85"
              title={audioEnabled ? "শব্দ বন্ধ করো" : "শব্দ চালু করো"}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Messages area — scrollable within fixed bounds ──────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center space-y-8 py-8">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed22, #4f46e522)",
                    border: "1px solid rgba(124,58,237,0.25)",
                    boxShadow: "0 0 60px rgba(124,58,237,0.15)",
                  }}
                >
                  📖
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-violet-400 animate-pulse" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-black text-white">
                  AI গল্পকার
                </h1>
                <p className="text-white/45 text-sm max-w-sm leading-relaxed">
                  ইতিহাস, বিজ্ঞান, সংস্কৃতি — যেকোনো বিষয়ে জিজ্ঞেস করো।
                  <br />
                  আমি বাংলায় গল্প বলব, ElevenLabs-এর কণ্ঠে শুনতে পাবে।
                </p>
              </div>

              {/* Suggestions */}
              <div className="space-y-3 w-full max-w-lg">
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
                  কিছু ধারণা
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-4 py-2 rounded-full text-sm font-medium text-violet-300 transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.25)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Assistant avatar */}
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center mr-3 mt-1 text-base"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                  }}
                >
                  📖
                </div>
              )}

              <div
                className={`max-w-[80%] space-y-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}
              >
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          color: "#fff",
                          borderBottomRightRadius: "6px",
                          boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          color: "rgba(255,255,255,0.85)",
                          borderBottomLeftRadius: "6px",
                        }
                  }
                >
                  {msg.role === "assistant" ? (
                    <p className="whitespace-pre-wrap font-[system-ui] text-[15px] leading-[1.8]">
                      {msg.text}
                    </p>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
                <span className="text-[10px] text-white/25 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center ml-3 mt-1"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Mic className="w-4 h-4 text-white/50" />
                </div>
              )}
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center mr-3 text-base"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                }}
              >
                📖
              </div>
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderBottomLeftRadius: "6px",
                }}
              >
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="text-sm text-white/40">গল্প তৈরি হচ্ছে...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Input bar — always at bottom ────────────────────────────── */}
      <footer
        className="relative z-20 flex-shrink-0 border-t border-white/8 backdrop-blur-xl"
        style={{ background: "rgba(0,0,0,0.45)" }}
      >
        <div className="max-w-4xl mx-auto w-full px-4 py-3">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="আমাকে একটি গল্প বলো... (যেমন: পলাশীর যুদ্ধ, রবীন্দ্রনাথের জীবন)"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none leading-relaxed"
              style={{ maxHeight: "120px", minHeight: "24px" }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background:
                  input.trim() && !loading
                    ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                    : "rgba(255,255,255,0.07)",
                boxShadow:
                  input.trim() && !loading
                    ? "0 4px 20px rgba(124,58,237,0.4)"
                    : "none",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white/70 animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <p className="text-[10px] text-white/20 text-center mt-2">
            Enter পাঠালে গল্প শুরু হবে · Shift+Enter নতুন লাইন ·{" "}
            {audioEnabled ? (
              <span className="text-violet-400/60">🔊 Bengali TTS চালু</span>
            ) : (
              <span>🔇 TTS বন্ধ — হেডারে চালু করো</span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}

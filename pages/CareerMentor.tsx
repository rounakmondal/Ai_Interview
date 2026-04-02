import { useState, useRef, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    Send,
    Loader2,
    Bot,
    User,
    Lightbulb,
    MapPin,
    IndianRupee,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Sparkles,
    RefreshCw,
} from "lucide-react";
import { CareerMentorResponse, CareerIntent, RoadmapData } from "@shared/api";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
    response?: CareerMentorResponse & {
        closing?: string;
        meta?: { detectedIntent: CareerIntent };
    };
    loading?: boolean;
}

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const INTENT_META: Record<
    CareerIntent,
    { label: string; color: string; emoji: string }
> = {
    no_job: { label: "Job Hunt", color: "bg-rose-500/15 text-rose-400 border-rose-500/30", emoji: "🔍" },
    layoff_fear: { label: "Layoff Fear", color: "bg-orange-500/15 text-orange-400 border-orange-500/30", emoji: "🛡️" },
    ai_impact: { label: "AI & Jobs", color: "bg-violet-500/15 text-violet-400 border-violet-500/30", emoji: "🤖" },
    career_gap: { label: "Career Gap", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", emoji: "📅" },
    low_salary: { label: "Salary Growth", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", emoji: "💰" },
    tech_confusion: { label: "Tech Choice", color: "bg-sky-500/15 text-sky-400 border-sky-500/30", emoji: "⚙️" },
    non_it_switch: { label: "IT Switch", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30", emoji: "🔀" },
    skill_roadmap: { label: "Skill Roadmap", color: "bg-teal-500/15 text-teal-400 border-teal-500/30", emoji: "🗺️" },
    general: { label: "Career Guide", color: "bg-primary/15 text-primary border-primary/30", emoji: "💡" },
};

const QUICK_PROMPTS = [
    "I'm a fresher and not getting any job calls 😔",
    "Should I learn Java or Python for better salary?",
    "I have a 2-year career gap. How do I explain it?",
    "Will AI replace software developers in India?",
    "I want to switch from mechanical to IT. Help!",
    "I'm stuck at 4 LPA in TCS for 3 years. How to grow?",
];

// ─────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────

function IntentBadge({ intent }: { intent: CareerIntent }) {
    const meta = INTENT_META[intent] ?? INTENT_META.general;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.color}`}
        >
            <span>{meta.emoji}</span>
            {meta.label}
        </span>
    );
}

function RoadmapCard({ roadmap }: { roadmap: RoadmapData }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                aria-expanded={open}
            >
                <div className="flex items-center gap-2 font-semibold text-sm text-primary">
                    <MapPin className="w-4 h-4" />
                    {roadmap.title}
                </div>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 space-y-4">
                    {roadmap.weeks.map((w, i) => (
                        <div key={i}>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                {w.week}
                            </p>
                            <ul className="space-y-1.5">
                                {w.tasks.map((t, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        <span className="text-foreground/85">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MentorResponse({
    response,
}: {
    response: ChatMessage["response"];
}) {
    if (!response) return null;
    const { intent, summary, advice, roadmap, salaryExpectation, resources } =
        response;

    return (
        <div className="space-y-4 mt-3">
            {/* Intent badge */}
            {intent && <IntentBadge intent={intent} />}

            {/* Summary */}
            <p className="text-sm text-foreground/90 leading-relaxed">{summary}</p>

            {/* Advice list */}
            {advice && advice.length > 0 && (
                <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Action Steps
                    </p>
                    <ul className="space-y-2">
                        {advice.map((a, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                            >
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-foreground/85">{a}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Roadmap */}
            {roadmap && <RoadmapCard roadmap={roadmap} />}

            {/* Salary */}
            {salaryExpectation && (
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                    <IndianRupee className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-300/90">{salaryExpectation}</p>
                </div>
            )}

            {/* Resources */}
            {resources && resources.length > 0 && (
                <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        Resources
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {resources.map((r, i) => (
                            <span
                                key={i}
                                className="inline-block text-xs px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                            >
                                {r}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Closing CTA */}
            {response.closing && (
                <p className="text-xs italic text-muted-foreground border-t border-border/40 pt-3 mt-2">
                    💬 {response.closing}
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────

export default function CareerMentorPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            text: "👋 Hi! I'm your **AI Career Mentor** — specialized in the Indian IT job market.\n\nI can help you with job search, salary growth, career gaps, tech confusion, layoff fears, and switching to IT.\n\nWhat's your situation? Ask me anything! 🚀",
            response: undefined,
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }, [input]);

    async function sendMessage(text: string) {
        if (!text.trim() || loading) return;
        const userMsg: ChatMessage = { role: "user", text: text.trim() };
        const loadingMsg: ChatMessage = {
            role: "assistant",
            text: "",
            loading: true,
        };

        setMessages((prev) => [...prev, userMsg, loadingMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/career-mentor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text.trim() }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            const assistantMsg: ChatMessage = {
                role: "assistant",
                text: data.summary || "Here's my advice for your situation.",
                response: data,
            };

            setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
        } catch (err) {
            console.error("Career mentor API error:", err);
            const errMsg: ChatMessage = {
                role: "assistant",
                text: "⚠️ Unable to reach the career mentor server. Please make sure the backend is running at `http://localhost:8000` and try again.",
            };
            setMessages((prev) => [...prev.slice(0, -1), errMsg]);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        sendMessage(input);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    }

    function clearChat() {
        setMessages([
            {
                role: "assistant",
                text: "👋 Hi! I'm your **AI Career Mentor**. What career challenge can I help you with today?",
                response: undefined,
            },
        ]);
    }

    // Render markdown-lite bold
    function renderText(text: string) {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
                <span key={i}>{part}</span>
            ),
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* ─── Navbar ─── */}
            <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Back">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-sm leading-tight">AI Career Mentor</p>
                                <p className="text-[11px] text-muted-foreground leading-tight">
                                    Indian IT Market · Powered by Groq
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Live indicator */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-emerald-400 font-medium">Live</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            onClick={clearChat}
                            title="Clear chat"
                            aria-label="Clear chat"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* ─── Chat Container ─── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

                    {/* Quick prompts — show only at start */}
                    {messages.length === 1 && (
                        <div className="space-y-3 animate-fade-in">
                            <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wider">
                                Common questions
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {QUICK_PROMPTS.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => sendMessage(p)}
                                        className="text-left text-sm px-4 py-3 rounded-xl border border-border/50 bg-card/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-foreground/80 hover:text-foreground"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 animate-slide-up ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${msg.role === "user"
                                        ? "bg-gradient-to-br from-primary to-secondary"
                                        : "bg-gradient-to-br from-secondary/80 to-primary/80"
                                    }`}
                            >
                                {msg.role === "user" ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`max-w-[85%] sm:max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"
                                    } flex flex-col`}
                            >
                                <Card
                                    className={`px-4 py-3 rounded-2xl border ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                                            : "bg-card border-border/50 rounded-tl-sm"
                                        }`}
                                >
                                    {msg.loading ? (
                                        <div className="flex items-center gap-2 py-1">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Thinking…
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm leading-relaxed whitespace-pre-line">
                                                {renderText(msg.text)}
                                            </p>
                                            {msg.response && (
                                                <MentorResponse response={msg.response} />
                                            )}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* ─── Input Bar ─── */}
            <div className="sticky bottom-0 border-t border-border/40 bg-background/95 backdrop-blur">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto px-4 py-4 flex items-end gap-3"
                >
                    <textarea
                        id="career-mentor-input"
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your career situation… (e.g. 'I'm a fresher not getting any job calls')"
                        rows={1}
                        disabled={loading}
                        className="flex-1 resize-none rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 disabled:opacity-50 transition-all min-h-[48px] max-h-[140px]"
                    />
                    <Button
                        id="career-mentor-send"
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="flex-shrink-0 rounded-2xl w-12 h-12 p-0 bg-gradient-to-br from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-40"
                        aria-label="Send message"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </form>
                <p className="text-center text-[11px] text-muted-foreground/50 pb-3">
                    Specialized for Indian IT job market • Powered by Groq LLM
                </p>
            </div>
        </div>
    );
}

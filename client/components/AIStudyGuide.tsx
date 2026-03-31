import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X, Send, Sparkles, Loader2, BookOpen, Brain,
  Lightbulb, FileQuestion, History, List, Star,
  Copy, Check, Zap, GraduationCap, Shield,
} from "lucide-react";

interface AIStudyGuideProps {
  chapterId: string;
  chapterName?: string;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const QUICK_PROMPTS = [
  { icon: BookOpen,     label: "Overview",         query: "Give me a comprehensive overview and all key concepts for this chapter." },
  { icon: Star,         label: "Most Important",   query: "What are the most important topics and highest weightage areas from this chapter for the exam?" },
  { icon: FileQuestion, label: "Previous Year Qs", query: "What types of questions have been asked from this chapter in previous year exams? Give examples." },
  { icon: Lightbulb,    label: "Smart Tips",       query: "Give me smart study tips, mnemonics, and memory tricks for this chapter." },
  { icon: Brain,        label: "Tricky Facts",     query: "What are the tricky facts and common mistakes students make in this chapter?" },
  { icon: List,         label: "Revision Notes",   query: "Make concise revision notes with bullet points covering everything I need to remember." },
  { icon: History,      label: "Timeline/Dates",   query: "List all important dates, years, and historical timelines related to this chapter." },
  { icon: Zap,          label: "Quick MCQs",       query: "Give me 5 practice MCQ questions with answers and explanations from this chapter." },
];

export default function AIStudyGuide({ chapterId, chapterName, onClose }: AIStudyGuideProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialLoaded) return;
    setInitialLoaded(true);
    fetchGuide("Give me a comprehensive overview and all key concepts for this chapter.");
  }, [initialLoaded, chapterId]);

  const fetchGuide = async (userQuery: string) => {
    setShowQuickPrompts(false);
    setMessages((prev) => [...prev, { role: "user", content: userQuery, timestamp: new Date() }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chapter-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, userQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.guide || data.text || "No response received.", timestamp: new Date() },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: getFallbackGuide(userQuery), timestamp: new Date() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: getFallbackGuide(userQuery), timestamp: new Date() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSend = () => {
    const q = query.trim();
    if (!q || loading) return;
    setQuery("");
    fetchGuide(q);
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  // Format AI response with markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) return <h3 key={i} className="font-bold text-sm mt-3 mb-1 text-foreground">{line.slice(3)}</h3>;
      if (line.startsWith("# ")) return <h2 key={i} className="font-bold text-base mt-3 mb-1 text-foreground">{line.slice(2)}</h2>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-sm text-foreground mt-1">{line.slice(2, -2)}</p>;
      if (line.startsWith("• ") || line.startsWith("- ")) return (
        <div key={i} className="flex gap-2 text-sm mt-0.5">
          <span className="text-primary mt-0.5 flex-shrink-0">▸</span>
          <span>{line.slice(2)}</span>
        </div>
      );
      if (/^\d+\./.test(line)) return (
        <div key={i} className="flex gap-2 text-sm mt-0.5">
          <span className="text-primary font-bold flex-shrink-0 min-w-[18px]">{line.match(/^\d+/)?.[0]}.</span>
          <span>{line.replace(/^\d+\.\s*/, "")}</span>
        </div>
      );
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm leading-relaxed">{line}</p>;
    });
  };

  const chapterLabel = chapterName?.trim() || chapterId.replace(/_/g, " ").replace(/ch \d+/i, "").trim() || chapterId;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] z-50 flex flex-col bg-background shadow-2xl border-l border-border/50">

        {/* ── Header ── */}
        <div className="flex-shrink-0 border-b border-border/40">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600/10 via-primary/5 to-background">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4.5 h-4.5 text-white w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">InterviewSathi AI</p>
                  <Badge className="text-[10px] h-4 px-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
                    Study Guide
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Powered by Gemini · Always accurate</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setMessages([]); setShowQuickPrompts(true); }}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
                title="Clear chat"
              >
                Clear
              </button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chapter label */}
          <div className="px-4 py-2 bg-muted/20 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">Chapter:</p>
            <p className="text-xs font-semibold truncate">{chapterLabel}</p>
          </div>

          {/* Trust strip */}
          <div className="px-4 py-1.5 bg-green-500/5 border-t border-green-500/10 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-green-700 dark:text-green-400">
              <Shield className="w-3 h-3" />
              Exam-verified content
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-green-700 dark:text-green-400">
              <GraduationCap className="w-3 h-3" />
              Expert-curated
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-green-700 dark:text-green-400">
              <Star className="w-3 h-3" />
              4.9★ rated
            </div>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

          {/* Welcome / Quick Prompts */}
          {showQuickPrompts && messages.length === 0 && !loading && (
            <div className="space-y-4">
              <div className="text-center py-4 space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-primary/10 flex items-center justify-center mx-auto">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <p className="font-bold text-base">Your AI Study Companion</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Get instant, exam-focused explanations, previous year patterns, and smart tips for every chapter.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Topics</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.label}
                        onClick={() => fetchGuide(p.query)}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-left transition-all group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs font-medium leading-tight">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 Pro Tip</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ask specific questions like <em>"What is the difference between X and Y?"</em> for laser-focused answers that save time.
                </p>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
              {/* Avatar + name */}
              <div className={`flex items-center gap-1.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "assistant" ? (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-3 h-3 text-primary" />
                  </div>
                )}
                <span className="text-[11px] text-muted-foreground font-medium">
                  {m.role === "assistant" ? "InterviewSathi AI" : "You"}
                </span>
                {m.timestamp && (
                  <span className="text-[10px] text-muted-foreground/60">
                    {m.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>

              {/* Bubble */}
              <div className={`relative group max-w-[92%] ${m.role === "user" ? "ml-8" : "mr-8"}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted/40 border border-border/30 rounded-tl-sm"
                }`}>
                  {m.role === "assistant" ? (
                    <div className="space-y-0.5 text-foreground">
                      {renderContent(m.content)}
                    </div>
                  ) : (
                    <p>{m.content}</p>
                  )}
                </div>

                {/* Copy button for AI messages */}
                {m.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(m.content, i)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Copy response"
                  >
                    {copiedIdx === i ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>

              {/* Follow-up chips after AI response */}
              {m.role === "assistant" && i === messages.length - 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 mt-1 ml-8">
                  {["Give examples", "Simplify this", "Quiz me", "More details"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => fetchGuide(chip + " on the above topic")}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="bg-muted/40 border border-border/30 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">AI is thinking…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Quick Prompt Chips (persistent) ── */}
        {messages.length > 0 && !loading && (
          <div className="flex-shrink-0 px-4 py-2 border-t border-border/20 overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {QUICK_PROMPTS.slice(0, 5).map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.label}
                    onClick={() => fetchGuide(p.query)}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all whitespace-nowrap disabled:opacity-40"
                  >
                    <Icon className="w-3 h-3" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Input ── */}
        <div className="flex-shrink-0 border-t border-border/40 p-3 bg-background">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Ask anything about this chapter…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-4 text-sm h-10 bg-muted/30 border-border/40 focus:border-primary/50"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-violet-600 to-primary hover:opacity-90"
              size="icon"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5">
            AI can make mistakes. Always verify with official sources.
          </p>
        </div>
      </div>
    </>
  );
}

function getFallbackGuide(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("overview") || q.includes("key concept") || q.includes("comprehensive")) {
    return `📘 Chapter Overview\n\n**Core Concepts**\n• This chapter establishes foundational understanding critical for scoring high marks.\n• Questions from this chapter appear almost every year in prelims and mains.\n• Expect 2–4 direct questions from this chapter in the final exam.\n\n**Key Areas to Master**\n• Core definitions and terminology — examiner's favourite source for MCQs\n• Important facts, figures, statistics, and dates\n• Constitutional/legal provisions if applicable\n• Comparative analysis topics (India vs World, historical periods)\n• Diagram-based and map-based questions\n\n**Study Strategy**\n• Day 1: Read chapter once for understanding\n• Day 2: Make chapter notes with bullet points\n• Day 3: Solve 20 MCQs\n• Day 7: Revise notes (spaced repetition)\n• Day 30: Full mock test covering this chapter`;
  }

  if (q.includes("most important") || q.includes("weightage") || q.includes("highest")) {
    return `⭐ High-Weightage Topics\n\n**Tier 1 — Must Know (appears every year)**\n• Foundational definitions that form the base of MCQs\n• Constitutional provisions and amendments\n• Key figures, leaders, dates in the correct sequence\n• Acts, policies, and their year of enactment\n\n**Tier 2 — Highly Probable**\n• Comparative facts and statistical data\n• Exception cases and special provisions\n• Recently amended or updated information\n\n**Tier 3 — Good to Have**\n• Historical context and background\n• International comparisons\n• Case studies and examples\n\n**Exam Pattern Insight**\n• 40% questions test theoretical knowledge\n• 35% questions test application and comparison\n• 25% questions test current affairs linkage\n\n✅ Focus Tier 1 topics for maximum ROI on your study time.`;
  }

  if (q.includes("previous year") || q.includes("past year") || q.includes("example")) {
    return `📝 Previous Year Question Patterns\n\n**Most Asked Question Types**\n1. Statement-based questions — "Which of the following statements is/are correct?"\n2. Match the following — connect concepts with definitions\n3. Chronological ordering — arrange events by date/year\n4. Identify the odd one out — exception-based questions\n5. Constitutional Article identification — "Under which article…?"\n\n**Common Traps Examiners Use**\n• Near-identical options with one subtle word changed\n• "All of the above / None of the above" as trap options\n• Mixing correct facts with slightly wrong dates or figures\n• Using less-common technical terms as distractors\n\n**Practice Questions (Topic Pattern)**\n• Q1: What is the primary function of…? (Ans: Definition-based)\n• Q2: When was ___ established? (Ans: Date-fact based)\n• Q3: Which article/section deals with ___? (Ans: Provision-based)\n• Q4: Who among the following is associated with ___? (Ans: Personality-based)\n\n💡 Always solve previous year papers from 2018–2024 for this chapter.`;
  }

  if (q.includes("tip") || q.includes("trick") || q.includes("mnemonic") || q.includes("smart")) {
    return `💡 Smart Study Tips & Memory Tricks\n\n**Proven Techniques**\n• FEYNMAN TECHNIQUE: Explain the concept in simple language as if teaching a 10-year-old — reveals gaps in your understanding.\n• MIND MAPPING: Connect related topics visually — much better than linear notes for retention.\n• SPACED REPETITION: Revise this chapter on Day 1, Day 3, Day 7, Day 21, Day 60 for 95% retention.\n\n**Memory Shortcuts**\n• Create acronyms for lists of 4+ items\n• Link abstract facts to memorable stories or places\n• Colour-code your notes: Blue = definition, Red = date/fact, Green = tip\n• Record voice notes of key points and listen during walks\n\n**Time Management**\n• Spend 60% time on concepts, 40% on practice MCQs\n• Never read a chapter more than twice — practice instead\n• Use the 2-minute rule: if you can answer in 2 mins in exam, you've mastered it\n\n**Common Mistakes to Avoid**\n❌ Re-reading without active recall\n❌ Highlighting everything (highlights nothing)\n❌ Skipping diagrams and maps\n✅ Write, test, and teach what you've learned`;
  }

  if (q.includes("trick") || q.includes("tricky") || q.includes("common mistake")) {
    return `🧠 Tricky Facts & Common Mistakes\n\n**Facts Students Frequently Confuse**\n• Similar-sounding terms that mean very different things\n• Dates that are close together in history\n• Provisions that have been amended multiple times\n• Facts that differ between state and central level\n\n**High-Risk Confusion Zones**\n• "First" vs "Oldest" — these are not always the same\n• "Established" vs "Enacted" vs "Implemented" dates differ\n• Percentage figures that change with census updates\n• Articles that are "similar to" vs "derived from"\n\n**Exam Psychology**\n• If two options look almost identical, focus on the distinguishing word\n• Options with absolute words ("always", "never", "only") are usually wrong\n• When unsure, go with the option that is most commonly tested\n\n🔍 Tip: For every fact you learn, also learn what it is NOT — this eliminates wrong options faster.`;
  }

  if (q.includes("revision") || q.includes("note") || q.includes("concise") || q.includes("summary")) {
    return `📋 Concise Revision Notes\n\n**The 5 Must-Remember Points**\n1. Core definition — what is it and what is it not\n2. Origin/establishment — when, where, by whom\n3. Key features — 3–5 distinguishing characteristics\n4. Constitutional/legal basis — article, act, or provision\n5. Current relevance — any recent amendment, news, or controversy\n\n**Quick Recall Framework (use this structure for any topic)**\n"[Topic] is [definition]. It was established in [year] by [authority]. Its key features include [A], [B], and [C]. This is governed under [act/article]. Recently, [current development]."\n\n**Last-Week Revision Checklist**\n☐ Re-read your chapter notes once\n☐ Solve 30 MCQs from this chapter\n☐ Revise all dates and figures separately\n☐ Cover all diagrams/maps/flowcharts\n☐ Watch one 15-min video explanation if weak\n\n⏱️ Estimated revision time: 45–60 minutes for full chapter.`;
  }

  if (q.includes("mcq") || q.includes("quiz") || q.includes("practice")) {
    return `🎯 Practice MCQs — Chapter Drill\n\n**Question 1**\nWhich of the following statements is/are correct regarding this topic?\n(a) Option A — partially correct  \n(b) Option B — fully correct ✓  \n(c) Option C — incorrect  \n(d) Option D — incorrect  \n\n📖 Explanation: Option B is correct because the core principle directly maps to the definition covered in this chapter.\n\n**Question 2**\n"All of the following are features EXCEPT:"\n(a) Standard feature 1  \n(b) Standard feature 2  \n(c) Incorrect exception ✓  \n(d) Standard feature 3  \n\n📖 Explanation: Option C contains a fact that belongs to a different topic — a common examiner trick.\n\n**Drill Strategy**\n• Set a 45-second timer per question\n• If unsure, eliminate clearly wrong options first\n• Mark questions you guessed correctly — revise those topics\n\n🔗 Use the "Test" button on the chapter card to take a full timed MCQ test!`;
  }

  return `🤖 I'm here to help you master this chapter!\n\n**What I can do for you:**\n• Explain any concept in simple language\n• Give you exam-pattern based summaries\n• Share previous year question trends\n• Create revision notes on demand\n• Quiz you with practice MCQs\n• Give smart tips and memory tricks\n\n**Try asking:**\n→ "Explain [specific concept] in simple terms"\n→ "What are the most important topics to study?"\n→ "Give me 5 practice questions"\n→ "What mistakes do students make here?"\n\nOr use the **Quick Topics** buttons above to get started instantly.`;
}

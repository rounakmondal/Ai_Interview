import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  ImagePlus,
  X,
  Bot,
  User,
  Loader2,
  Sparkles,
  BookOpen,
  Calculator,
  Globe,
  Landmark,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  image?: string; // base64 dataURL
  timestamp: Date;
}

// ─── Mock AI response engine (frontend-only for now) ─────────────────────────
const RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["plassey", "palashi", "1757", "pলাশী"],
    answer:
      "**Battle of Plassey (1757)**\n\nFought on **23 June 1757** between the British East India Company (led by Robert Clive) and Siraj ud-Daulah, the Nawab of Bengal.\n\n**Key points:**\n- British won due to betrayal by Mir Jafar\n- Marked the beginning of British rule in India\n- Located near Nadia district, West Bengal\n\n*বাংলা:* পলাশীর যুদ্ধ ১৭৫৭ সালে রবার্ট ক্লাইভ ও সিরাজউদ্দৌলার মধ্যে হয়। মীর জাফরের বিশ্বাসঘাতকতায় ব্রিটিশরা জয়ী হয়।",
  },
  {
    keywords: ["preamble", "প্রস্তাবনা", "constitution", "সংবিধান"],
    answer:
      "**Preamble of the Indian Constitution**\n\nThe Preamble declares India to be a **Sovereign, Socialist, Secular, Democratic Republic** that secures to all its citizens:\n- Justice (social, economic, political)\n- Liberty (of thought, expression, belief)\n- Equality (of status and opportunity)\n- Fraternity (assuring the dignity of the individual)\n\n📌 'Socialist' and 'Secular' were added by the **42nd Amendment (1976)**.",
  },
  {
    keywords: ["damodar", "দামোদর", "river", "নদী", "sorrow of bengal"],
    answer:
      "**Damodar River — 'Sorrow of Bengal'**\n\n- Originates in **Jharkhand** (Chota Nagpur Plateau)\n- Flows through **Jharkhand & West Bengal**\n- Known as 'Sorrow of Bengal' due to devastating floods\n- **Damodar Valley Corporation (DVC)** established in 1948 for flood control\n- Joins Hugli River near Calcutta\n\n📌 Frequently asked in **WBCS Geography**.",
  },
  {
    keywords: ["rajya sabha", "রাজ্যসভা", "parliament", "সংসদ", "lok sabha"],
    answer:
      "**Indian Parliament — Quick Facts**\n\n| House | Seats | Term |\n|---|---|---|\n| Lok Sabha | 543 elected + 2 nominated | 5 years |\n| Rajya Sabha | 238 + 12 nominated = 250 max | Permanent (6yr rotation) |\n\n📌 Current Rajya Sabha strength: **245 members**\n📌 Minimum age: Lok Sabha = 25 yrs, Rajya Sabha = 30 yrs",
  },
  {
    keywords: ["chandrayaan", "isro", "moon", "চন্দ্রযান", "space", "মহাকাশ"],
    answer:
      "**Chandrayaan-3 (2023)**\n\n- Launched: **14 July 2023** by ISRO\n- Landing: **23 August 2023** near lunar south pole\n- India became the **1st country** to land near the lunar south pole\n- Rover: **Pragyan**, Lander: **Vikram**\n\n📌 Important for **Current Affairs** in WBCS, SSC, Banking exams.",
  },
  {
    keywords: ["simple interest", "compound interest", "সুদ", "interest", "math", "গণিত"],
    answer:
      "**Simple vs Compound Interest**\n\n**Simple Interest (SI):**\n`SI = (P × R × T) / 100`\n\n**Compound Interest (CI):**\n`A = P × (1 + R/100)ⁿ`\n`CI = A - P`\n\n**Example:** P = ₹5000, R = 10%, T = 2 years\n- SI = (5000 × 10 × 2)/100 = **₹1000**\n- CI = 5000 × (1.1)² - 5000 = **₹1050**\n\n📌 CI > SI for same P, R, T (T > 1 year)",
  },
  {
    keywords: ["train", "speed", "distance", "platform", "ট্রেন", "গতি"],
    answer:
      "**Train Problems — Key Formulas**\n\n1. **Crossing a pole/person:**\n   `Time = Train Length / Speed`\n\n2. **Crossing a platform:**\n   `Time = (Train + Platform Length) / Speed`\n\n3. **Two trains (same direction):**\n   `Time = (L1 + L2) / (S1 - S2)`\n\n4. **Two trains (opposite direction):**\n   `Time = (L1 + L2) / (S1 + S2)`\n\n📌 Convert speed: km/h × 5/18 = m/s",
  },
  {
    keywords: ["sundarbans", "সুন্দরবন", "mangrove", "tiger", "বাঘ", "unesco"],
    answer:
      "**Sundarbans — Key Facts**\n\n- World's largest **mangrove forest**\n- Shared between **India (West Bengal)** and **Bangladesh**\n- Home to **Royal Bengal Tiger**\n- **UNESCO World Heritage Site** (1987)\n- Located in the **Ganges-Brahmaputra delta**\n- India's Sundarban area: ~4,262 sq km\n\n📌 Highly relevant for **WBCS Geography** questions.",
  },
  {
    keywords: ["pomodoro", "study", "technique", "focus", "পড়াশোনা"],
    answer:
      "**Pomodoro Technique for Study** 🍅\n\n1. Choose a task to study\n2. Set timer for **25 minutes** (1 Pomodoro)\n3. Work with full focus — no distractions\n4. Take a **5-minute break**\n5. After **4 Pomodoros**, take a **15-minute long break**\n\n**Benefits:**\n- Reduces mental fatigue\n- Improves focus\n- Helps beat procrastination\n\n💡 Try the **Study With Me** section for a built-in Pomodoro timer with sound alerts!",
  },
];

function getMockResponse(input: string, hasImage: boolean): string {
  if (hasImage) {
    return "I can see you've uploaded an image! 📸\n\nI'm analyzing it... Based on what appears to be an exam question, here are the steps to solve it:\n\n1. **Identify** the key information given\n2. **Choose** the right formula or concept\n3. **Apply** step-by-step\n4. **Verify** your answer\n\n💡 *For best results, type the question text along with the image so I can give you a precise explanation.*";
  }

  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.answer;
  }

  // Generic response
  return `Great question! Here's what I know about **"${input.slice(0, 40)}..."**\n\nThis topic is commonly tested in WBCS, SSC, Banking, and Railway exams. Let me break it down:\n\n1. Start with the **core concept** — understanding the fundamentals is key\n2. Look for **keywords** in options that connect to the concept\n3. Use **elimination** to narrow down choices\n\n💡 *Tip: Try asking about specific topics like "Damodar River", "Article 370", "Compound Interest", "Chandrayaan", or "Battle of Plassey" for detailed answers!*`;
}

function formatMessage(text: string) {
  // Very simple markdown-like rendering
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-bold text-foreground">
            {line.slice(2, -2)}
          </p>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4 list-disc text-sm">
            {renderInline(line.slice(2))}
          </li>
        );
      }
      if (line.startsWith("📌") || line.startsWith("💡") || line.startsWith("📸")) {
        return (
          <p key={i} className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            {line}
          </p>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-1" />;
      return (
        <p key={i} className="text-sm leading-relaxed">
          {renderInline(line)}
        </p>
      );
    });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="bg-muted px-1 rounded text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

// ─── Suggested questions ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: Landmark, label: "Battle of Plassey", q: "Explain the Battle of Plassey 1757" },
  { icon: Globe, label: "Sundarbans", q: "Tell me about Sundarbans" },
  { icon: Calculator, label: "Compound Interest", q: "Explain compound interest formula with example" },
  { icon: BookOpen, label: "Rajya Sabha", q: "How many members in Rajya Sabha?" },
  { icon: Zap, label: "Chandrayaan-3", q: "What is Chandrayaan-3?" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "নমস্কার! 👋 I'm your AI Study Assistant for Government Exam preparation.\n\nAsk me anything about **History, Geography, Polity, Math, Reasoning, or Current Affairs**. You can also **upload an image** of a question and I'll help you solve it!\n\n💡 Try one of the suggestions below to get started.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !image) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text || "(Image uploaded)",
      image: image ?? undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImage(null);
    setImageName("");
    setLoading(true);

    // Simulate API latency
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const reply = getMockResponse(text, !!userMsg.image);
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: reply,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    textRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur flex-shrink-0">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">AI Study Assistant</span>
            <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20 text-xs">
              Online
            </Badge>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container px-4 max-w-3xl mx-auto py-6 space-y-4">
          {/* Suggestion chips — only when 1 message (welcome) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestion(s.q)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 hover:bg-muted text-xs font-medium transition-colors"
                >
                  <s.icon className="w-3 h-3 text-primary" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1 ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                    : "bg-gradient-to-br from-amber-500 to-orange-500"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] space-y-2 ${
                  msg.role === "user" ? "items-end" : "items-start"
                } flex flex-col`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="uploaded"
                    className="rounded-xl max-h-56 object-contain border border-border/40"
                  />
                )}
                <Card
                  className={`px-4 py-3 rounded-2xl border-0 shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/60 rounded-tl-sm"
                  }`}
                >
                  <div className="space-y-0.5">
                    {msg.role === "assistant"
                      ? formatMessage(msg.text)
                      : <p className="text-sm">{msg.text}</p>}
                  </div>
                </Card>
                <span className="text-[10px] text-muted-foreground px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="px-4 py-3 bg-muted/60 rounded-2xl rounded-tl-sm border-0">
                <div className="flex gap-1 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border/40 bg-background/95 backdrop-blur sticky bottom-0 flex-shrink-0">
        {/* Image preview */}
        {image && (
          <div className="container px-4 max-w-3xl mx-auto pt-3">
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-fit">
              <img src={image} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xs text-muted-foreground max-w-[150px] truncate">{imageName}</span>
              <button onClick={() => { setImage(null); setImageName(""); }}>
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
        )}

        <div className="container px-4 max-w-3xl mx-auto py-3">
          <div className="flex gap-2 items-end">
            {/* Image upload */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0 h-11 w-11 rounded-xl"
              onClick={() => fileRef.current?.click()}
              title="Upload image"
            >
              <ImagePlus className="w-4 h-4" />
            </Button>

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about History, Polity, Math, Current Affairs... (Enter to send)"
                rows={1}
                className="w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px] max-h-32 overflow-auto"
                style={{ field_sizing: "content" } as React.CSSProperties}
              />
            </div>

            {/* Send */}
            <Button
              className="flex-shrink-0 h-11 w-11 rounded-xl gradient-primary p-0"
              onClick={handleSend}
              disabled={loading || (!input.trim() && !image)}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            <Sparkles className="w-3 h-3 inline mr-1" />
            AI responses are for exam practice. Verify with official sources.
          </p>
        </div>
      </div>
    </div>
  );
}

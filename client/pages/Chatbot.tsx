import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Shield,
  Brain,
  GraduationCap,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  image?: string; 
  timestamp: Date;
}

// ─── Formatting Helper (Remains same) ─────────────────────────────────────────
function formatMessage(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-bold text-foreground">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith("- ")) {
      return <li key={i} className="ml-4 list-disc text-sm">{renderInline(line.slice(2))}</li>;
    }
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-sm leading-relaxed">{renderInline(line)}</p>;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="bg-muted px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

const SUGGESTIONS = [
  { icon: Landmark, label: "Battle of Plassey", q: "Explain the Battle of Plassey 1757", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { icon: Globe, label: "Sundarbans", q: "Tell me about Sundarbans", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { icon: Calculator, label: "Compound Interest", q: "Explain compound interest formula with example", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { icon: BookOpen, label: "Indian Constitution", q: "Explain fundamental rights in Indian Constitution", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  { icon: Brain, label: "Logical Reasoning", q: "Give me a logical reasoning practice question", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { icon: Zap, label: "Current Affairs", q: "Latest important current affairs for competitive exams", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "নমস্কার! 👋 I'm your AI Study Assistant. How can I help you today?",
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

  // ─── API CALL LOGIC ────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text && !image) return;

    // 1. Add User Message to UI
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text || "Attached an image",
      image: image ?? undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImage(null);
    setImageName("");
    setLoading(true);

    try {
      // 2. Prepare JSON request (matches Postman payload)
      const payload: Record<string, any> = {
        message: text,
        conversationHistory: messages.map(m => ({ role: m.role, message: m.text })),
      };
      if (image) {
        // Send image as base64 string (server can choose to ignore if not supported)
        payload.image = image;
      }

      // 3. Make API call to the endpoint using env (works local & server)
      const apiBase = import.meta.env.VITE_API_URL || '';
      const url = apiBase+'/study/chat';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // 4. Add AI Response to UI
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.response, // Use the correct key from the API response
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      // Error handling
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I'm having trouble connecting to the server. Please check if the API is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    if (textRef.current) textRef.current.focus();
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* ── Ambient background ────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <div className="h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">AI Study Assistant</p>
              <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Online • Powered by Gemini AI
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Shield className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">Secure & Private</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Free to Use</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Chat Area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">

          {/* Welcome screen (when only initial message) */}
          {messages.length === 1 && (
            <div className="space-y-5 pb-2">
              {/* Welcome hero */}
              <div className="text-center pt-4 pb-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl shadow-orange-500/25 mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Your AI-Powered Study Companion
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Ask anything about History, Geography, Math, Polity, or Current Affairs. 
                  Upload images of questions for instant solutions.
                </p>
              </div>

              {/* Capabilities */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Brain, label: "Deep Explanations", desc: "Detailed conceptual clarity", color: "text-orange-500", bg: "bg-orange-500/10" },
                  { icon: MessageSquare, label: "Bengali + English", desc: "Bilingual responses", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { icon: Zap, label: "Instant Answers", desc: "Lightning-fast AI", color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((cap) => (
                  <div key={cap.label} className="bg-card border border-border/50 rounded-xl p-3 text-center">
                    <div className={`w-8 h-8 mx-auto rounded-lg ${cap.bg} flex items-center justify-center mb-1.5`}>
                      <cap.icon className={`w-4 h-4 ${cap.color}`} />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">{cap.label}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{cap.desc}</p>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Try asking
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s.label} onClick={() => handleSuggestion(s.q)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${s.color} text-left transition-all hover:scale-[1.02] hover:shadow-sm`}>
                      <s.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[11px] font-semibold">{s.label}</span>
                      <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust bar */}
              <div className="flex items-center justify-center gap-4 pt-1 pb-2">
                {[
                  { val: "50K+", label: "Students" },
                  { val: "1M+", label: "Questions Answered" },
                  { val: "4.8/5", label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">{s.val}</span>
                    <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Messages ──────────────────────────────────────────────── */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1 shadow-md ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-500/20"
                  : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/20"
              }`}>
                {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[80%] space-y-1.5 flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.image && (
                  <img src={msg.image} alt="uploaded" className="rounded-xl max-h-48 object-contain border border-border/40 shadow-sm" />
                )}
                <Card className={`px-4 py-3 rounded-2xl border-0 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm shadow-primary/10"
                    : "bg-card border border-border/50 rounded-tl-sm"
                }`}>
                  <div className="space-y-0.5">
                    {msg.role === "assistant" ? formatMessage(msg.text) : <p className="text-sm">{msg.text}</p>}
                  </div>
                </Card>
                <span className={`text-[9px] px-1 ${msg.role === "user" ? "text-muted-foreground/60" : "text-muted-foreground/60"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-orange-500/20">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <Card className="px-4 py-3 bg-card border border-border/50 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-1">Thinking…</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input Area ────────────────────────────────────────────────── */}
      <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        {image && (
          <div className="max-w-3xl mx-auto px-4 pt-2">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2.5 py-1.5 w-fit border border-border/40">
              <img src={image} alt="preview" className="w-8 h-8 rounded-md object-cover" />
              <span className="text-[10px] text-muted-foreground max-w-[120px] truncate">{imageName}</span>
              <button onClick={() => { setImage(null); setImageName(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 py-2.5">
          <div className="flex gap-2 items-end bg-muted/30 rounded-xl border border-border/50 p-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 flex-shrink-0"
              onClick={() => fileRef.current?.click()}>
              <ImagePlus className="w-4 h-4" />
            </Button>
            <textarea
              ref={textRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything — History, Math, Science, Current Affairs…"
              className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none min-h-[36px] max-h-28 resize-none placeholder:text-muted-foreground/60"
              rows={1}
            />
            <Button
              className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md shadow-orange-500/20 flex-shrink-0"
              onClick={handleSend}
              disabled={loading || (!input.trim() && !image)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] text-muted-foreground/50 text-center mt-1.5">
            AI can make mistakes. Verify important information independently.
          </p>
        </div>
      </div>
    </div>
  );
}

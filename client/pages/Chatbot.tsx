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
  { icon: Landmark, label: "Battle of Plassey", q: "Explain the Battle of Plassey 1757" },
  { icon: Globe, label: "Sundarbans", q: "Tell me about Sundarbans" },
  { icon: Calculator, label: "Compound Interest", q: "Explain compound interest formula with example" },
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
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('message', text);
      formData.append('conversationHistory', JSON.stringify(messages.map(m => ({ role: m.role, text: m.text }))));
      if (image) {
        // Convert base64 to blob if needed, or assume image is a File
        // For now, assuming image is base64 string, need to convert to blob
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, imageName);
      }

      // 3. Make API call to the new endpoint
      const response = await fetch('/api/study/chat', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // 4. Add AI Response to UI
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.reply || data.message, // Adjust based on actual response structure
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur flex-shrink-0">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">AI Study Assistant</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container px-4 max-w-3xl mx-auto py-6 space-y-4">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {SUGGESTIONS.map((s) => (
                <button key={s.label} onClick={() => handleSuggestion(s.q)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 hover:bg-muted text-xs font-medium transition-colors">
                  <s.icon className="w-3 h-3 text-primary" /> {s.label}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1 ${msg.role === "assistant" ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-gradient-to-br from-amber-500 to-orange-500"}`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                {msg.image && <img src={msg.image} alt="uploaded" className="rounded-xl max-h-56 object-contain border border-border/40" />}
                <Card className={`px-4 py-3 rounded-2xl border-0 shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/60 rounded-tl-sm"}`}>
                  <div className="space-y-0.5">
                    {msg.role === "assistant" ? formatMessage(msg.text) : <p className="text-sm">{msg.text}</p>}
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="px-4 py-3 bg-muted/60 rounded-2xl rounded-tl-sm border-0">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </Card>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-background/95 backdrop-blur sticky bottom-0 flex-shrink-0">
        {image && (
          <div className="container px-4 max-w-3xl mx-auto pt-3">
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-fit">
              <img src={image} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
              <button onClick={() => { setImage(null); setImageName(""); }}><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
        <div className="container px-4 max-w-3xl mx-auto py-3">
          <div className="flex gap-2 items-end">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl" onClick={() => fileRef.current?.click()}><ImagePlus className="w-4 h-4" /></Button>
            <textarea
              ref={textRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button className="h-11 w-11 rounded-xl" onClick={handleSend} disabled={loading || (!input.trim() && !image)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
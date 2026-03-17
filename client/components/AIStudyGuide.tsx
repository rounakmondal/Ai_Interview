import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, BookOpen, Sparkles, Loader2 } from "lucide-react";

interface AIStudyGuideProps {
  chapterId: string;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIStudyGuide({ chapterId, onClose }: AIStudyGuideProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load initial guide on mount
  useEffect(() => {
    if (initialLoaded) return;
    setInitialLoaded(true);
    fetchGuide("Give me an overview and key concepts for this chapter.");
  }, [initialLoaded, chapterId]);

  const fetchGuide = async (userQuery: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
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
          { role: "assistant", content: data.guide || data.text || "No response received." },
        ]);
      } else {
        // Fallback local response
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: getFallbackGuide(userQuery),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getFallbackGuide(userQuery),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const q = query.trim();
    if (!q || loading) return;
    setQuery("");
    fetchGuide(q);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-50 flex flex-col bg-background border-l border-border/40 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">AI Study Guide</p>
            <p className="text-xs text-muted-foreground truncate max-w-[220px]">Chapter: {chapterId}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <BookOpen className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Ask anything about this chapter…</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-[90%] px-3.5 py-2.5 text-sm leading-relaxed border-0 shadow-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                  : "bg-muted/40 rounded-2xl rounded-bl-sm"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Card className="px-4 py-3 bg-muted/40 border-0 rounded-2xl rounded-bl-sm shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </Card>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/40 p-3 bg-muted/10">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Ask about this chapter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !query.trim()} className="h-9 w-9 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function getFallbackGuide(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("overview") || q.includes("key concept")) {
    return `📘 Chapter Overview\n\nThis chapter covers fundamental concepts that are important for your exam preparation. Key areas to focus on:\n\n• Core definitions and terminology\n• Important facts, dates, and figures\n• Common question patterns from previous years\n• Connections to related topics\n\nTip: Start with the basics, then practice with MCQs to test your understanding.`;
  }
  if (q.includes("important") || q.includes("question")) {
    return `📝 Important Questions\n\n1. Focus on definition-based questions — these appear frequently.\n2. Practice numerical/factual questions with exact figures.\n3. Review previous year papers for recurring patterns.\n4. Pay attention to comparative questions (e.g., "Which of the following is NOT…").\n\nTip: Time yourself while practicing to build exam speed.`;
  }
  if (q.includes("tip") || q.includes("strategy") || q.includes("how to")) {
    return `💡 Study Tips\n\n• Read the chapter once for understanding, then re-read for retention.\n• Make short notes or flashcards for quick revision.\n• Solve at least 20 MCQs after completing each chapter.\n• Use the elimination method for tricky questions.\n• Revise this chapter every 7 days using spaced repetition.`;
  }
  return `Here's what I can help with for this chapter:\n\n• Explain key concepts and definitions\n• Highlight important topics for the exam\n• Suggest study strategies\n• Point out common question patterns\n\nFeel free to ask a specific question!`;
}

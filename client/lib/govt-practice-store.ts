import { GovtQuestion, TestConfig } from "@/lib/govt-practice-data";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// ─── Bengali → English key normalizer ─────────────────────────────────────────
// The API may return questions with Bengali keys (প্রশ্ন, বিকল্প, উত্তর, ব্যাখ্যা)
// or English keys. This normalises both into the GovtQuestion shape.
const ANSWER_LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

function stripOptionPrefix(opt: string): string {
  return opt.replace(/^[A-Da-d][.):\s-]+\s*/, "").trim();
}

function normalizeQuestion(raw: any, fallbackId: number): GovtQuestion {
  // Already in English-key format
  if (raw.question && Array.isArray(raw.options) && typeof raw.correctIndex === "number") {
    return raw as GovtQuestion;
  }

  const question: string = raw.question || raw["প্রশ্ন"] || raw["proshno"] || "";
  const rawOptions: string[] = raw.options || raw["বিকল্প"] || raw["bikalpa"] || [];
  const options: [string, string, string, string] = [
    stripOptionPrefix(rawOptions[0] || ""),
    stripOptionPrefix(rawOptions[1] || ""),
    stripOptionPrefix(rawOptions[2] || ""),
    stripOptionPrefix(rawOptions[3] || ""),
  ];

  // Resolve correctIndex from letter answer like "B" or index
  let correctIndex: number = 0;
  if (typeof raw.correctIndex === "number") {
    correctIndex = raw.correctIndex;
  } else {
    const answerRaw: string = (raw.answer || raw["উত্তর"] || raw["uttor"] || "A").trim().toUpperCase();
    correctIndex = ANSWER_LETTER_TO_INDEX[answerRaw] ?? 0;
  }

  const explanation: string = raw.explanation || raw["ব্যাখ্যা"] || raw["bakhya"] || "";
  const explanationBn: string | undefined = raw.explanationBn || raw["ব্যাখ্যা"] || undefined;

  return {
    id: raw.id ?? fallbackId,
    exam: raw.exam || "WBCS",
    subject: raw.subject || "History",
    difficulty: raw.difficulty || "Medium",
    year: raw.year,
    question,
    options,
    correctIndex,
    explanation,
    explanationBn,
  };
}

function normalizeBatch(batch: any[]): GovtQuestion[] {
  return batch.map((item, i) => normalizeQuestion(item, Date.now() + i));
}

type QuestionSubscriber = (session: GovtPracticeSession | null) => void;

export interface GovtPracticeSession {
  config: TestConfig;
  language: "english" | "bengali";
  dailyTaskId?: string;
  questions: GovtQuestion[];
  loadedCount: number;
  totalCount: number;
  status: "idle" | "loading" | "complete" | "error";
  error?: string;
}

let session: GovtPracticeSession | null = null;
let eventSource: EventSource | null = null;
const subscribers = new Set<QuestionSubscriber>();

const notifySubscribers = () => subscribers.forEach((listener) => listener(session));

export function getGovtPracticeSession(): GovtPracticeSession | null {
  return session;
}

export function subscribeGovtPracticeSession(listener: QuestionSubscriber) {
  subscribers.add(listener);
  listener(session);
  return () => {
    subscribers.delete(listener);
  };
}

function buildSSEUrl(config: TestConfig, language: "english" | "bengali") {
  const params = new URLSearchParams({
    exam: config.customExam?.trim() || config.exam,
    difficulty: config.difficulty,
    count: String(config.count),
    ...(config.subject && !config.fullPaper ? { subject: config.subject } : {}),
    ...(config.fullPaper ? { fullPaper: "true" } : {}),
    language,
    stream: "true",
  });
  return `${API_BASE}/govt/questions?${params}`;
}

export function startGovtPracticeSession(
  config: TestConfig,
  language: "english" | "bengali",
  dailyTaskId?: string,
  onSessionChange?: (session: GovtPracticeSession) => void
) {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  session = {
    config,
    language,
    dailyTaskId,
    questions: [],
    loadedCount: 0,
    totalCount: config.count,
    status: "loading",
  };
  notifySubscribers();
  onSessionChange?.(session);

  const url = buildSSEUrl(config, language);
  console.log("Starting fetch to:", url);

  fetch(url, {
    headers: { Accept: "text/event-stream" },
  })
    .then(async (response) => {
      console.log("Fetch response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get("content-type") || "";

      // ── Plain JSON response (not SSE) ─────────────────────────────
      if (contentType.includes("application/json")) {
        const json = await response.json();
        if (!session) return;
        const items: any[] = Array.isArray(json)
          ? json
          : json.questions && Array.isArray(json.questions)
            ? json.questions
            : [];
        if (items.length > 0) {
          session.questions = normalizeBatch(items);
          session.loadedCount = session.questions.length;
        }
        session.status = "complete";
        notifySubscribers();
        onSessionChange?.(session);
        return;
      }

      // ── SSE / streamed response ───────────────────────────────────
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const addQuestions = (items: any[]) => {
        if (!session || items.length === 0) return;
        const normalized = normalizeBatch(items);
        session.questions = [...session.questions, ...normalized];
        session.loadedCount = session.questions.length;
        session.status = "loading";
        notifySubscribers();
        onSessionChange?.(session);
      };

      const readStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            console.log("Received line:", line);
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (!dataStr) continue;
              try {
                const data = JSON.parse(dataStr);
                if (Array.isArray(data)) {
                  addQuestions(data);
                } else if (data && typeof data === "object" && !data.error) {
                  // Single question object
                  addQuestions([data]);
                }
              } catch (err) {
                console.warn("Failed to parse SSE data:", dataStr);
              }
            } else if (line === "event: end" || line.startsWith("event: end")) {
              if (!session) return;
              session.status = "complete";
              notifySubscribers();
              onSessionChange?.(session);
              return;
            }
          }
        }

        // Stream finished without explicit "event: end" — 
        // try parsing the entire buffer as JSON (server may have returned plain JSON)
        if (session && session.questions.length === 0 && buffer.trim()) {
          try {
            const fallback = JSON.parse(buffer.trim());
            const items = Array.isArray(fallback)
              ? fallback
              : fallback.questions && Array.isArray(fallback.questions)
                ? fallback.questions
                : [];
            addQuestions(items);
          } catch {
            // not valid JSON either
          }
        }

        // Mark complete when stream ends
        if (session) {
          session.status = session.questions.length > 0 ? "complete" : "error";
          if (session.status === "error") {
            session.error = "No questions received. Please try again.";
          }
          notifySubscribers();
          onSessionChange?.(session);
        }
      };

      readStream().catch((err) => {
        console.error("Stream read error:", err);
        if (session) {
          session.status = session.questions.length > 0 ? "complete" : "error";
          session.error = session.questions.length > 0 ? undefined : "Failed to load questions. Please try again.";
          notifySubscribers();
          onSessionChange?.(session);
        }
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      if (session) {
        session.status = "error";
        session.error = "Failed to load questions. Please try again.";
        notifySubscribers();
        onSessionChange?.(session);
      }
    });
}

export function closeGovtPracticeSession() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  session = null;
  notifySubscribers();
}

import { GovtQuestion, TestConfig } from "@/lib/govt-practice-data";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

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
    .then((response) => {
      console.log("Fetch response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
              console.log("Data string:", dataStr);
              if (dataStr) {
                try {
                  const data = JSON.parse(dataStr);
                  if (Array.isArray(data) && data.length > 0) {
                    console.log("Received batch:", data.length);
                    if (!session) return;
                    session.questions = [...session.questions, ...data];
                    session.loadedCount = session.questions.length;
                    session.status = "loading";
                    notifySubscribers();
                    onSessionChange?.(session);
                  }
                } catch (err) {
                  console.warn("Failed to parse SSE data:", dataStr);
                }
              }
            } else if (line === "event: end") {
              if (!session) return;
              session.status = "complete";
              notifySubscribers();
              onSessionChange?.(session);
              break;
            }
          }
        }
      };

      readStream().catch((err) => {
        console.error("Stream read error:", err);
        if (session) {
          session.status = "error";
          session.error = "Failed to load questions. Please try again.";
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

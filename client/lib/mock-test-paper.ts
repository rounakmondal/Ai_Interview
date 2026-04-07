export interface MockQuestion {
  id: number;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: [string, string, string, string];
  correct_index: number;
  correct_option: string;
  explanation: string;
  tags: string[];
}

export interface MockPaperMeta {
  exam: string;
  paper_title: string;
  total_questions: number;
  duration_minutes: number;
  generated_at: string;
}

export interface MockPaperResponse {
  meta: MockPaperMeta;
  questions: MockQuestion[];
  source: "api" | "fallback";
}

type RawFallbackQuestion = {
  q_no: string;
  question: string;
  options: { a: string; b: string; c: string; d: string };
};

const policeFallbackRaw: RawFallbackQuestion[] = [
  { q_no: "Q1", question: "In which year did the First War of Indian Independence take place?", options: { a: "1856", b: "1857", c: "1858", d: "1859" } },
  { q_no: "Q2", question: "What is the name of the largest desert in the world?", options: { a: "Sahara", b: "Gobi", c: "Mojave", d: "Atacama" } },
  { q_no: "Q3", question: "Who is known as the 'Father of Botany'?", options: { a: "Linnaeus", b: "Darwin", c: "Hooker", d: "Theophrastus" } },
  { q_no: "Q4", question: "What is the solution of x + 2y = 5 and 3x - 2y = 7?", options: { a: "x = 1, y = 2", b: "x = 2, y = 1", c: "x = 3, y = 1", d: "x = 1, y = 3" } },
  { q_no: "Q5", question: "Who was the first President of India?", options: { a: "Dr. Rajendra Prasad", b: "Jawaharlal Nehru", c: "Sarvepalli Radhakrishnan", d: "Zakir Husain" } },
  { q_no: "Q6", question: "What is the name of the highest peak in West Bengal?", options: { a: "Kanchenjunga", b: "Sindhu Hill", c: "Sandhu Hill", d: "Teesta Hill" } },
  { q_no: "Q7", question: "Which is the largest organ in the human body?", options: { a: "Heart", b: "Brain", c: "Liver", d: "Skin" } },
  { q_no: "Q8", question: "In which year did World War I begin?", options: { a: "1914", b: "1915", c: "1916", d: "1917" } },
  { q_no: "Q9", question: "What is the name of the largest river port in India?", options: { a: "Kolkata", b: "Mumbai", c: "Chennai", d: "Kanpur" } },
  { q_no: "Q10", question: "Where was Rabindranath Tagore born?", options: { a: "Kolkata", b: "Shantiniketan", c: "Shilaidaha", d: "Barisal" } },
  { q_no: "Q11", question: "Which is the largest national park in India?", options: { a: "Hemis", b: "Kaziranga", c: "Sundarbans", d: "Jim Corbett" } },
  { q_no: "Q12", question: "Who was the first Indian woman astronaut?", options: { a: "Kalpana Chawla", b: "Sunita Williams", c: "Indira Gandhi", d: "Pratibha Patil" } },
  { q_no: "Q13", question: "Which is the highest peak in India?", options: { a: "Kanchenjunga", b: "Mount Everest", c: "Siachen", d: "Nanda Devi" } },
  { q_no: "Q14", question: "What is the capital of West Bengal?", options: { a: "Kolkata", b: "Darjeeling", c: "Siliguri", d: "Malda" } },
  { q_no: "Q15", question: "Which is the largest lake in India?", options: { a: "Chilika", b: "Dal", c: "Nainital", d: "Periyar" } },
  { q_no: "Q16", question: "Who was the first Indian male astronaut?", options: { a: "Rakesh Sharma", b: "Kalpana Chawla", c: "Sunita Williams", d: "Indira Gandhi" } },
  { q_no: "Q17", question: "Which is the largest port in India?", options: { a: "Kolkata", b: "Mumbai", c: "Chennai", d: "Kandla" } },
  { q_no: "Q18", question: "Who was the first Prime Minister of India?", options: { a: "Jawaharlal Nehru", b: "Indira Gandhi", c: "Sarvepalli Radhakrishnan", d: "Dr. Rajendra Prasad" } },
  { q_no: "Q19", question: "Which is the longest river in India?", options: { a: "Ganga", b: "Brahmaputra", c: "Yamuna", d: "Krishna" } },
  { q_no: "Q20", question: "What is the capital of India?", options: { a: "Kolkata", b: "Mumbai", c: "Chennai", d: "New Delhi" } },
  { q_no: "Q21", question: "Which is the highest mountain peak in India?", options: { a: "Kanchenjunga", b: "Mount Everest", c: "Siachen", d: "Nanda Devi" } },
  { q_no: "Q22", question: "Which is the largest district in West Bengal?", options: { a: "Darjeeling", b: "Jalpaiguri", c: "Malda", d: "Uttar Dinajpur" } },
  { q_no: "Q23", question: "Which is the largest lake in India?", options: { a: "Chilika", b: "Dal", c: "Nainital", d: "Periyar" } },
];

function mapFallbackPoliceQuestions(): MockQuestion[] {
  return policeFallbackRaw.map((q, idx) => ({
    id: idx + 1,
    subject: "Police",
    topic: "General Knowledge",
    difficulty: "Medium",
    question: q.question,
    options: [q.options.a, q.options.b, q.options.c, q.options.d],
    correct_index: 0,
    correct_option: q.options.a,
    explanation: "This question is loaded from local fallback data.",
    tags: ["fallback", "police"],
  }));
}

function normalizeApiQuestion(raw: any, index: number): MockQuestion {
  if (raw && Array.isArray(raw.options)) {
    const opts = raw.options.slice(0, 4);
    while (opts.length < 4) opts.push(`Option ${opts.length + 1}`);
    return {
      id: Number(raw.id ?? index + 1),
      subject: String(raw.subject ?? "Police"),
      topic: String(raw.topic ?? "General"),
      difficulty: raw.difficulty === "Easy" || raw.difficulty === "Hard" ? raw.difficulty : "Medium",
      question: String(raw.question ?? `Question ${index + 1}`),
      options: [opts[0], opts[1], opts[2], opts[3]],
      correct_index: Number.isInteger(raw.correct_index) ? raw.correct_index : 0,
      correct_option: String(raw.correct_option ?? opts[0]),
      explanation: String(raw.explanation ?? "No explanation provided."),
      tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    };
  }

  const mappedOpts = raw?.options ?? {};
  const options = [
    String(mappedOpts.a ?? "Option A"),
    String(mappedOpts.b ?? "Option B"),
    String(mappedOpts.c ?? "Option C"),
    String(mappedOpts.d ?? "Option D"),
  ] as [string, string, string, string];

  return {
    id: index + 1,
    subject: "Police",
    topic: "General Knowledge",
    difficulty: "Medium",
    question: String(raw?.question ?? `Question ${index + 1}`),
    options,
    correct_index: 0,
    correct_option: options[0],
    explanation: "This question is loaded from API data without an answer key.",
    tags: ["api", "police"],
  };
}

// ── Cache Layer ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "mock_paper_cache";
const REFRESH_HOUR = 16; // 4 PM

interface CachedPaper {
  data: MockPaperResponse;
  lastFetchDate: string;   // "YYYY-MM-DD"
  lastFetchHour: number;   // 0-23
  refreshedAt4PM: boolean; // 4PM refresh hoyeche ki na
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getCurrentHour(): number {
  return new Date().getHours();
}

function getCachedPaper(examType: string): CachedPaper | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${examType}`);
    if (!raw) return null;
    return JSON.parse(raw) as CachedPaper;
  } catch {
    return null;
  }
}

function setCachedPaper(examType: string, data: MockPaperResponse, refreshedAt4PM: boolean): void {
  const cache: CachedPaper = {
    data,
    lastFetchDate: getTodayString(),
    lastFetchHour: getCurrentHour(),
    refreshedAt4PM,
  };
  localStorage.setItem(`${STORAGE_KEY}_${examType}`, JSON.stringify(cache));
}

function shouldFetchFromApi(cache: CachedPaper | null): boolean {
  // No cache → must fetch
  if (!cache) {
    console.log("[MockTest] No cache found → API call");
    return true;
  }

  const todayStr = getTodayString();
  const currentHour = getCurrentHour();

  // New day → fresh fetch
  if (cache.lastFetchDate !== todayStr) {
    console.log("[MockTest] New day → API call");
    return true;
  }

  // Same day, current time >= 4PM and 4PM refresh not done yet → fetch
  if (currentHour >= REFRESH_HOUR && !cache.refreshedAt4PM) {
    console.log("[MockTest] 4PM refresh triggered → API call");
    return true;
  }

  // Cache is valid → serve from storage
  console.log("[MockTest] Cache hit → serving from localStorage");
  return false;
}

async function fetchFromApi(examType: string): Promise<MockPaperResponse> {
  const endpoint = `https://recomendengine.onrender.com/recommend`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: examType }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

  const data = await res.json();

  if (!Array.isArray(data?.questions) || data.questions.length === 0) {
    throw new Error("Invalid paper payload from API");
  }

  const normalizedQuestions = data.questions.map((q: any, i: number) => normalizeApiQuestion(q, i));

  return {
    source: "api",
    questions: normalizedQuestions,
    meta: {
      exam: String(data.exam ?? examType),
      paper_title: String(data.paper_title ?? `${examType} Mock Test Paper`),
      total_questions: normalizedQuestions.length,
      duration_minutes: Number(data.duration_minutes ?? 60),
      generated_at: String(data.generated_at ?? new Date().toISOString()),
    },
  };
}

// ── Main Export ───────────────────────────────────────────────────────────────

export async function fetchMockTestPaper(examType: string): Promise<MockPaperResponse> {
  const cache = getCachedPaper(examType);

  // Serve from cache if valid
  if (!shouldFetchFromApi(cache)) {
    return cache!.data;
  }

  // Fetch from API
  try {
    const result = await fetchFromApi(examType);
    const is4PMRefresh = getCurrentHour() >= REFRESH_HOUR;
    setCachedPaper(examType, result, is4PMRefresh);
    return result;
  } catch (err) {
    console.warn("[MockTest] API failed, using fallback:", err);

    // Cache ache but stale → purano cache serve koro, fallback er theke better
    if (cache) {
      console.log("[MockTest] Returning stale cache instead of fallback");
      return cache.data;
    }

    // No cache, no API → fallback
    const fallbackQuestions = mapFallbackPoliceQuestions();
    return {
      source: "fallback",
      questions: fallbackQuestions,
      meta: {
        exam: examType,
        paper_title: `${examType} Mock Test`,
        total_questions: fallbackQuestions.length,
        duration_minutes: 60,
        generated_at: new Date().toISOString(),
      },
    };
  }
}
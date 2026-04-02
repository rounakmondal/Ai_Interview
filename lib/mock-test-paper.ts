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
  { q_no: "Q1", question: "ভারতের প্রথম স্বাধীনতা যুদ্ধ কত সালে সংঘটিত হয়?", options: { a: "১৮৫৬", b: "১৮৫৭", c: "১৮৫৮", d: "১৮৫৯" } },
  { q_no: "Q2", question: "পৃথিবীর বৃহত্তম মরুভূমির নাম কী?", options: { a: "সহারা", b: "গোবি", c: "মোহাবি", d: "আটাকামা" } },
  { q_no: "Q3", question: "কোন বিজ্ঞানী 'আদিম উদ্ভিদবিদ্যা' বলে?", options: { a: "লিনিয়াস", b: "ডারউইন", c: "হুকার", d: "থিওফ্রাস্টাস" } },
  { q_no: "Q4", question: "x + 2y = 5 এবং 3x - 2y = 7 সমীকরণের সমাধান কী?", options: { a: "x = 1, y = 2", b: "x = 2, y = 1", c: "x = 3, y = 1", d: "x = 1, y = 3" } },
  { q_no: "Q5", question: "ভারতের প্রথম রাষ্ট্রপতি কে ছিলেন?", options: { a: "ড. রাজেন্দ্রপ্রসাদ", b: "জওহরলাল নেহেরু", c: "সর্বপল্লী রাধাকৃষ্ণান", d: "জাকির হুসেন" } },
  { q_no: "Q6", question: "পশ্চিমবঙ্গের সর্বোচ্চ পর্বতশিখরের নাম কী?", options: { a: "কাঞ্চনজঙ্ঘা", b: "সিন্ধু পাহাড়", c: "সাঁধু পাহাড়", d: "তিস্তা পাহাড়" } },
  { q_no: "Q7", question: "মানুষের শরীরে কোন অঙ্গটি সবচেয়ে বড়?", options: { a: "হৃৎপিণ্ড", b: "মস্তিষ্ক", c: "যকৃত", d: "ত্বক" } },
  { q_no: "Q8", question: "প্রথম বিশ্বযুদ্ধ কত সালে শুরু হয়?", options: { a: "১৯১৪", b: "১৯১৫", c: "১৯১৬", d: "১৯১৭" } },
  { q_no: "Q9", question: "ভারতের সর্ববৃহৎ নদী বন্দরের নাম কী?", options: { a: "কলকাতা", b: "মুম্বাই", c: "চেন্নাই", d: "কানপুর" } },
  { q_no: "Q10", question: "রবীন্দ্রনাথ ঠাকুরের জন্মস্থান কোথায়?", options: { a: "কলকাতা", b: "শান্তিনিকেতন", c: "শিলাইদহ", d: "বরিশাল" } },
  { q_no: "Q11", question: "ভারতের সর্ববৃহৎ জাতীয় উদ্যান কোনটি?", options: { a: "হিমিস", b: "কাজিরঙ্গা", c: "সুন্দরবন", d: "জিম করবেট" } },
  { q_no: "Q12", question: "প্রথম ভারতীয় মহিলা মহাকাশচারীর নাম কী?", options: { a: "কল্পনা চাওলা", b: "সুনীতা উইলিয়ামস", c: "ইন্দিরা গান্ধী", d: "প্রতিভা পাটিল" } },
  { q_no: "Q13", question: "ভারতের সর্বোচ্চ শিখর কোনটি?", options: { a: "কাঞ্চনজঙ্ঘা", b: "মাউন্ট এভারেস্ট", c: "সাইয়াচিন", d: "নান্দা দেবী" } },
  { q_no: "Q14", question: "পশ্চিমবঙ্গের রাজধানী কোথায়?", options: { a: "কলকাতা", b: "দারজিলিং", c: "শিলিগুড়ি", d: "মালদা" } },
  { q_no: "Q15", question: "ভারতের সর্ববৃহৎ হ্রদ কোনটি?", options: { a: "চিলকা", b: "দল", c: "নৈনিতাল", d: "পেরিয়ার" } },
  { q_no: "Q16", question: "প্রথম ভারতীয় পুরুষ মহাকাশচারীর নাম কী?", options: { a: "রাকেশ শর্মা", b: "কল্পনা চাওলা", c: "সুনীতা উইলিয়ামস", d: "ইন্দিরা গান্ধী" } },
  { q_no: "Q17", question: "ভারতের সর্ববৃহৎ বন্দর কোনটি?", options: { a: "কলকাতা", b: "মুম্বাই", c: "চেন্নাই", d: "কান্দলা" } },
  { q_no: "Q18", question: "ভারতের প্রথম প্রধানমন্ত্রী কে ছিলেন?", options: { a: "জওহরলাল নেহেরু", b: "ইন্দিরা গান্ধী", c: "সর্বপল্লী রাধাকৃষ্ণান", d: "ড. রাজেন্দ্রপ্রসাদ" } },
  { q_no: "Q19", question: "ভারতের সর্ববৃহৎ নদী কোনটি?", options: { a: "গঙ্গা", b: "ব্রহ্মপুত্র", c: "যমুনা", d: "কৃষ্ণা" } },
  { q_no: "Q20", question: "ভারতের রাজধানী কোথায়?", options: { a: "কলকাতা", b: "মুম্বাই", c: "চেন্নাই", d: "নয়াদিল্লি" } },
  { q_no: "Q21", question: "ভারতের সর্বোচ্চ পর্বতশিখর কোনটি?", options: { a: "কাঞ্চনজঙ্ঘা", b: "মাউন্ট এভারেস্ট", c: "সাইয়াচিন", d: "নান্দা দেবী" } },
  { q_no: "Q22", question: "পশ্চিমবঙ্গের সর্ববৃহৎ জেলা কোনটি?", options: { a: "দার্জিলিং", b: "জলপাইগুড়ি", c: "মালদা", d: "উত্তর দিনাজপুর" } },
  { q_no: "Q23", question: "ভারতের সর্ববৃহৎ হ্রদ কোনটি?", options: { a: "চিলকা", b: "দল", c: "নৈনিতাল", d: "পেরিয়ার" } },
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
        paper_title: `${examType} Mock Test (Fallback)`,
        total_questions: fallbackQuestions.length,
        duration_minutes: 60,
        generated_at: new Date().toISOString(),
      },
    };
  }
}
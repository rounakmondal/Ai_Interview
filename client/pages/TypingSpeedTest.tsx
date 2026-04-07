import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Keyboard,
  RotateCcw,
  Timer,
  Zap,
  Target,
  AlertTriangle,
  Trophy,
  BookOpen,
  Play,
} from "lucide-react";
import RelatedToolsBanner from "@/components/RelatedToolsBanner";

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Typing Speed Test 2026 — SSC CHSL / NTPC / Railway Typing Practice | MedhaHub";

  const desc = "Free online typing speed test for SSC CHSL, NTPC, Railway & govt job exams. Practice English & Hindi typing at 35 WPM (SSC) standards. Track WPM, accuracy & errors in real time. Includes exam-specific passages.";

  const kw = [
    "typing speed test", "typing test online", "typing test for ssc",
    "ssc chsl typing test", "ssc typing test practice",
    "ntpc typing test", "railway typing test",
    "typing speed test online free", "english typing test",
    "wpm typing test", "typing practice for government exam",
    "35 wpm typing test", "typing test 10 minutes",
    "typing test 5 minutes", "typing speed calculator",
    "typing test with timer", "keyboard typing practice",
    "govt exam typing test", "typing test for beginners",
    "online typing test in english", "typing master",
  ].join(", ");

  const url = "https://medhahub.in/typing-test";

  function upsert(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (el) el.content = content;
    else { el = document.createElement("meta"); el.setAttribute(attr, key); el.content = content; document.head.appendChild(el); }
  }

  upsert("name", "description", desc);
  upsert("name", "keywords", kw);
  upsert("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsert("property", "og:type", "website");
  upsert("property", "og:url", url);
  upsert("property", "og:site_name", "MedhaHub");
  upsert("property", "og:title", "Typing Speed Test — SSC / Railway Typing Practice | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Typing Speed Test 2026 | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Passages ─────────────────────────────────────────────────────────────────

interface Passage {
  title: string;
  text: string;
  tag: string;
}

const PASSAGES: Passage[] = [
  {
    title: "SSC CHSL Practice — General",
    tag: "ssc",
    text: "The Government of India has launched several flagship programmes to improve the lives of citizens across the country. Digital India is a transformative initiative that aims to ensure government services are made available to citizens electronically by improving online infrastructure and increasing Internet connectivity. Similarly, the Swachh Bharat Mission has created significant awareness about sanitation and cleanliness. The Make in India programme encourages companies to develop, manufacture and assemble products made in India, thereby boosting the manufacturing sector. Education reforms have also been introduced through the National Education Policy, which aims to overhaul the education system to meet the needs of the twenty-first century. These programmes collectively contribute to building a strong and self-reliant nation that can compete effectively in the global economy.",
  },
  {
    title: "Railway NTPC Practice",
    tag: "railway",
    text: "Indian Railways is one of the largest railway networks in the world, carrying millions of passengers and tons of freight across the vast expanse of the country every day. The railway system plays a crucial role in the economic development of India by connecting remote areas with major cities and industrial centres. The introduction of high-speed trains such as Vande Bharat Express has revolutionised passenger travel by offering world-class amenities and reduced journey times. Railway recruitment examinations are conducted regularly to fill various positions including station masters, ticket collectors, goods guards and office assistants. Candidates appearing for these examinations are required to demonstrate proficiency in English typing with a minimum speed of thirty-five words per minute on a computer keyboard.",
  },
  {
    title: "General English — Banking",
    tag: "banking",
    text: "The banking sector in India has undergone remarkable transformation over the past few decades. With the advent of digital banking, customers can now perform a wide range of financial transactions from the comfort of their homes using mobile applications and internet banking platforms. The Reserve Bank of India plays a pivotal role in regulating the banking sector and ensuring financial stability across the nation. Public sector banks continue to serve the financial needs of millions of Indians, especially in rural and semi-urban areas where access to private banking institutions may be limited. The emphasis on financial inclusion through schemes like Jan Dhan Yojana has brought millions of unbanked citizens into the formal financial system, thereby promoting economic growth.",
  },
  {
    title: "General Paragraph — Practice",
    tag: "general",
    text: "Time management is a skill that every student and professional must develop to achieve success in their personal and professional lives. It involves planning and exercising conscious control of time spent on specific activities, especially to increase effectiveness, efficiency, and productivity. Good time management enables an individual to complete more tasks in a shorter period of time, lowers stress, and leads to career success. The key to effective time management is setting clear goals, prioritising tasks based on their importance and urgency, avoiding procrastination, and maintaining a balanced approach to work and leisure. People who manage their time well tend to be more productive, less stressed, and ultimately more successful in achieving their long-term ambitions.",
  },
  {
    title: "Computer Knowledge — SSC",
    tag: "ssc",
    text: "A computer is an electronic device that processes data according to a set of instructions called a program. The central processing unit is the brain of the computer that performs all arithmetic and logical operations. Random access memory is the temporary storage area where data is held while the computer is running. The hard disk drive provides permanent storage for the operating system, application software, and user files. Input devices such as the keyboard and mouse allow users to enter data and commands, while output devices like the monitor and printer display and produce results. Modern computers are connected through networks including the Internet, which enables communication and data sharing across the globe. Understanding basic computer operations is essential for candidates appearing in government examinations.",
  },
];

type Duration = 60 | 120 | 300 | 600;

// ── Component ────────────────────────────────────────────────────────────────

export default function TypingSpeedTest() {
  const [duration, setDuration] = useState<Duration>(300);
  const [passageIdx, setPassageIdx] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [startTime, setStartTime] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => { applySeo(); }, []);

  const passage = PASSAGES[passageIdx];
  const words = passage.text.split(/\s+/);

  // ── Timer ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  // ── Stats ──────────────────────────────────────────────────────────────

  const getStats = useCallback(() => {
    const typedWords = input.trim().split(/\s+/).filter(Boolean);
    const refWords = passage.text.split(/\s+/);
    let correctWords = 0;
    let wrongWords = 0;
    let correctChars = 0;
    let totalChars = input.length;

    typedWords.forEach((word, i) => {
      if (i < refWords.length && word === refWords[i]) {
        correctWords++;
        correctChars += word.length;
      } else {
        wrongWords++;
      }
    });

    const elapsed = started ? (duration - timeLeft) : 0;
    const minutes = elapsed / 60;
    const grossWpm = minutes > 0 ? Math.round(typedWords.length / minutes) : 0;
    const netWpm = minutes > 0 ? Math.max(0, Math.round((correctWords - wrongWords / 2) / minutes)) : 0;
    const accuracy = typedWords.length > 0 ? Math.round((correctWords / typedWords.length) * 100) : 100;

    return { grossWpm, netWpm, accuracy, correctWords, wrongWords, totalChars, typedWords: typedWords.length, elapsed };
  }, [input, passage.text, started, duration, timeLeft]);

  const stats = getStats();

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleInput = (value: string) => {
    if (finished) return;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(value);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setInput("");
    setStarted(false);
    setFinished(false);
    setTimeLeft(duration);
    setStartTime(0);
    inputRef.current?.focus();
  };

  const changeDuration = (d: Duration) => {
    setDuration(d);
    setTimeLeft(d);
    setInput("");
    setStarted(false);
    setFinished(false);
  };

  const nextPassage = () => {
    setPassageIdx(prev => (prev + 1) % PASSAGES.length);
    reset();
  };

  // ── Render highlighted passage ─────────────────────────────────────────

  const renderPassage = () => {
    const typedWords = input.split(/\s+/);
    const currentWordIdx = typedWords.length - 1;

    return words.map((word, i) => {
      let cls = "text-gray-400"; // Not yet typed
      if (i < currentWordIdx) {
        cls = typedWords[i] === word ? "text-green-600" : "text-red-500 line-through";
      } else if (i === currentWordIdx && started && !finished) {
        const partial = typedWords[i] || "";
        cls = word.startsWith(partial) ? "text-foreground font-medium bg-primary/10 px-0.5 rounded" : "text-red-500 font-medium bg-red-50 px-0.5 rounded";
      }
      return (
        <span key={i} className={cls}>
          {word}{" "}
        </span>
      );
    });
  };

  // ── Format timer ───────────────────────────────────────────────────────

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ── WPM color thresholds (SSC standard = 35 WPM) ──────────────────────
  const wpmColor = (wpm: number) =>
    wpm >= 35 ? "text-green-600" : wpm >= 25 ? "text-orange-500" : "text-red-500";

  const faqs = [
    { question: "What is the typing speed required for SSC CHSL?", answer: "SSC CHSL requires a typing speed of 35 WPM in English or 30 WPM in Hindi on computer. The DEST (Data Entry Speed Test) requires 8,000 key depressions per hour." },
    { question: "How is typing speed (WPM) calculated?", answer: "WPM = (Total words typed - Errors) / Time in minutes. A standard word is considered 5 characters. Net WPM accounts for accuracy by subtracting half of wrong words." },
    { question: "What is a good typing speed for government jobs?", answer: "For most government exams like SSC CHSL, 35 WPM in English is required. For Railway NTPC and other exams, 30-35 WPM is sufficient. Practicing regularly can help you achieve 40+ WPM." },
    { question: "How to improve typing speed for SSC exams?", answer: "Practice daily for 30-60 minutes, use proper finger placement (touch typing), avoid looking at the keyboard, start with accuracy and gradually increase speed. Use exam-level passages for realistic practice." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/" },
          { name: "Typing Speed Test", url: "/typing-test" },
        ])
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageSchema(faqs) }} />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Keyboard className="h-6 w-6 text-violet-600" />
                Typing Speed Test
              </h1>
              <p className="text-muted-foreground text-sm">SSC CHSL / NTPC / Railway typing practice</p>
            </div>
          </div>
          <ProfileButton />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Duration */}
          <div className="flex gap-1 bg-white border rounded-lg p-1">
            {([60, 120, 300, 600] as Duration[]).map(d => (
              <button
                key={d}
                onClick={() => changeDuration(d)}
                disabled={started && !finished}
                className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                  duration === d
                    ? "bg-violet-600 text-white"
                    : "text-gray-600 hover:bg-violet-50"
                } ${started && !finished ? "opacity-50" : ""}`}
              >
                {d >= 60 ? `${d / 60} min` : `${d}s`}
              </button>
            ))}
          </div>

          {/* Passage selector */}
          <select
            value={passageIdx}
            onChange={e => { setPassageIdx(Number(e.target.value)); reset(); }}
            disabled={started && !finished}
            className="px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {PASSAGES.map((p, i) => (
              <option key={i} value={i}>{p.title}</option>
            ))}
          </select>

          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={nextPassage} className="gap-1">
              <Play className="h-3 w-3" /> Next
            </Button>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          </div>
        </div>

        {/* Timer & Live Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className={`bg-white border rounded-xl p-3 text-center ${timeLeft <= 30 && started ? "border-red-300 bg-red-50" : ""}`}>
            <Timer className={`h-4 w-4 mx-auto mb-1 ${timeLeft <= 30 && started ? "text-red-500" : "text-violet-500"}`} />
            <p className={`text-2xl font-bold ${timeLeft <= 30 && started ? "text-red-600" : ""}`}>
              {formatTime(timeLeft)}
            </p>
            <p className="text-xs text-muted-foreground">Time Left</p>
          </div>
          <div className="bg-white border rounded-xl p-3 text-center">
            <Zap className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className={`text-2xl font-bold ${wpmColor(stats.netWpm)}`}>{stats.netWpm}</p>
            <p className="text-xs text-muted-foreground">Net WPM</p>
          </div>
          <div className="bg-white border rounded-xl p-3 text-center">
            <Target className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <p className={`text-2xl font-bold ${stats.accuracy >= 95 ? "text-green-600" : stats.accuracy >= 85 ? "text-orange-500" : "text-red-500"}`}>
              {stats.accuracy}%
            </p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="bg-white border rounded-xl p-3 text-center">
            <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-red-400" />
            <p className="text-2xl font-bold text-red-500">{stats.wrongWords}</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </div>
        </div>

        {/* SSC Benchmark */}
        <div className="mb-4 h-2 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              stats.netWpm >= 35 ? "bg-green-500" : stats.netWpm >= 25 ? "bg-orange-400" : "bg-red-400"
            }`}
            style={{ width: `${Math.min(100, (stats.netWpm / 50) * 100)}%` }}
          />
          {/* 35 WPM marker */}
          <div className="absolute top-0 h-full w-0.5 bg-green-700" style={{ left: `${(35 / 50) * 100}%` }} />
          <span className="absolute -top-5 text-[10px] text-green-700 font-medium" style={{ left: `${(35 / 50) * 100 - 3}%` }}>
            35 WPM (SSC)
          </span>
        </div>

        {/* Passage Display */}
        <div className="bg-white border rounded-xl p-4 mb-4 max-h-48 overflow-y-auto leading-7 text-sm font-mono">
          {renderPassage()}
        </div>

        {/* Input Area */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => handleInput(e.target.value)}
          disabled={finished}
          placeholder={finished ? "Test complete! Click Reset to try again." : "Start typing here... (test begins when you type)"}
          className={`w-full h-32 p-4 border-2 rounded-xl text-sm font-mono resize-none focus:outline-none transition ${
            finished
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          }`}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Result Card (shown when finished) */}
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white border-2 border-violet-300 rounded-2xl overflow-hidden"
          >
            <div className={`p-6 text-center ${stats.netWpm >= 35 ? "bg-green-600" : "bg-violet-600"} text-white`}>
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm opacity-90">Your Typing Speed</p>
              <p className="text-5xl font-bold">{stats.netWpm} WPM</p>
              <p className="text-sm opacity-75 mt-1">
                {stats.netWpm >= 35
                  ? "✅ Above SSC CHSL requirement (35 WPM)"
                  : "⚠ Below SSC CHSL requirement (35 WPM) — keep practicing!"}
              </p>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
              <div>
                <p className="text-2xl font-bold">{stats.grossWpm}</p>
                <p className="text-xs text-muted-foreground">Gross WPM</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.correctWords}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{stats.wrongWords}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <Button className="flex-1" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Try Again
              </Button>
              <Button variant="outline" className="flex-1" onClick={nextPassage}>
                <Play className="h-4 w-4 mr-1" /> Next Passage
              </Button>
            </div>
          </motion.div>
        )}

        {/* Related Tools */}
        <RelatedToolsBanner currentPath="/typing-test" />

        {/* FAQ */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-600" />
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white border rounded-xl p-4 group">
              <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                {faq.question}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* Exam Requirements Table */}
        <div className="mt-6 bg-white border rounded-xl p-4 overflow-x-auto">
          <h3 className="font-semibold text-sm mb-3">📋 Typing Speed Requirements by Exam</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4">Exam</th>
                <th className="py-2 pr-4">English</th>
                <th className="py-2 pr-4">Hindi</th>
                <th className="py-2">Type</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-2 pr-4 font-medium text-foreground">SSC CHSL</td><td>35 WPM</td><td>30 WPM</td><td>Qualifying</td></tr>
              <tr className="border-b"><td className="py-2 pr-4 font-medium text-foreground">SSC CGL (AAO)</td><td>35 WPM</td><td>30 WPM</td><td>Qualifying</td></tr>
              <tr className="border-b"><td className="py-2 pr-4 font-medium text-foreground">DEST (SSC)</td><td colSpan={2}>8000 KDPH</td><td>Qualifying</td></tr>
              <tr className="border-b"><td className="py-2 pr-4 font-medium text-foreground">RRB NTPC</td><td>30 WPM</td><td>25 WPM</td><td>Qualifying</td></tr>
              <tr><td className="py-2 pr-4 font-medium text-foreground">High Court (LDA)</td><td>35-40 WPM</td><td>30-35 WPM</td><td>Merit-based</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

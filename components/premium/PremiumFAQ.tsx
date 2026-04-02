import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is InterviewAI suitable for freshers or only experienced candidates?",
    answer:
      "InterviewAI is designed for everyone — from college freshers appearing in campus placements to experienced professionals targeting senior roles. You can select the interview type and difficulty that matches your level, and our AI adapts questions accordingly.",
  },
  {
    question: "Which languages does InterviewAI support?",
    answer:
      "We currently support English, Hindi, Bengali, and Telugu. More Indian regional languages are coming soon. You can select your preferred language from the interview setup screen.",
  },
  {
    question: "Does InterviewAI support Government exam interviews like UPSC, IBPS, SSC?",
    answer:
      "Yes! InterviewAI has a dedicated 'Government' interview type that covers UPSC Personality Tests, IBPS PO/SO, SSC CGL interviews, and state PSC formats. Questions are tailored to the specific exam and domain you select.",
  },
  {
    question: "How does the AI evaluate my performance?",
    answer:
      "After each interview session, our AI analyzes your responses across four dimensions: Communication Skills (clarity, vocabulary, fluency), Technical Knowledge (domain accuracy), Confidence (tone, pace, filler words), and Problem Solving. You get an individual score for each along with specific suggestions to improve.",
  },
  {
    question: "Can I upload my resume for more personalized questions?",
    answer:
      "Yes! On the Pro plan you can upload your CV (PDF or Word). The AI will parse your experience, projects, and skills and generate questions specifically targeted at your background — making the practice far more realistic and relevant.",
  },
  {
    question: "Is my data and interview recording stored or shared?",
    answer:
      "We take privacy seriously. Your interview transcripts are only used to generate your evaluation report within the session. We do not sell, share, or permanently store your interview recordings. All data handling follows Indian data protection guidelines.",
  },
  {
    question: "Can I practice unlimited times on the free plan?",
    answer:
      "The free Starter plan includes 3 mock interview sessions per month. If you need more, the Pro plan offers unlimited interviews with additional features like resume parsing and multi-language support.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes! InterviewAI is fully responsive and works on smartphones and tablets. We also have an Android app available. Make sure your browser allows microphone access for the best voice interaction experience.",
  },
];

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

function FAQItem({ q, a, idx, isOpen, onToggle }: { q: string; a: string; idx: number; isOpen: boolean; onToggle: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: smoothEase }}
      className={`bg-card border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? "border-orange-500/40" : "border-border/50 hover:border-orange-500/20"}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-sm sm:text-base text-foreground">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: smoothEase }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-orange-500/10" : "bg-muted"}`}
        >
          <ChevronDown className={`w-4 h-4 ${isOpen ? "text-orange-500" : "text-muted-foreground"}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
          >
            <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PremiumFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Background Accents */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(249, 115, 22, 0.03) 50%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 dark:bg-slate-950/30" />
      </div>

      {/* Top Divider with Brand Colors */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              questions
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about InterviewAI. Can't find your answer?{" "}
            <a href="#contact" className="text-orange-600 dark:text-orange-400 underline underline-offset-4 hover:opacity-80 transition-opacity">
              Contact our team
            </a>.
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              q={faq.question}
              a={faq.answer}
              idx={idx}
              isOpen={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
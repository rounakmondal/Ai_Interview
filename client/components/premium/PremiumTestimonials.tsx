import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

// Note: These are illustrative example testimonials showing how the platform helps candidates.
const testimonials = [
  {
    name: "Priya S.",
    role: "Software Engineer",
    company: "IT Industry",
    avatar: "PS",
    color: "from-indigo-500 to-blue-600",
    rating: 5,
    text: "MedhaHub completely transformed my interview preparation. The AI gave me realistic follow-up questions I never expected. After 2 weeks of practice I felt so much more confident going into real interviews!",
  },
  {
    name: "Rahul V.",
    role: "Banking Aspirant",
    company: "IBPS Preparation",
    avatar: "RV",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    text: "Practicing IBPS interview questions with MedhaHub was a game-changer. The Hindi language support made it feel completely natural. I felt fully prepared going into my bank exam interview.",
  },
  {
    name: "Ananya P.",
    role: "Marketing Professional",
    company: "Private Sector",
    avatar: "AP",
    color: "from-pink-500 to-rose-600",
    rating: 5,
    text: "The detailed performance metrics showed exactly where I was going wrong. My confidence improved dramatically after just a few practice sessions. Absolutely worth it.",
  },
  {
    name: "Arjun N.",
    role: "Data Analyst",
    company: "Tech Sector",
    avatar: "AN",
    color: "from-emerald-500 to-teal-600",
    rating: 5,
    text: "What sets this apart is the real-time voice interaction. It feels like a real interview, not a quiz. The personalized feedback on technical skills was spot on for my analytics role.",
  },
  {
    name: "Deepika R.",
    role: "HR Professional",
    company: "Corporate HR",
    avatar: "DR",
    color: "from-amber-500 to-orange-600",
    rating: 5,
    text: "I recommend MedhaHub to job seekers as preparation. The 24/7 availability means candidates can practice at midnight before their morning interview. Brilliant tool.",
  },
  {
    name: "Vikram S.",
    role: "Civil Services Aspirant",
    company: "UPSC Preparation",
    avatar: "VS",
    color: "from-cyan-500 to-blue-600",
    rating: 5,
    text: "Used MedhaHub for my UPSC personality test preparation. The AI interviewer asked surprisingly deep questions about current affairs and my essay topics. Helped me stay calm on the actual day.",
  },
];

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(139,92,246,0.05) 0%, rgba(99,102,241,0.04) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 dark:bg-slate-900/40" />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
          >
            <Star className="w-4 h-4 fill-current" />
            Success Stories
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            What users{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              are saying
            </span>
          </h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          >
            Illustrative examples of how MedhaHub helps candidates prepare for interviews.
          </motion.p>

          {/* CTA nudge */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
          >
            <span className="text-sm text-muted-foreground px-4 py-1.5 rounded-full border border-border/50 bg-muted/50">
              ✦ Illustrative examples · Real practice, real progress
            </span>
          </motion.div>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: smoothEase }}
              className="relative group"
            >
              <div className="h-full bg-card border border-border/50 rounded-2xl p-6 flex flex-col gap-4 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                {/* Quote icon */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-muted-foreground/30" />
                </div>

                {/* Text */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

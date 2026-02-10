import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Zap, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Choose Your Interview",
    description:
      "Select from Government, Private, IT, or Non-IT interviews. Pick your preferred language and set your desired duration.",
    icon: Brain,
  },
  {
    step: "02",
    title: "Practice with AI",
    description:
      "Experience a realistic mock interview with our intelligent AI interviewer. Answer questions, receive follow-ups, and engage naturally.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Get Detailed Feedback",
    description:
      "Receive comprehensive evaluation on communication, technical skills, confidence, and personalized improvement suggestions.",
    icon: BarChart3,
  },
];

// Smooth easing for enterprise feel
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: smoothEase,
      },
    },
  };

  const stepNumberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: smoothEase,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.1,
        ease: smoothEase,
      },
    },
  };

  const descVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: smoothEase,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Soft gradient background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.8) 50%, rgba(248, 250, 252, 0.5) 100%)",
          }}
        />
        
        {/* Light diffusion orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Dark mode gradient */}
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-900/50 dark:via-slate-900/80 dark:to-slate-900/50" />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Simple Process
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5">
            How{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              InterviewAI
            </span>{" "}
            Works
          </h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          >
            Master your interview skills in three simple steps. Our AI-powered platform
            guides you from preparation to perfection.
          </motion.p>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-[140px] left-[20%] right-[20%] h-px z-0">
            <motion.div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3) 20%, rgba(139, 92, 246, 0.3) 50%, rgba(168, 85, 247, 0.3) 80%, transparent)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: smoothEase }}
            />
            {/* Animated dot traveling along line */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500"
              style={{ boxShadow: "0 0 12px rgba(99, 102, 241, 0.6)" }}
              initial={{ left: "0%", opacity: 0 }}
              animate={isInView ? { left: "100%", opacity: [0, 1, 1, 0] } : { left: "0%", opacity: 0 }}
              transition={{ duration: 2.5, delay: 1, ease: "easeInOut" }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="relative group"
                >
                  {/* Arrow connector - between cards on desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-6 top-[140px] z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.5, delay: 0.8 + idx * 0.2, ease: smoothEase }}
                      >
                        <ArrowRight className="w-5 h-5 text-indigo-400/60" />
                      </motion.div>
                    </div>
                  )}

                  {/* Card */}
                  <motion.div
                    className="relative h-full p-8 lg:p-10 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/10 group-hover:-translate-y-1 group-hover:border-indigo-200/50 dark:group-hover:border-indigo-500/30"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step Number Badge */}
                    <motion.div
                      variants={stepNumberVariants}
                      className="relative mb-6"
                    >
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 relative overflow-hidden">
                        {step.step}
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border border-slate-200/50 dark:border-slate-600/50 group-hover:from-indigo-50 group-hover:to-violet-50 dark:group-hover:from-indigo-900/30 dark:group-hover:to-violet-900/30 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      variants={titleVariants}
                      className="text-xl lg:text-2xl font-semibold text-foreground mb-3"
                    >
                      {step.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      variants={descVariants}
                      className="text-muted-foreground leading-relaxed text-[15px]"
                    >
                      {step.description}
                    </motion.p>

                    {/* Hover accent line */}
                    <motion.div
                      className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Mobile step connector */}
                  {idx < steps.length - 1 && (
                    <div className="flex md:hidden justify-center my-4">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, delay: 0.5 + idx * 0.2 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-px h-6 bg-gradient-to-b from-indigo-400 to-violet-400" />
                        <ArrowRight className="w-4 h-4 text-indigo-400/60 rotate-90" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA hint */}
        <motion.div
          className="text-center mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1, ease: smoothEase }}
        >
          <p className="text-sm text-muted-foreground">
            Ready to start?{" "}
            <a
              href="/setup"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline underline-offset-4"
            >
              Begin your first interview →
            </a>
          </p>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: smoothEase }}
      />
    </section>
  );
}

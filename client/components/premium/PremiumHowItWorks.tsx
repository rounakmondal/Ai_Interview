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

        {/* Bottom CTA - Professional with breathing effect */}
        <motion.div
          className="mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1, ease: smoothEase }}
        >
          <div className="relative max-w-2xl mx-auto">
            {/* Breathing glow background */}
            <div className="absolute inset-0 -m-4 sm:-m-8">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl animate-pulse"
                style={{ animationDuration: '3s' }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-violet-500/10 rounded-3xl blur-3xl"
                style={{ 
                  animation: 'breathe 4s ease-in-out infinite',
                }}
              />
            </div>

            {/* Card container */}
            <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-indigo-950/90 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl p-px overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-30"
                  style={{
                    animation: 'rotate 8s linear infinite',
                    transformOrigin: 'center',
                  }}
                />
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-indigo-400/40 rounded-full"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${20 + (i % 3) * 25}%`,
                      animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-4 sm:space-y-6">
                {/* Breathing icon */}
                <div className="inline-flex items-center justify-center">
                  <div 
                    className="relative w-14 h-14 sm:w-16 sm:h-16"
                    style={{ animation: 'breathe 3s ease-in-out infinite' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl rotate-3" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Ready to Transform Your Interview Skills?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                    Join thousands of successful candidates who aced their interviews with AI-powered practice
                  </p>
                </div>

                {/* CTA Button with breathing effect */}
                <a href="/setup" className="inline-block group">
                  <div 
                    className="relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl overflow-hidden"
                    style={{ animation: 'breathe 3s ease-in-out infinite' }}
                  >
                    {/* Button glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        style={{
                          animation: 'shimmer 2s infinite',
                        }}
                      />
                    </div>

                    <span className="relative flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
                      Begin Your First Interview
                      <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </a>

                {/* Trust indicator */}
                <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                    Free to start
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>No credit card required</span>
                </p>
              </div>
            </div>
          </div>

          {/* CSS Keyframes */}
          <style>{`
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.02); opacity: 0.9; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
              50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%) skewX(-12deg); }
              100% { transform: translateX(200%) skewX(-12deg); }
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
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

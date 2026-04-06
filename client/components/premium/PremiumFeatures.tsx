import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Mic, 
  Brain, 
  Globe, 
  BarChart3, 
  MessageSquare, 
  Lightbulb, 
  Clock, 
  Shield,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Professional AI Interviewer",
    description: "Realistic voice-driven conversations with our intelligent interviewer avatar",
    accent: true,
  },
  {
    icon: MessageSquare,
    title: "Real-time Voice Interaction",
    description: "Natural speech recognition and instant audio feedback",
    accent: false,
  },
  {
    icon: Globe,
    title: "Multiple Languages & Types",
    description: "Government, Private, IT, and Non-IT interviews in your preferred language",
    accent: false,
  },
  {
    icon: BarChart3,
    title: "Detailed Performance Metrics",
    description: "Comprehensive scoring across communication, technical, and confidence",
    accent: true,
  },
  {
    icon: Brain,
    title: "Intelligent Follow-ups",
    description: "Dynamic cross-questioning based on your responses",
    accent: false,
  },
  {
    icon: Lightbulb,
    title: "Personalized Coaching",
    description: "Actionable improvement suggestions tailored to your performance",
    accent: false,
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Practice anytime, anywhere at your own pace",
    accent: false,
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade session management and data protection",
    accent: false,
  },
];

const metrics = [
  { label: "Communication", value: 85, color: "from-orange-500 to-red-500" },
  { label: "Technical Knowledge", value: 78, color: "from-orange-500 to-red-500" },
  { label: "Confidence", value: 92, color: "from-violet-500 to-purple-500" },
  { label: "Problem Solving", value: 88, color: "from-purple-500 to-pink-500" },
];

// Smooth easing for enterprise feel
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsInView = useInView(metricsRef, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: smoothEase,
      },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Soft gradient background with light diffusion */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(59, 130, 246, 0.02) 100%)",
          }}
        />
        
        {/* Light diffusion orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
          >
            <Zap className="w-4 h-4" />
            Premium Features
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
              ace your interview
            </span>
          </h2>
          
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          >
            Our AI-powered platform combines cutting-edge technology with proven interview techniques 
            to help you succeed.
          </motion.p>
        </motion.div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Features List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-3"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={featureVariants}
                  className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/5 ${
                    feature.accent ? "bg-gradient-to-r from-orange-500/5 to-transparent border-l-2 border-orange-500" : ""
                  }`}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon with hover animation */}
                  <motion.div
                    className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                      feature.accent 
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                    } transition-all duration-300`}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-foreground mb-0.5 ${feature.accent ? "text-orange-700 dark:text-orange-300" : ""}`}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover accent glow for highlighted features */}
                  {feature.accent && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Side - Metrics Card */}
          <div ref={metricsRef} className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={metricsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.7, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              {/* Background glow */}
              <div 
                className="absolute -inset-4 rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />

              {/* Card */}
              <div className="relative rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-orange-500/10 overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Performance Analytics</h4>
                        <p className="text-xs text-muted-foreground">Real-time interview metrics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
                    </div>
                  </div>
                </div>

                {/* Metrics content */}
                <div className="p-6 space-y-6">
                  {/* Overall Score */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={metricsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
                    className="text-center py-4"
                  >
                    <div className="relative inline-flex items-center justify-center">
                      {/* Background ring */}
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-slate-200 dark:text-slate-700"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 352" }}
                          animate={metricsInView ? { strokeDasharray: "302 352" } : { strokeDasharray: "0 352" }}
                          transition={{ duration: 1.5, delay: 0.5, ease: smoothEase }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                          className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                          initial={{ opacity: 0 }}
                          animate={metricsInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.5, delay: 1, ease: smoothEase }}
                        >
                          8.6
                        </motion.span>
                        <span className="text-xs text-muted-foreground font-medium">Overall Score</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress bars */}
                  <div className="space-y-4">
                    {metrics.map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={metricsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: smoothEase }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{metric.label}</span>
                          <motion.span 
                            className="text-sm font-semibold text-orange-600 dark:text-orange-400"
                            initial={{ opacity: 0 }}
                            animate={metricsInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.3, delay: 1 + idx * 0.1, ease: smoothEase }}
                          >
                            {metric.value}%
                          </motion.span>
                        </div>
                        <div className="h-2.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${metric.color} relative`}
                            initial={{ width: 0 }}
                            animate={metricsInView ? { width: `${metric.value}%` } : { width: 0 }}
                            transition={{ duration: 1.2, delay: 0.8 + idx * 0.1, ease: smoothEase }}
                          >
                            {/* Glow effect on bar */}
                            <div 
                              className="absolute inset-0 rounded-full opacity-50"
                              style={{
                                boxShadow: "0 0 12px currentColor",
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom stats */}
                  <motion.div
                    className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={metricsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, delay: 1.2, ease: smoothEase }}
                  >
                    {[
                      { label: "Questions", value: "12" },
                      { label: "Duration", value: "18m" },
                      { label: "Accuracy", value: "94%" },
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                        <div className="text-lg font-bold text-foreground">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-medium text-muted-foreground">Improving 23% from last session</span>
                    </div>
                    <motion.button
                      className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      View Details →
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

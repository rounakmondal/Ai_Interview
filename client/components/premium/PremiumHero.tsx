import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, easeInOut } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

export default function PremiumHero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Floating animation for avatar
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  // Text reveal animation
  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Staggered container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[calc(100vh-10rem)] overflow-hidden pt-1 sm:pt-6 flex items-center"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={textRevealVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 w-fit"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Interview Prep
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={textRevealVariants} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">Practice Real</span>
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Interviews with AI
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div variants={textRevealVariants}>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
  Experience a realistic mock interview with AI-powered feedback, voice interaction, and real-time coaching. Master your interview skills in minutes.
</p>

            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={textRevealVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/setup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="gradient-primary text-lg px-8 h-12 font-semibold gap-2">
                    Start AI Mock Interview
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="text-lg px-8 h-12 font-semibold gap-2 border-primary/20"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={textRevealVariants}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/40"
            >
              {[
                { value: "50K+", label: "Users" },
                { value: "95%", label: "Success Rate" },
                { value: "24/7", label: "Available" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual - Avatar with Floating Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative h-96 sm:h-[600px] hidden lg:flex items-center justify-center"
          >
            {/* Floating background elements */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-3xl"
            />

            {/* Main Avatar Container */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative z-10 w-72 h-96 rounded-2xl overflow-hidden shadow-2xl border border-primary/20"
            >
              <img
                src="/Gemini_Generated_Image_9cu79a9cu79a9cu7.png"
                alt="AI Interviewer"
                className="w-full h-full object-cover"
              />

              {/* Animated glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/0 via-transparent to-primary/0 pointer-events-none" />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-40 h-40 border border-primary/20 rounded-full pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 w-32 h-32 border border-secondary/20 rounded-full pointer-events-none"
            />

            {/* Feature pills floating around avatar */}
            {[
              { label: "Voice Input", delay: 0 },
              { label: "Real-time Feedback", delay: 0.5 },
              { label: "AI Powered", delay: 1 },
            ].map((pill, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: pill.delay,
                }}
                className={`absolute px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium backdrop-blur-sm ${
                  idx === 0
                    ? "top-20 left-0"
                    : idx === 1
                      ? "bottom-40 right-0"
                      : "top-1/2 left-0"
                }`}
              >
                {pill.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Scroll to explore</p>
          <div className="w-6 h-10 border border-primary/40 rounded-full flex items-start justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-primary"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

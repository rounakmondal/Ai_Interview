import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PremiumCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Subtle pulse state for CTA button
  const [showPulse, setShowPulse] = useState(false);
  
  useEffect(() => {
    // Initial delay before first pulse
    const initialDelay = setTimeout(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1200);
    }, 2000);
    
    // Recurring pulse every 5 seconds
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1200);
    }, 5000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  // Realistic easing - no bounce, smooth deceleration
  const smoothEase = [0.25, 0.1, 0.25, 1] as const;
  const subtleEase = [0.4, 0, 0.2, 1] as const;

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Soft gradient background with depth */}
      <div className="absolute inset-0 -z-20">
        {/* Base gradient - primary fading to transparent */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(59, 130, 246, 0.02) 100%)",
          }}
        />
        
        {/* Subtle depth layers */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Animated gradient glow - very slow, alive but not distracting */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Primary ambient glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.08, 1.02, 1],
            x: ["-50%", "-48%", "-52%", "-50%"],
            y: ["-50%", "-52%", "-48%", "-50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Secondary accent glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(59, 130, 246, 0.12) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 0.95, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Top subtle divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: smoothEase }}
      />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline - appears first */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.9,
              ease: smoothEase,
              delay: 0.1,
            }}
          >
            Ready to ace your next{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                interview
              </span>
              {/* Subtle underline accent */}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6))",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.6 }}
              />
            </span>
            ?
          </motion.h2>

          {/* Subtitle - appears with delay */}
          <motion.p
            className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              ease: smoothEase,
              delay: 0.35,
            }}
          >
            Join thousands of professionals who've transformed their interview skills 
            with AI-powered practice. Your dream job is one conversation away.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.7,
              ease: smoothEase,
              delay: 0.55,
            }}
          >
            {/* Primary CTA with pulse */}
            <div className="relative">
              {/* Pulse glow effect - subtle and natural */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4))",
                }}
                animate={showPulse ? {
                  scale: [1, 1.3, 1.5],
                  opacity: [0.4, 0.15, 0],
                } : { scale: 1, opacity: 0 }}
                transition={{ 
                  duration: 1.2, 
                  ease: subtleEase,
                }}
              />
              
              <Link to="/setup">
                <motion.button
                  className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 flex items-center gap-3 group"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: subtleEase }}
                >
                  <Sparkles className="w-5 h-5 opacity-80" />
                  <span>Start Practicing Free</span>
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </motion.span>
                </motion.button>
              </Link>
            </div>

            {/* Secondary CTA */}
            <Link to="#features">
              <motion.button
                className="px-8 py-4 rounded-xl bg-background border border-border/60 text-foreground font-medium text-lg hover:bg-muted/50 hover:border-border transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: subtleEase }}
              >
                See How It Works
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: smoothEase,
              delay: 0.8,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>5-minute setup</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom subtle divider */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: smoothEase, delay: 0.3 }}
      />
    </section>
  );
}

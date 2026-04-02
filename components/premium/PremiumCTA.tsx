import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PremiumCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const [showPulse, setShowPulse] = useState(false);
  
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1200);
    }, 2000);
    
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1200);
    }, 5000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const smoothEase = [0.25, 0.1, 0.25, 1] as const;

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#0a0a0a]"
    >
      {/* 1. Background: 90deg Orange to Red subtle wash */}
      <div className="absolute inset-0 -z-20">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(249, 115, 22, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)",
          }}
        />
      </div>

      {/* 2. Ambient Glow: Orange to Red (No Purple) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 3. Top Divider Line: Orange focus */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.4), transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* 4. Headline: 90deg Gradient Text (Orange to Red) */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            Ready to ace your next{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                interview
              </span>
              {/* 5. Underline: 90deg Orange to Red */}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #f97316, #ef4444)",
                }}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
            ?
          </motion.h2>

          <motion.p
            className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of professionals who've transformed their interview skills 
            with AI-powered practice. Your dream job is one conversation away.
          </motion.p>

          {/* 6. Main CTA Button Section */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative">
              {/* 7. Pulse Effect: 90deg Orange to Red */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(90deg, #f97316, #ef4444)",
                }}
                animate={showPulse ? {
                  scale: [1, 1.4],
                  opacity: [0.4, 0],
                } : { scale: 1, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              
              <Link to="/setup">
                <motion.button
                  className="relative px-10 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20 flex items-center gap-3 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5 text-orange-100" />
                  <span>Start Practicing Free</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </div>

            <Link to="#features">
              <motion.button
                className="px-10 py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-medium text-lg hover:bg-neutral-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                See How It Works
              </motion.button>
            </Link>
          </div>

          {/* 8. Trust Dots: Orange Only */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-xs text-neutral-500 uppercase tracking-widest font-semibold">
            {["No credit card", "5-minute setup", "Cancel anytime"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Bottom Divider: 90deg subtle orange-red */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3), transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
    </section>
  );
}
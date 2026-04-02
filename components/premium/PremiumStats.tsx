import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Users, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    display: "Free",
    suffix: "",
    label: "Free to Start",
    sub: "no credit card required",
    color: "from-orange-400 to-red-500",
    bg: "bg-orange-500/10",
    iconColor: "#fb923c", // orange-400
  },
  {
    icon: TrendingUp,
    display: "AI",
    suffix: "",
    label: "Powered Feedback",
    sub: "instant, personalized coaching",
    color: "from-orange-500 to-red-600",
    bg: "bg-red-500/10",
    iconColor: "#ef4444", // red-500
  },
  {
    icon: Award,
    display: "4",
    suffix: "+",
    label: "Languages Supported",
    sub: "English, Hindi, Bengali, Telugu",
    color: "from-orange-600 to-red-700",
    bg: "bg-orange-600/10",
    iconColor: "#ea580c", // orange-600
  },
  {
    icon: Clock,
    display: "24",
    suffix: "/7",
    label: "Always Available",
    sub: "practice any time, anywhere",
    color: "from-red-400 to-orange-500",
    bg: "bg-red-400/10",
    iconColor: "#f87171", // red-400
  },
];

function StatDisplay({ display, suffix }: { display: string; suffix: string }) {
  return <span>{display}{suffix}</span>;
}

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-12 sm:py-16 overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* Warm Ambient Background (No Purple) */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top Animated Divider (Orange-Red Gradient) */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #f97316, #ef4444, transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built to help you{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: smoothEase }}
                className="group relative bg-white dark:bg-slate-900 border border-orange-500/10 dark:border-orange-500/20 rounded-2xl p-6 text-center flex flex-col items-center gap-3 hover:border-orange-500/40 transition-all duration-300 shadow-lg shadow-orange-500/5"
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300 relative z-10`}>
                  <Icon 
                    size={24} 
                    style={{ color: stat.iconColor }} 
                    strokeWidth={2.5}
                  />
                </div>

                {/* Stat Number - Orange to Red Gradient */}
                <div className={`text-3xl lg:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent relative z-10`}>
                  <StatDisplay display={stat.display} suffix={stat.suffix} />
                </div>

                {/* Labels */}
                <div className="relative z-10">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide">{stat.label}</p>
                  <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 mt-1">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
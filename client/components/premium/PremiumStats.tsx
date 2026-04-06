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
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    display: "AI",
    suffix: "",
    label: "Powered Feedback",
    sub: "instant, personalized coaching",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Award,
    display: "4",
    suffix: "+",
    label: "Languages Supported",
    sub: "English, Hindi, Bengali, Telugu",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
  },
  {
    icon: Clock,
    display: "24",
    suffix: "/7",
    label: "Always Available",
    sub: "practice any time, anywhere",
    color: "from-violet-500 to-purple-600",
    bg: "bg-orange-500/10",
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
      className="relative py-10 sm:py-12 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(59,130,246,0.03) 100%)",
          }}
        />
        <div className="absolute inset-0 dark:bg-slate-900/50" />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Built to help you{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: smoothEase }}
                className="bg-card border border-border/50 rounded-2xl p-6 text-center flex flex-col items-center gap-3 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ color: "hsl(var(--indigo-500, 239 84% 67%))" }} />
                </div>
                <div className={`text-3xl lg:text-4xl font-extrabold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  <StatDisplay display={stat.display} suffix={stat.suffix} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

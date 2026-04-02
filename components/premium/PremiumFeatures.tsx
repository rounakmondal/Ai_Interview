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
  { icon: Mic, title: "Professional AI Interviewer", description: "Realistic voice-driven conversations with our intelligent interviewer avatar", accent: true },
  { icon: MessageSquare, title: "Real-time Voice Interaction", description: "Natural speech recognition and instant audio feedback", accent: false },
  { icon: Globe, title: "Multiple Languages & Types", description: "Government, Private, IT, and Non-IT interviews in your preferred language", accent: false },
  { icon: BarChart3, title: "Detailed Performance Metrics", description: "Comprehensive scoring across communication, technical, and confidence", accent: true },
  { icon: Brain, title: "Intelligent Follow-ups", description: "Dynamic cross-questioning based on your responses", accent: false },
  { icon: Lightbulb, title: "Personalized Coaching", description: "Actionable improvement suggestions tailored to your performance", accent: false },
  { icon: Clock, title: "24/7 Availability", description: "Practice anytime, anywhere at your own pace", accent: false },
  { icon: Shield, title: "Secure & Private", description: "Enterprise-grade session management and data protection", accent: false },
];

const metrics = [
  { label: "Communication", value: 85, color: "from-orange-400 to-orange-600" },
  { label: "Technical Knowledge", value: 78, color: "from-orange-500 to-red-500" },
  { label: "Confidence", value: 92, color: "from-orange-500 to-red-600" },
  { label: "Problem Solving", value: 88, color: "from-red-500 to-red-700" },
];

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumFeatures() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const metricsRef = useRef(null);
  const metricsInView = useInView(metricsRef, { once: true, margin: "-50px" });

  return (
    <section ref={sectionRef} className="relative py-12 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 via-orange-100/20 to-red-50/30" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Premium Features
          </span>

          <h2 className="text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent">
              ace your interview
            </span>
          </h2>

          <p className="text-muted-foreground">
            AI-powered platform to boost your interview performance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx}
                  className={`group flex gap-4 p-4 rounded-xl transition ${
                    feature.accent 
                    ? "bg-orange-500/5 border-l-2 border-orange-500"
                    : "hover:bg-orange-50/40"
                  }`}
                >
                  <div className={`w-11 h-11 flex items-center justify-center rounded-lg ${
                    feature.accent
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                    : "bg-slate-100 group-hover:bg-orange-100 text-slate-600 group-hover:text-orange-600"
                  }`}>
                    <Icon className="w-5 h-5"/>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${
                      feature.accent ? "text-orange-700 dark:text-orange-300" : ""
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Metrics Card */}
          <div ref={metricsRef}>
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">

              {/* Header */}
              <div className="p-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                    <TrendingUp />
                  </div>
                  <div>
                    <h4 className="font-semibold">Performance Analytics</h4>
                    <p className="text-xs text-muted-foreground">Real-time metrics</p>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="p-6 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  8.6
                </div>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>

              {/* Progress */}
              <div className="px-6 pb-6 space-y-4">
                {metrics.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{m.label}</span>
                      <span className="text-orange-600">{m.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${m.color}`} style={{width: `${m.value}%`}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500"/>
                  <span className="text-xs text-muted-foreground">Improving 23%</span>
                </div>
                <button className="text-xs text-orange-600 hover:text-orange-700">
                  View →
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
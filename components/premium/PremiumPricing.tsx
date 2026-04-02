import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Star, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    badge: null,
    price: { monthly: "Free", yearly: "Free" },
    description: "Perfect for first-time job seekers getting started.",
    color: "border-border/50",
    btnVariant: "outline" as const,
    btnClass: "",
    features: [
      "3 mock interviews per month",
      "Basic performance report",
      "English language only",
      "AI-generated questions",
      "Voice recognition",
    ],
    notIncluded: [
      "Resume upload & parsing",
      "Custom job descriptions",
      "Unlimited interviews",
    ],
  },
  {
    name: "Pro",
    badge: "Most Popular",
    price: { monthly: "₹499", yearly: "₹399" },
    description: "For serious candidates who want to stand out.",
    color: "border-orange-500/50",
    btnVariant: "default" as const,
    btnClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white border-0",
    features: [
      "Unlimited mock interviews",
      "Full performance analytics",
      "4 languages (EN, HI, BN, TE)",
      "Resume upload & CV analysis",
      "Custom job descriptions",
      "Follow-up question engine",
      "Detailed strengths & weaknesses",
      "Priority response time",
    ],
    notIncluded: [],
  },
  {
    name: "Enterprise",
    badge: "For Teams",
    price: { monthly: "Custom", yearly: "Custom" },
    description: "For colleges, coaching institutes, and corporates.",
    color: "border-neutral-800",
    btnVariant: "outline" as const,
    btnClass: "border-neutral-800 hover:border-orange-500/50",
    features: [
      "Everything in Pro",
      "Unlimited team seats",
      "Bulk student management",
      "Custom branding & domain",
      "API access",
      "Interview analytics dashboard",
      "Dedicated account manager",
      "SLA & priority support",
    ],
    notIncluded: [],
  },
];

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumPricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-20 px-6 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(249,115,22,0.05) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* 1. Pill Badge */}
        <motion.span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-neutral-800 text-sm font-medium mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
        >
          <Zap className="w-4 h-4 text-orange-500 fill-orange-500/20" />
          <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Simple Pricing
          </span>
        </motion.span>

        {/* 2. Main Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
          Invest in your{" "}
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            career success
          </span>
        </h2>

        {/* 3. Subtext */}
        <p className="text-lg text-neutral-400 max-w-2xl mb-10">
          Start free and upgrade when you're ready. No hidden charges.
        </p>

        {/* 4. Billing Toggle */}
        <motion.div
          className="inline-flex items-center gap-1 bg-neutral-900/50 border border-neutral-800 rounded-full p-1.5 mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !isYearly ? "bg-neutral-800 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              isYearly ? "bg-neutral-800 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Yearly
            <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save 20%
            </span>
          </button>
        </motion.div>

        {/* 5. Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 w-full">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.15 + idx * 0.1, ease: smoothEase }}
              className={`relative bg-neutral-900/40 border-2 ${plan.color} rounded-2xl p-6 lg:p-8 flex flex-col gap-6 ${
                plan.name === "Pro" ? "shadow-xl shadow-orange-500/10 lg:scale-105 lg:z-10 border-orange-500/50" : "border-neutral-800"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-md shadow-orange-500/30 whitespace-nowrap">
                    {plan.name === "Pro" && <Star className="w-3 h-3 fill-white" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly !== "Free" && plan.price.monthly !== "Custom" && (
                    <span className="text-neutral-500 text-sm mb-1">/month</span>
                  )}
                </div>
                <p className="text-sm text-neutral-400">{plan.description}</p>
              </div>

              <Link to={plan.name === "Enterprise" ? "#contact" : "/setup"} className="block">
                <button
                  className={`w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    plan.name === "Pro" 
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90" 
                    : "bg-neutral-800 text-white hover:bg-neutral-700"
                  } ${plan.btnClass}`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : plan.name === "Starter" ? "Start Free" : "Get Pro"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <div className="space-y-3 pt-2 border-t border-neutral-800 text-left">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.name === "Pro" ? "bg-orange-500/15" : "bg-neutral-800"}`}>
                      <Check className={`w-3 h-3 ${plan.name === "Pro" ? "text-orange-500" : "text-neutral-500"}`} />
                    </div>
                    <span className="text-sm text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 6. Footer Note */}
        <motion.p
          className="text-center text-sm text-neutral-500 mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          🔒 Secure payments via Razorpay · Cancel anytime · No contracts
        </motion.p>
      </div>
    </section>
  );
}
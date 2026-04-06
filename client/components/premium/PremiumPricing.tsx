import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    color: "border-orange-500",
    btnVariant: "default" as const,
    btnClass: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0",
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
    color: "border-orange-500/50",
    btnVariant: "outline" as const,
    btnClass: "border-orange-500/50 hover:border-orange-500",
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
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.04) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[700px] h-[500px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 dark:bg-slate-900/30" />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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
            Simple Pricing
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Invest in your{" "}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
              career success
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. No hidden charges.
          </p>

          {/* Billing toggle */}
          <motion.div
            className="inline-flex items-center gap-3 mt-8 bg-muted/50 border border-border/50 rounded-full p-1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${!isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                Save 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.15 + idx * 0.1, ease: smoothEase }}
              className={`relative bg-card border-2 ${plan.color} rounded-2xl p-6 lg:p-8 flex flex-col gap-6 ${plan.name === "Pro" ? "shadow-xl shadow-orange-500/10 lg:scale-105 lg:z-10" : ""}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-md shadow-orange-500/30 whitespace-nowrap">
                    {plan.name === "Pro" && <Star className="w-3 h-3 fill-white" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    {isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly !== "Free" && plan.price.monthly !== "Custom" && (
                    <span className="text-muted-foreground text-sm mb-1">/month</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* CTA button */}
              <Link to={plan.name === "Enterprise" ? "#contact" : "/setup"} className="block">
                <Button
                  variant={plan.btnVariant}
                  className={`w-full h-11 font-semibold gap-2 ${plan.btnClass}`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : plan.name === "Starter" ? "Start Free" : "Get Pro"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {/* Features list */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.name === "Pro" ? "bg-orange-500/15" : "bg-muted"}`}>
                      <Check className={`w-3 h-3 ${plan.name === "Pro" ? "text-orange-500" : "text-foreground/60"}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 opacity-40">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-muted">
                      <div className="w-2 h-px bg-current" />
                    </div>
                    <span className="text-sm text-muted-foreground line-through">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-10"
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

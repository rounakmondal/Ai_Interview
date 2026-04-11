import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Star, Lock, FileDown, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "@/hooks/use-razorpay";
import { getSession } from "@/lib/auth-api";
import { useNavigate } from "react-router-dom";

export type PaywallContext = "test" | "pdf";

interface Props {
  open: boolean;
  onClose: () => void;
  /** The exam being attempted (shown on single-exam card) */
  examType?: string;
  /** "test" = attempting a test, "pdf" = downloading pdf */
  context?: PaywallContext;
  /** Called when payment is successful */
  onSuccess?: (plan: string) => void;
}

const PLANS = [
  {
    id: "single_exam" as const,
    label: "Single Exam Pass",
    price: "₹9",
    period: "one-time",
    icon: <BookOpen className="w-5 h-5" />,
    color: "border-blue-500/40",
    badge: null,
    badgeBg: "",
    btnClass: "border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    btnVariant: "outline" as const,
    description: "Unlock one specific exam forever.",
    features: ["Unlimited tests for this exam", "Instant AI scoring", "Full analytics"],
    notFor: ["Other exams", "PDF downloads"],
    contextOk: ["test"],
  },
  {
    id: "monthly_pass" as const,
    label: "All Exams Pass",
    price: "₹29",
    period: "/ month",
    icon: <Zap className="w-5 h-5" />,
    color: "border-orange-500",
    badge: "Most Popular",
    badgeBg: "bg-gradient-to-r from-orange-500 to-red-500",
    btnClass:
      "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0",
    btnVariant: "default" as const,
    description: "Unlimited access to every exam on MedhaHub.",
    features: ["All exams unlocked", "Unlimited tests", "AI scoring + analytics", "4 language support"],
    notFor: ["PDF downloads"],
    contextOk: ["test", "pdf"],
  },
  {
    id: "pro_monthly" as const,
    label: "Pro Plan",
    price: "₹99",
    period: "/ month",
    icon: <Star className="w-5 h-5" />,
    color: "border-violet-500/60",
    badge: "Best Value",
    badgeBg: "bg-gradient-to-r from-violet-600 to-indigo-600",
    btnClass:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0",
    btnVariant: "default" as const,
    description: "Everything unlocked — including PDF download.",
    features: [
      "All exams unlocked",
      "Unlimited tests",
      "AI scoring + analytics",
      "PDF download (results & papers)",
      "4 language support",
      "Priority support",
    ],
    notFor: [],
    contextOk: ["test", "pdf"],
  },
];

export default function PaywallModal({ open, onClose, examType = "", context = "test", onSuccess }: Props) {
  const navigate = useNavigate();
  const session = getSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { initiatePayment } = useRazorpay({
    authToken: session?.token ?? null,
    userEmail: session?.user?.email,
    userName: session?.user?.name,
    onSuccess: (plan) => {
      setLoadingPlan(null);
      onSuccess?.(plan);
      onClose();
    },
    onError: (msg) => {
      setLoadingPlan(null);
      setError(msg);
    },
  });

  async function handleBuy(planId: "single_exam" | "monthly_pass" | "pro_monthly") {
    if (!session) {
      navigate("/auth");
      return;
    }
    setError(null);
    setLoadingPlan(planId);
    await initiatePayment(planId, planId === "single_exam" ? examType : undefined);
    setLoadingPlan(null);
  }

  // Highlight the plan that makes sense for context (pdf → pro)
  const suggestedId = context === "pdf" ? "pro_monthly" : "monthly_pass";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="relative w-full sm:max-w-4xl max-h-[95dvh] overflow-y-auto bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Orange accent top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-red-500 to-violet-600" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-4 sm:px-8 pt-6 pb-8">
              {/* Header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground leading-tight">
                    {context === "pdf" ? "Unlock PDF Download" : "Unlock More Tests"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {context === "pdf"
                      ? "PDF download is a Pro feature. Choose a plan to continue."
                      : examType
                      ? `Continue practising ${examType} — pick a plan that fits you.`
                      : "You've used your free test. Pick a plan to keep practising."}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Plans grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PLANS.map((plan) => {
                  const isSuggested = plan.id === suggestedId;
                  const isLoading = loadingPlan === plan.id;
                  const disabled = loadingPlan !== null;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl border-2 ${plan.color} p-5 flex flex-col gap-3.5 ${
                        isSuggested ? "shadow-xl" : ""
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white ${plan.badgeBg} whitespace-nowrap shadow`}
                          >
                            {plan.id === "monthly_pass" && <Zap className="w-3 h-3" />}
                            {plan.id === "pro_monthly" && <Star className="w-3 h-3 fill-white" />}
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">{plan.icon}</span>
                        <span className="font-bold text-foreground">{plan.label}</span>
                      </div>

                      <div className="flex items-end gap-1.5">
                        <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                        <span className="text-sm text-muted-foreground mb-1">{plan.period}</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-snug">{plan.description}</p>

                      <ul className="space-y-2 text-sm flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-foreground/80">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                        {plan.notFor.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-muted-foreground/40 line-through">
                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Button
                        size="default"
                        variant={plan.btnVariant}
                        className={`w-full gap-2 mt-2 font-semibold ${plan.btnClass}`}
                        onClick={() => handleBuy(plan.id)}
                        disabled={disabled}
                      >
                        {isLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                        ) : plan.id === "single_exam" && examType ? (
                          <>Unlock {examType} – ₹9</>
                        ) : (
                          <>Get {plan.label}</>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* PDF note */}
              {context === "pdf" && (
                <p className="mt-5 text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                  <FileDown className="w-4 h-4" />
                  PDF downloads are available only on the Pro Plan (₹99/month)
                </p>
              )}

              <p className="mt-4 text-center text-xs text-muted-foreground">
                🔒 Secure payments via Razorpay · Cancel anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">{plan.icon}</span>
                        <span className="text-sm font-bold text-foreground">{plan.label}</span>
                      </div>

                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-extrabold text-foreground">{plan.price}</span>
                        <span className="text-xs text-muted-foreground mb-0.5">{plan.period}</span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-snug">{plan.description}</p>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                🔒 Secure payments via Razorpay · Cancel anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

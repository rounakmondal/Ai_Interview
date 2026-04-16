import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { X, Check, Zap, Star, Lock, FileDown, BookOpen, Loader2, Tag, ChevronRight, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "@/hooks/use-razorpay";
import { getSession } from "@/lib/auth-api";
import { useNavigate } from "react-router-dom";

export type PaywallContext = "test" | "pdf" | "interview" | "recommendation";

interface Props {
  open: boolean;
  onClose: () => void;
  /** The exam being attempted (shown on single-exam card) */
  examType?: string;
  /** "test" = attempting a test, "pdf" = downloading pdf, "interview" = AI interview, "recommendation" = AI recommendations */
  context?: PaywallContext;
  /** Called when payment is successful */
  onSuccess?: (plan: string) => void;
}

const TEST_PLANS = [
  {
    id: "single_test" as const,
    label: "This Test Only",
    price: "₹9",
    period: "one-time",
    icon: <BookOpen className="w-5 h-5" />,
    color: "border-blue-500/40",
    badge: null,
    badgeBg: "",
    btnClass: "border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    btnVariant: "outline" as const,
    description: "Unlock 1 mock test. Full analytics included.",
    features: ["1 mock test unlock", "Full analytics & scoring", "Subject-wise breakdown"],
    notFor: ["Other tests", "PDF downloads", "AI recommendations"],
    contextOk: ["test"],
  },
  {
    id: "single_exam" as const,
    label: "Single Exam Pass",
    price: "₹29",
    period: "/ month",
    icon: <Zap className="w-5 h-5" />,
    color: "border-orange-500",
    badge: "Most Popular",
    badgeBg: "bg-gradient-to-r from-orange-500 to-red-500",
    btnClass:
      "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0",
    btnVariant: "default" as const,
    description: "Unlimited tests for one exam + AI recommendations.",
    features: ["Unlimited tests (1 exam)", "Full analytics & scoring", "AI recommendations", "Weak area practice"],
    notFor: ["Other exams", "PDF downloads"],
    contextOk: ["test", "recommendation"],
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
    description: "Everything unlocked — all exams, PDF, recommendations.",
    features: [
      "All exams unlocked",
      "Unlimited tests",
      "Full analytics & AI scoring",
      "AI recommendations",
      "PDF download (results & papers)",
      "Priority support",
    ],
    notFor: [],
    contextOk: ["test", "pdf", "recommendation"],
  },
];

const INTERVIEW_PLANS = [
  {
    id: "ai_interview_single" as const,
    label: "This Company",
    price: "₹19",
    period: "one-time",
    icon: <Mic className="w-5 h-5" />,
    color: "border-emerald-500/40",
    badge: null,
    badgeBg: "",
    btnClass: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    btnVariant: "outline" as const,
    description: "1 AI mock interview for this company.",
    features: ["1 mock interview", "Voice-based AI feedback", "Detailed evaluation"],
    notFor: ["Other companies"],
    contextOk: ["interview"],
  },
  {
    id: "ai_interview_all" as const,
    label: "All 200 Companies",
    price: "₹11",
    period: "/ month",
    icon: <Sparkles className="w-5 h-5" />,
    color: "border-amber-500",
    badge: "Save 99.7%",
    badgeBg: "bg-gradient-to-r from-amber-500 to-orange-500",
    btnClass:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0",
    btnVariant: "default" as const,
    description: "Unlimited AI interviews — every company, all month.",
    features: ["All 200+ companies", "Unlimited interviews", "Voice AI feedback", "Detailed evaluations"],
    notFor: [],
    contextOk: ["interview"],
  },
];

type AnyPlanId = "single_test" | "single_exam" | "pro_monthly" | "ai_interview_single" | "ai_interview_all";

export default function PaywallModal({ open, onClose, examType = "", context = "test", onSuccess }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/api$/, '');
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; label: string } | null>(null);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    setAppliedCoupon(null);
    try {
      const res = await fetch(`${API_BASE}/api/coupon/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const json = await res.json();
      if (!json.success) {
        setCouponError(json.message || 'Invalid coupon.');
      } else {
        setAppliedCoupon({ code: json.code, label: json.label });
      }
    } catch {
      setCouponError('Could not validate coupon.');
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  }

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

  async function handleBuy(planId: AnyPlanId) {
    if (!session) {
      navigate("/auth", { state: { redirect: location.pathname + location.search } });
      return;
    }
    setError(null);
    setLoadingPlan(planId);
    const needsExamType = planId === "single_exam" || planId === "single_test" || planId === "ai_interview_single";
    await initiatePayment(planId, needsExamType ? examType : undefined, appliedCoupon?.code);
    setLoadingPlan(null);
  }

  // Choose which plans to show based on context
  const isInterview = context === "interview";
  const plans = isInterview ? INTERVIEW_PLANS : TEST_PLANS;

  // Highlight the plan that makes sense for context
  const suggestedId = context === "pdf"
    ? "pro_monthly"
    : context === "recommendation"
    ? "single_exam"
    : context === "interview"
    ? "ai_interview_all"
    : "single_exam";

  // Header text by context
  const headerTitle = context === "pdf"
    ? "Unlock PDF Download"
    : context === "interview"
    ? "Unlock AI Interview"
    : context === "recommendation"
    ? "Unlock AI Recommendations"
    : "Unlock More Tests";

  const headerDescription = context === "pdf"
    ? "PDF download is a Pro feature. Choose a plan to continue."
    : context === "interview"
    ? examType
      ? `Practice AI mock interview for ${examType}. Pick a plan.`
      : "AI interviews help you prepare for real company interviews."
    : context === "recommendation"
    ? "Get AI-powered study recommendations to improve faster."
    : examType
    ? `Continue practising ${examType} — pick a plan that fits you.`
    : "You've used your free test. Pick a plan to keep practising.";

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
                    {headerTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {headerDescription}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Coupon code input */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex-1">
                      {appliedCoupon.code} — {appliedCoupon.label} applied!
                    </span>
                    <button onClick={handleRemoveCoupon} className="text-emerald-600 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Have a coupon code?"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-muted-foreground/60 uppercase tracking-wider"
                      />
                    </div>
                    <Button
                      size="default"
                      variant="outline"
                      className="gap-1.5 shrink-0 border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ChevronRight className="w-4 h-4" />Apply</>}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-1.5 text-xs text-red-500 pl-1">{couponError}</p>
                )}
              </div>

              {/* Plans grid */}
              <div className={`grid grid-cols-1 ${plans.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                {plans.map((plan) => {
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
                        onClick={() => handleBuy(plan.id as AnyPlanId)}
                        disabled={disabled}
                      >
                        {isLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                        ) : plan.id === "single_test" ? (
                          <>Buy This Test – ₹9</>
                        ) : plan.id === "single_exam" && examType ? (
                          <>Unlock {examType} – ₹29/mo</>
                        ) : plan.id === "ai_interview_single" && examType ? (
                          <>{examType} Interview – ₹19</>
                        ) : plan.id === "ai_interview_all" ? (
                          <>All Companies – ₹11/mo</>
                        ) : (
                          <>Get {plan.label}</>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Context-specific note */}
              {context === "pdf" && (
                <p className="mt-5 text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                  <FileDown className="w-4 h-4" />
                  PDF downloads are available only on the Pro Plan (₹99/month)
                </p>
              )}
              {context === "interview" && (
                <p className="mt-5 text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  200 companies × ₹19 = ₹3,800 — Get all for just ₹11. Save 99.7%
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
}

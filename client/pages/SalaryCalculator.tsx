import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  IndianRupee,
  Calculator,
  Copy,
  Check,
  Building2,
  TrendingUp,
  Briefcase,
  BookOpen,
} from "lucide-react";
import RelatedToolsBanner from "@/components/RelatedToolsBanner";

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Government Job Salary Calculator 2026 — 7th Pay Commission | MedhaHub";

  const desc = "Calculate government job salary after 7th Pay Commission. Find in-hand salary for SSC CGL, WBCS, IBPS PO, Railway, UPSC & more. Includes basic pay, DA, HRA, TA, NPS deduction & gross/net salary breakdown.";

  const kw = [
    "government salary calculator", "7th pay commission salary calculator",
    "ssc cgl salary 2026", "wbcs salary after 7th pay commission",
    "ibps po salary", "upsc salary", "railway salary calculator",
    "ssc chsl salary", "wbpsc clerkship salary", "wb police salary",
    "govt job salary calculator", "basic pay calculator 7th pay",
    "da hra calculation", "in hand salary govt job",
    "level pay matrix", "pay band calculator",
    "central government salary 2026", "state government salary calculator",
    "nps deduction calculator", "gross salary net salary govt",
  ].join(", ");

  const url = "https://medhahub.in/salary-calculator";

  function upsert(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (el) el.content = content;
    else { el = document.createElement("meta"); el.setAttribute(attr, key); el.content = content; document.head.appendChild(el); }
  }

  upsert("name", "description", desc);
  upsert("name", "keywords", kw);
  upsert("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsert("property", "og:type", "website");
  upsert("property", "og:url", url);
  upsert("property", "og:site_name", "MedhaHub");
  upsert("property", "og:title", "Govt Salary Calculator — 7th Pay Commission 2026 | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Govt Job Salary Calculator 2026 | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Pay Data ─────────────────────────────────────────────────────────────────

interface PostProfile {
  name: string;
  level: number;
  basicPay: number;
  gradePayOld?: number;
  category: "central" | "state-wb" | "banking";
  description: string;
}

const POSTS: PostProfile[] = [
  // Central Government
  { name: "SSC CGL (Group B) — Assistant", level: 7, basicPay: 44900, category: "central", description: "Assistant Section Officer in Central Ministries" },
  { name: "SSC CGL (Group C) — Tax Asst.", level: 4, basicPay: 25500, category: "central", description: "Tax Assistant in CBDT/CBIC" },
  { name: "SSC CHSL — LDC/DEO", level: 2, basicPay: 19900, category: "central", description: "Lower Division Clerk / Data Entry Operator" },
  { name: "SSC MTS — Multi Tasking Staff", level: 1, basicPay: 18000, category: "central", description: "Group C MTS in Central Govt" },
  { name: "RRB NTPC — Station Master", level: 6, basicPay: 35400, category: "central", description: "Station Master in Indian Railways" },
  { name: "RRB NTPC — Ticket Clerk", level: 3, basicPay: 21700, category: "central", description: "Ticket Collector / Clerk in Railways" },
  { name: "Railway Group D", level: 1, basicPay: 18000, category: "central", description: "Track Maintainer, Helper, Porter" },
  { name: "UPSC CSE — IAS (Junior Scale)", level: 10, basicPay: 56100, category: "central", description: "IAS officer starting level" },
  { name: "UPSC CSE — IPS (Junior Scale)", level: 10, basicPay: 56100, category: "central", description: "IPS officer starting level" },
  { name: "CTET Qualified — PRT", level: 6, basicPay: 35400, category: "central", description: "Primary Teacher in KVS/NVS" },
  { name: "CTET Qualified — TGT", level: 7, basicPay: 44900, category: "central", description: "Trained Graduate Teacher in KVS/NVS" },
  { name: "NDA — Lieutenant", level: 10, basicPay: 56100, category: "central", description: "Lieutenant after NDA + IMA training" },

  // West Bengal State
  { name: "WBCS (Executive) — BDO/SDO", level: 9, basicPay: 53100, category: "state-wb", description: "West Bengal Civil Service Group A" },
  { name: "WBCS (Judicial) — Munsif", level: 10, basicPay: 56100, category: "state-wb", description: "Judicial Magistrate, WB" },
  { name: "WBPSC Clerkship — LDA", level: 3, basicPay: 22700, category: "state-wb", description: "Lower Division Assistant, WB Secretariat" },
  { name: "WB Police SI", level: 6, basicPay: 30200, category: "state-wb", description: "Sub-Inspector, WB Police" },
  { name: "WB Police Constable", level: 3, basicPay: 22700, category: "state-wb", description: "Constable, WB Police" },
  { name: "WB TET — Primary Teacher", level: 5, basicPay: 27300, category: "state-wb", description: "Primary Teacher in WB Govt schools" },
  { name: "WB TET — Upper Primary", level: 6, basicPay: 30200, category: "state-wb", description: "Upper Primary Teacher in WB Govt schools" },

  // Banking
  { name: "IBPS PO — Probationary Officer", level: 0, basicPay: 36000, category: "banking", description: "PO in nationalised banks" },
  { name: "IBPS Clerk", level: 0, basicPay: 19900, category: "banking", description: "Clerk in nationalised banks" },
  { name: "SBI PO", level: 0, basicPay: 41960, category: "banking", description: "Probationary Officer in SBI" },
  { name: "SBI Clerk", level: 0, basicPay: 22600, category: "banking", description: "Junior Associate in SBI" },
  { name: "RBI Grade B", level: 0, basicPay: 55200, category: "banking", description: "RBI Officer Grade B" },
];

// Current DA rates (updated periodically)
const DA_RATE_CENTRAL = 53; // % — Jan 2026 estimated
const DA_RATE_STATE_WB = 42; // % — WB state DA

// HRA percentage by city class
type CityClass = "X" | "Y" | "Z";
const HRA_RATES: Record<CityClass, number> = { X: 27, Y: 18, Z: 9 };

// ── Component ────────────────────────────────────────────────────────────────

export default function SalaryCalculator() {
  const [selectedPost, setSelectedPost] = useState<PostProfile | null>(null);
  const [customBasic, setCustomBasic] = useState("");
  const [cityClass, setCityClass] = useState<CityClass>("Y");
  const [isMetro, setIsMetro] = useState(false);
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "central" | "state-wb" | "banking">("all");

  useEffect(() => { applySeo(); }, []);

  const basicPay = customBasic ? parseFloat(customBasic) : (selectedPost?.basicPay ?? 0);
  const isBanking = selectedPost?.category === "banking";
  const isWB = selectedPost?.category === "state-wb";

  // ── Salary Calculation ─────────────────────────────────────────────────

  const daRate = isWB ? DA_RATE_STATE_WB : DA_RATE_CENTRAL;
  const da = Math.round(basicPay * daRate / 100);
  const hra = isBanking
    ? Math.round(basicPay * (isMetro ? 0.15 : 0.10))
    : Math.round((basicPay + da) * HRA_RATES[cityClass] / 100);
  const ta = isBanking ? 0 : (cityClass === "X" ? 7200 : cityClass === "Y" ? 3600 : 1800);

  // Banking-specific allowances
  const specialAllowanceBanking = isBanking ? Math.round(basicPay * 0.16) : 0;

  const grossSalary = basicPay + da + hra + ta + specialAllowanceBanking;

  // Deductions
  const nps = isBanking ? 0 : Math.round(basicPay * 0.10); // 10% NPS
  const incomeTax = 0; // Varies, shown as user-adjustable
  const professionalTax = 200; // Standard
  const totalDeductions = nps + professionalTax;
  const netSalary = grossSalary - totalDeductions;

  const filteredPosts = categoryFilter === "all" ? POSTS : POSTS.filter(p => p.category === categoryFilter);

  const copyResult = () => {
    if (!selectedPost) return;
    const text = `${selectedPost.name}\nBasic Pay: ₹${basicPay.toLocaleString("en-IN")}\nDA (${daRate}%): ₹${da.toLocaleString("en-IN")}\nHRA: ₹${hra.toLocaleString("en-IN")}\nGross: ₹${grossSalary.toLocaleString("en-IN")}\nNet (approx): ₹${netSalary.toLocaleString("en-IN")}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── FAQ for SEO ────────────────────────────────────────────────────────

  const faqs = [
    { question: "What is the salary of SSC CGL after 7th Pay Commission?", answer: "SSC CGL Assistant starts at Level 7, Basic Pay ₹44,900/month. With DA, HRA (Y-class city), and TA, the gross salary is roughly ₹70,000-75,000/month." },
    { question: "What is WBCS salary after 7th Pay Commission?", answer: "WBCS Executive (BDO/SDO) starts at approximately ₹53,100 basic pay. With DA and other allowances, the gross comes to around ₹80,000-90,000/month in Kolkata." },
    { question: "How is government salary calculated?", answer: "Govt salary = Basic Pay + DA (Dearness Allowance) + HRA (House Rent Allowance) + TA (Transport Allowance) – deductions (NPS, Professional Tax, Income Tax)." },
    { question: "What is current DA rate for central government employees?", answer: `The current DA rate for central government employees is approximately ${DA_RATE_CENTRAL}% (as of 2026). It is revised twice a year based on CPI data.` },
    { question: "What is the salary of IBPS PO?", answer: "IBPS PO starts at basic pay ₹36,000 (after recent revision). With allowances, the in-hand salary is approximately ₹45,000–52,000/month depending on posting city." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/" },
          { name: "Salary Calculator", url: "/salary-calculator" },
        ])
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageSchema(faqs) }} />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-green-600" />
                Salary Calculator
              </h1>
              <p className="text-muted-foreground text-sm">7th Pay Commission • Central / WB State / Banking</p>
            </div>
          </div>
          <ProfileButton />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            ["all", "All Posts", Briefcase],
            ["central", "Central Govt", Building2],
            ["state-wb", "West Bengal", BookOpen],
            ["banking", "Banking", TrendingUp],
          ] as const).map(([key, label, Icon]) => (
            <Button
              key={key}
              variant={categoryFilter === key ? "default" : "outline"}
              size="sm"
              onClick={() => { setCategoryFilter(key); setSelectedPost(null); }}
              className="gap-1"
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </Button>
          ))}
        </div>

        {/* Post Selection */}
        <div className="grid gap-2 mb-6 max-h-64 overflow-y-auto pr-1">
          {filteredPosts.map(post => (
            <motion.button
              key={post.name}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedPost(post); setCustomBasic(""); }}
              className={`text-left p-3 rounded-xl border transition-all ${
                selectedPost?.name === post.name
                  ? "border-green-500 bg-green-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{post.name}</p>
                  <p className="text-xs text-muted-foreground">{post.description}</p>
                </div>
                <span className="text-sm font-semibold text-green-700 whitespace-nowrap ml-2">
                  ₹{post.basicPay.toLocaleString("en-IN")}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Salary Breakdown */}
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Settings */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4" /> Customize
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Custom Basic Pay (optional)</label>
                  <input
                    type="number"
                    placeholder={`₹${selectedPost.basicPay.toLocaleString("en-IN")}`}
                    value={customBasic}
                    onChange={e => setCustomBasic(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {!isBanking && (
                  <div>
                    <label className="text-xs text-muted-foreground">City Class (HRA)</label>
                    <select
                      value={cityClass}
                      onChange={e => setCityClass(e.target.value as CityClass)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="X">X — Metro (Delhi, Mumbai, Kolkata…)</option>
                      <option value="Y">Y — Other major cities</option>
                      <option value="Z">Z — Small towns / rural</option>
                    </select>
                  </div>
                )}
                {isBanking && (
                  <div className="flex items-center gap-2 mt-5">
                    <input
                      type="checkbox"
                      id="metro"
                      checked={isMetro}
                      onChange={e => setIsMetro(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="metro" className="text-sm">Metro city posting</label>
                  </div>
                )}
              </div>
            </div>

            {/* Result Card */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Estimated Monthly Salary</p>
                    <p className="text-3xl font-bold">₹{netSalary.toLocaleString("en-IN")}</p>
                    <p className="text-xs opacity-75 mt-1">Net take-home (approx)</p>
                  </div>
                  <button onClick={copyResult} className="text-white/80 hover:text-white transition p-2">
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1 text-sm">
                <h4 className="font-semibold text-green-700 mb-2">💰 Earnings</h4>
                <Row label="Basic Pay" value={basicPay} />
                <Row label={`DA (${daRate}%)`} value={da} />
                <Row label={`HRA${isBanking ? (isMetro ? " (15%)" : " (10%)") : ` (${HRA_RATES[cityClass]}%)`}`} value={hra} />
                {!isBanking && <Row label="Transport Allowance" value={ta} />}
                {isBanking && <Row label="Special Allowance (16%)" value={specialAllowanceBanking} />}
                <div className="border-t pt-1 mt-2">
                  <Row label="Gross Salary" value={grossSalary} bold />
                </div>

                <h4 className="font-semibold text-red-600 mt-3 mb-2">📉 Deductions</h4>
                {!isBanking && <Row label="NPS (10%)" value={nps} negative />}
                <Row label="Professional Tax" value={professionalTax} negative />
                <div className="text-xs text-muted-foreground italic">
                  * Income Tax not included (varies by total income & regime)
                </div>

                <div className="border-t pt-2 mt-2">
                  <Row label="Net Monthly Salary" value={netSalary} bold highlight />
                  <p className="text-xs text-muted-foreground mt-1">
                    Annual CTC ≈ ₹{(grossSalary * 12).toLocaleString("en-IN")} (gross)
                  </p>
                </div>
              </div>
            </div>

            {/* Level Info */}
            {!isBanking && selectedPost.level > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                <p className="font-medium text-blue-800">📋 Pay Level {selectedPost.level}</p>
                <p className="text-blue-700 text-xs mt-1">
                  Under 7th CPC Pay Matrix. Annual increment: 3% of basic pay every July.
                  Next promotion band after ~4-10 years depending on DPC/MACP.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Related Tools */}
        <RelatedToolsBanner currentPath="/salary-calculator" />

        {/* FAQ Section */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white border rounded-xl p-4 group">
              <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                {faq.question}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

function Row({ label, value, bold, negative, highlight }: {
  label: string; value: number; bold?: boolean; negative?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between py-0.5 ${bold ? "font-semibold" : ""} ${highlight ? "text-green-700 text-base" : ""}`}>
      <span>{label}</span>
      <span className={negative ? "text-red-600" : ""}>
        {negative ? "−" : ""}₹{value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

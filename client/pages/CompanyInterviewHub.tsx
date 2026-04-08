import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, itemListSchema, collectionPageSchema, webSiteSchema } from "@/lib/seo-schemas";
import { applyHubSeo } from "@/lib/company-seo";
import {
  ArrowLeft,
  Search,
  Building2,
  Users,
  MapPin,
  Briefcase,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Star,
  Filter,
  BarChart3,
} from "lucide-react";
import { COMPANIES, type CompanyInfo } from "@/lib/company-interview-data";

// ── SEO (centralized in company-seo.ts) ──────────────────────────────────────

type CompanyCategory = "all" | "service" | "product" | "startup" | "finance" | "consulting" | "telecom";

const SERVICE_SLUGS = new Set(["tcs", "infosys", "wipro", "capgemini", "accenture", "hcl", "cognizant", "tech-mahindra", "dxc-technology", "lti-mindtree", "mphasis", "infosys-bpm", "ibm", "atos", "ntt-data", "hexaware", "persistent", "larsen-toubro-infotech", "birlasoft", "coforge", "zensar", "cyient", "mindtree", "sonata-software", "sopra-steria", "virtusa", "tata-elxsi", "nagarro", "publicis-sapient", "epam", "thoughtworks", "hashedin", "mahindra", "dell", "hp", "bosch", "siemens", "continental", "schneider-electric", "philips", "ge-healthcare", "medtronic", "tata-technologies", "lenovo", "zebra-technologies", "motorola-solutions"]);
const PRODUCT_SLUGS = new Set(["google", "amazon", "microsoft", "meta", "oracle", "samsung", "adobe", "atlassian", "zoho", "apple", "netflix", "salesforce", "linkedin", "twitter", "spotify", "airbnb", "snap", "stripe", "shopify", "databricks", "snowflake", "palantir", "vmware", "nvidia", "intel", "qualcomm", "servicenow", "sap", "uber-india", "aws", "gcp", "cisco", "juniper", "amd", "texas-instruments", "micron", "github", "gitlab", "figma", "canva", "notion", "datadog", "splunk", "workday", "openai", "anthropic", "mongodb", "elastic", "confluent", "hashicorp", "cloudflare", "twilio", "okta", "palo-alto-networks", "crowdstrike", "vercel", "supabase", "render", "search-india", "microsoft-india", "thoughtspot", "commvault", "postman", "browserstack", "druva", "harness", "samsung-rd", "nutanix", "rubrik", "cohesity", "quora", "walmart-labs", "expedia", "booking", "grab", "gojek", "synopsys", "cadence", "arm", "marvell", "broadcom", "autodesk", "ansys", "dassault", "veeva", "iqvia", "hubspot", "zendesk", "pagerduty", "sentry", "grafana", "fivetran", "informatica", "mulesoft", "zapier", "docusign", "doordash", "lyft", "pinterest", "reddit", "discord", "zoom", "dropbox", "duolingo", "coursera", "udemy", "couchbase", "redis-inc", "neo4j", "cockroachdb", "yugabyte", "singlestore", "clickhouse", "planetscale", "dbt-labs", "airbyte", "scale-ai", "weights-biases", "hugging-face", "pinecone", "cohere", "linear-app", "miro", "airtable", "grammarly", "asana", "monday-com", "new-relic", "dynatrace", "appdynamics", "lam-research", "applied-materials", "kla-corporation"]);
const STARTUP_SLUGS = new Set(["flipkart", "swiggy", "zomato", "razorpay", "meesho", "phonepe", "cred", "ola", "paytm", "myntra", "juspay", "uber", "dream11", "groww", "zerodha", "byju", "unacademy", "nykaa", "lenskart", "freshworks", "ola-electric", "sharechat", "bigbasket", "dunzo", "cure-fit", "upstox", "urban-company", "rapido", "delhivery", "policybazaar", "cars24", "spinny", "jupiter", "slice", "mmt", "oyo", "blinkit", "zepto", "inmobi", "practo", "razorpay-x", "pine-labs", "cred-club", "hotstar", "media-net", "ajio", "tatacliq", "sprinklr", "chargebee", "clevertap", "moengage", "yellow-ai", "darwinbox", "whatfix", "hasura", "directi", "zeta-suite", "tower-research", "info-edge", "indiamart", "justdial", "physicswallah", "vedantu", "upgrad", "ather-energy", "blackbuck", "ninjacart", "licious", "cleartax", "niyo", "cashfree", "nobroker", "housing-com", "ixigo", "khatabook", "ofbusiness", "moglix", "billdesk", "perfios"]);
const FINANCE_SLUGS = new Set(["deloitte", "goldman-sachs", "jpmorgan", "paypal", "hsbc", "barclays", "morgan-stanley", "deutsche-bank", "citi", "ubs", "mastercard", "visa", "american-express", "bajaj-finserv", "hdfc-bank", "icici-bank", "axis-bank", "kotak", "sbi-tech", "fis-global", "fiserv", "finastra", "temenos", "worldline", "wells-fargo", "bofa", "charles-schwab", "fidelity", "intellect-design", "nucleus-software"]);
const CONSULTING_SLUGS = new Set(["ey", "kpmg", "pwc", "mckinsey", "bcg", "bain", "musigma"]);
const TELECOM_SLUGS = new Set(["reliance-jio", "bharti-airtel", "k2-pure", "ericsson", "nokia"]);

function getCategory(slug: string): CompanyCategory {
  if (SERVICE_SLUGS.has(slug)) return "service";
  if (PRODUCT_SLUGS.has(slug)) return "product";
  if (STARTUP_SLUGS.has(slug)) return "startup";
  if (FINANCE_SLUGS.has(slug)) return "finance";
  if (CONSULTING_SLUGS.has(slug)) return "consulting";
  if (TELECOM_SLUGS.has(slug)) return "telecom";
  return "service";
}

const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  all: "All Companies",
  service: "IT Services & Engineering",
  product: "Product / Big Tech",
  startup: "Indian Startups & Unicorns",
  finance: "Banking & Finance",
  consulting: "Consulting (MBB & Big4)",
  telecom: "Telecom & Others",
};

// card animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.35 },
  }),
};

export default function CompanyInterviewHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CompanyCategory>("all");

  // apply SEO on mount
  useState(() => { applyHubSeo(COMPANIES.length); });

  const filtered = useMemo(() => {
    let list = COMPANIES;
    if (category !== "all") list = list.filter((c) => getCategory(c.slug) === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.slug.includes(q)
      );
    }
    return list;
  }, [search, category]);

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Company Interview Questions
              </h1>
              <p className="text-xs text-muted-foreground">
                {COMPANIES.length}+ top companies • Free preparation
              </p>
            </div>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-red-500/10 to-orange-500/10 border border-border/40 p-6 md:p-8"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Interview Preparation 2026</span>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Practice company-specific interview questions from TCS, Infosys, Google, Amazon & {COMPANIES.length - 4}+ more.
              Technical, HR, aptitude & coding questions with expert answers.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link to={`/interview-questions/${COMPANIES[0]?.slug ?? "tcs"}`}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl gap-2 shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4" />
                  Try 1 Question — No Login
                </Button>
              </Link>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Updated for 2026</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> Expert-curated answers</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-500" /> 1 Lakh+ users</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skill Matrix CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            to="/skill-matrix"
            className="group block rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 via-violet-500/5 to-emerald-500/5 hover:border-primary/50 hover:shadow-md transition-all p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm group-hover:text-primary transition-colors">
                  Tech Interview Skill Matrix
                </h3>
                <p className="text-xs text-muted-foreground">
                  Self-assess DSA, System Design, DBMS, OOP & more — find your weak areas with personalized recommendations
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </Link>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies (e.g. TCS, Google, Flipkart...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(Object.entries(CATEGORY_LABELS) as [CompanyCategory, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                  category === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {key === "all" && <Filter className="w-3 h-3" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> companies
        </p>

        {/* Company Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company, i) => (
            <CompanyCard key={company.slug} company={company} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No companies found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}

        {/* SEO: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Company Interview Questions", url: "/interview-questions" },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: itemListSchema(
              "Company Interview Questions",
              COMPANIES.map((c) => ({ name: `${c.shortName} Interview Questions`, url: `/interview-questions/${c.slug}` }))
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: collectionPageSchema({
              name: "Company Interview Questions 2026",
              description: `Free interview preparation for ${COMPANIES.length}+ top companies with expert-curated questions and answers.`,
              url: "/interview-questions",
              totalItems: COMPANIES.length,
              keywords: "company interview questions, TCS, Infosys, Google, Amazon, FAANG interview preparation 2026",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: webSiteSchema() }}
        />

        {/* SEO: keyword-rich footer for crawlers */}
        <footer className="mt-12 border-t border-border/40 pt-8 pb-6">
          <div className="max-w-4xl mx-auto text-xs text-muted-foreground/70 space-y-3">
            <h2 className="text-sm font-semibold text-foreground/80">Company Interview Questions 2026 — Free Preparation</h2>
            <p>
              MedhaHub offers interview questions and answers for {COMPANIES.length}+ companies including
              TCS, Infosys, Wipro, Capgemini, Accenture, HCL, Cognizant, Tech Mahindra, Google, Amazon,
              Microsoft, Meta, Apple, Netflix, Flipkart, Swiggy, Zomato, Razorpay, CRED, Goldman Sachs,
              JPMorgan, Deloitte, McKinsey, BCG, and many more. Each company page includes technical
              interview questions, HR interview questions, aptitude questions, and coding challenges
              specific to that company's hiring process.
            </p>
            <p>
              Our interview questions cover all rounds — online assessment, aptitude test, technical round,
              coding round, system design, managerial interview, and HR interview. Questions are categorized
              by difficulty (Easy, Medium, Hard) and updated for 2026 placements.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {COMPANIES.slice(0, 30).map((c) => (
                <Link
                  key={c.slug}
                  to={`/interview-questions/${c.slug}`}
                  className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                >
                  {c.shortName}
                </Link>
              ))}
              <span>& {COMPANIES.length - 30}+ more companies</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function CompanyCard({ company, index }: { company: CompanyInfo; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        to={`/interview-questions/${company.slug}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5">
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${company.color}`} />

          <div className="flex items-start gap-3 mb-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center text-xl text-white shadow-sm`}>
              {company.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate">
                {company.shortName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{company.name}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {company.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {company.headquarters}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {company.employees}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {company.avgPackage}
            </span>
          </div>

          {/* Interview rounds mini pills */}
          <div className="flex flex-wrap gap-1 mt-3">
            {company.interviewRounds.slice(0, 3).map((round) => (
              <span
                key={round}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${company.bgAccent} ${company.accent}`}
              >
                {round}
              </span>
            ))}
            {company.interviewRounds.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                +{company.interviewRounds.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Centralized SEO helpers for company interview pages.
 * Applies title, meta tags, OG, Twitter, canonical, and hreflang.
 */

import type { CompanyInfo, CompanyQuestion } from "./company-interview-data";

const SITE = "https://medhahub.in";
const OG_IMAGE = `${SITE}/og-image.png`;
const BRAND = "MedhaHub";

// ── Internal helpers ─────────────────────────────────────────────────────────

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (el) {
    el.content = content;
  } else {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.content = content;
    document.head.appendChild(el);
  }
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra
    ? `link[rel="${rel}"]${Object.entries(extra).map(([k, v]) => `[${k}="${v}"]`).join("")}`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (el) {
    el.href = href;
  } else {
    el = document.createElement("link");
    el.rel = rel;
    el.href = href;
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
}

// ── Hub page SEO ─────────────────────────────────────────────────────────────

export function applyHubSeo(companyCount: number) {
  const title = `${companyCount}+ Company Interview Questions 2026 | TCS, Google, HDFC Bank, HubSpot, Synopsys & More | ${BRAND}`;
  const description = `Prepare for interviews at ${companyCount}+ top companies — TCS, Google, Amazon, Microsoft, HDFC Bank, ICICI Bank, SBI, Physics Wallah, Ather Energy, HubSpot, Synopsys, ARM, DoorDash, Hugging Face, Scale AI, CockroachDB & many more. Free interview questions with expert answers for 2026.`;
  const keywords = "company interview questions 2026, TCS interview questions, Infosys interview questions, Google interview questions, Amazon interview questions, Wipro interview preparation, Microsoft interview, Apple interview, Netflix interview, Flipkart interview, Razorpay interview, CRED interview, Goldman Sachs interview, McKinsey interview, Adobe interview, Zoho interview, Swiggy interview, Zomato interview, Paytm interview, NVIDIA interview, Salesforce interview, Meta interview, FAANG interview preparation, HDFC Bank interview questions, ICICI Bank interview questions, Axis Bank interview questions, SBI interview questions, Physics Wallah interview questions, Vedantu interview questions, Ather Energy interview questions, ClearTax interview questions, NoBroker interview questions, HubSpot interview questions, Zendesk interview questions, DoorDash interview questions, Pinterest interview questions, Reddit interview questions, Discord interview questions, Zoom interview questions, Dropbox interview questions, Duolingo interview questions, Synopsys interview questions, Cadence interview questions, ARM interview questions, Broadcom interview questions, Hugging Face interview questions, Scale AI interview questions, CockroachDB interview questions, ClickHouse interview questions, Grammarly interview questions, Asana interview questions, New Relic interview questions, IT company interview questions and answers, top 300 company interview questions, campus placement interview questions, fresher interview preparation 2026, MedhaHub";
  const url = `${SITE}/interview-questions`;

  document.title = title;

  // Standard meta
  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords);
  upsertMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  upsertMeta("name", "author", BRAND);

  // Open Graph
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:title", `${companyCount}+ Company Interview Questions 2026 | ${BRAND}`);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:image", OG_IMAGE);
  upsertMeta("property", "og:site_name", BRAND);
  upsertMeta("property", "og:locale", "en_IN");
  upsertMeta("property", "og:locale:alternate", "bn_IN");

  // Twitter
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", `${companyCount}+ Companies Interview Questions 2026 | TCS, Google, HDFC Bank & More | ${BRAND}`);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", OG_IMAGE);

  // Canonical + hreflang
  upsertLink("canonical", url);
  upsertLink("alternate", url, { hreflang: "en-IN" });
  upsertLink("alternate", url, { hreflang: "x-default" });
}

// ── Company detail page SEO ──────────────────────────────────────────────────

export function applyCompanySeo(company: CompanyInfo) {
  const url = `${SITE}/interview-questions/${company.slug}`;

  document.title = company.seo.title;

  // Standard meta
  upsertMeta("name", "description", company.seo.description);
  upsertMeta("name", "keywords", company.seo.keywords);
  upsertMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  upsertMeta("name", "author", BRAND);

  // Open Graph
  upsertMeta("property", "og:type", "article");
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:title", company.seo.title);
  upsertMeta("property", "og:description", company.seo.description);
  upsertMeta("property", "og:image", OG_IMAGE);
  upsertMeta("property", "og:site_name", BRAND);
  upsertMeta("property", "og:locale", "en_IN");
  upsertMeta("property", "og:locale:alternate", "bn_IN");
  upsertMeta("property", "article:section", "Interview Preparation");
  upsertMeta("property", "article:tag", `${company.shortName} Interview`);
  upsertMeta("property", "article:modified_time", "2026-04-08T00:00:00+05:30");

  // Twitter
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", company.seo.title);
  upsertMeta("name", "twitter:description", company.seo.description);
  upsertMeta("name", "twitter:image", OG_IMAGE);

  // Canonical + hreflang
  upsertLink("canonical", url);
  upsertLink("alternate", url, { hreflang: "en-IN" });
  upsertLink("alternate", url, { hreflang: "x-default" });
}

// ── JSON-LD helpers for company pages ────────────────────────────────────────

export function companyFaqSchema(questions: CompanyQuestion[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  });
}

export function companyDetailSchemas(
  company: CompanyInfo,
  questions?: CompanyQuestion[],
): string[] {
  const url = `${SITE}/interview-questions/${company.slug}`;
  const schemas: string[] = [];

  // 1) WebPage
  schemas.push(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: company.seo.title,
      description: company.seo.description,
      url,
      inLanguage: "en-IN",
      dateModified: "2026-04-06",
      isPartOf: { "@type": "WebSite", name: BRAND, url: SITE },
      publisher: { "@type": "Organization", name: BRAND, url: SITE },
      about: {
        "@type": "Organization",
        name: company.name,
        foundingDate: company.founded,
        address: { "@type": "PostalAddress", addressLocality: company.headquarters },
        numberOfEmployees: { "@type": "QuantitativeValue", value: company.employees },
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".company-description", ".question-text"],
      },
    }),
  );

  // 2) Organization (the company being interviewed about)
  schemas.push(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.name,
      alternateName: company.shortName,
      description: company.description,
      foundingDate: company.founded,
      address: {
        "@type": "PostalAddress",
        addressLocality: company.headquarters,
      },
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: company.employees,
      },
    }),
  );

  // 3) FAQPage (ALL questions, not just 10)
  if (questions && questions.length > 0) {
    schemas.push(
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      }),
    );
  }

  // 4) Course schema (interview prep as educational content)
  schemas.push(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${company.shortName} Interview Preparation`,
      description: `Complete interview preparation guide for ${company.name}. Covers ${company.interviewRounds.join(", ")} rounds with practice questions and expert answers.`,
      url,
      provider: { "@type": "Organization", name: BRAND, sameAs: SITE },
      inLanguage: "en",
      isAccessibleForFree: true,
      educationalLevel: "Beginner to Advanced",
      about: { "@type": "Thing", name: `${company.shortName} Interview` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    }),
  );

  return schemas;
}

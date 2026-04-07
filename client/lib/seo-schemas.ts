/**
 * Reusable JSON-LD schema generators for SEO rich results.
 * Inject via dangerouslySetInnerHTML on a <script type="application/ld+json">.
 */

const SITE = "https://medhahub.in";

// ── Breadcrumb Schema ────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE}${item.url}`,
    })),
  });
}

// ── Blog / Article Schema ────────────────────────────────────────────────────

export interface BlogArticleMeta {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  keywords?: string[];
}

export function blogArticleSchema(meta: BlogArticleMeta): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    url: meta.url.startsWith("http") ? meta.url : `${SITE}${meta.url}`,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified ?? meta.datePublished,
    author: {
      "@type": "Person",
      name: meta.authorName ?? "MedhaHub Team",
    },
    publisher: {
      "@type": "Organization",
      name: "MedhaHub",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    image: meta.image ?? `${SITE}/og-image.png`,
    mainEntityOfPage: { "@type": "WebPage", "@id": meta.url.startsWith("http") ? meta.url : `${SITE}${meta.url}` },
    ...(meta.keywords ? { keywords: meta.keywords.join(", ") } : {}),
  });
}

// ── Course / Educational Program Schema ──────────────────────────────────────

export interface CourseMeta {
  name: string;
  description: string;
  url: string;
  provider?: string;
  language?: string;
  isFree?: boolean;
}

export function courseSchema(meta: CourseMeta): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: meta.name,
    description: meta.description,
    url: meta.url.startsWith("http") ? meta.url : `${SITE}${meta.url}`,
    provider: {
      "@type": "Organization",
      name: meta.provider ?? "MedhaHub",
      sameAs: SITE,
    },
    inLanguage: meta.language ?? "en",
    isAccessibleForFree: meta.isFree ?? true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  });
}

// ── ItemList Schema (for hub/listing pages) ──────────────────────────────────

export interface ListItemMeta {
  name: string;
  url: string;
}

export function itemListSchema(name: string, items: ListItemMeta[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE}${item.url}`,
    })),
  });
}

// ── FAQPage Schema ───────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(faqs: FaqItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
}

// ── Organization Schema ──────────────────────────────────────────────────────

export interface OrgMeta {
  name: string;
  url?: string;
  description?: string;
  foundingDate?: string;
  headquarters?: string;
  employees?: string;
  logo?: string;
}

export function organizationSchema(meta: OrgMeta): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: meta.name,
    url: meta.url ?? SITE,
    ...(meta.description ? { description: meta.description } : {}),
    ...(meta.foundingDate ? { foundingDate: meta.foundingDate } : {}),
    ...(meta.headquarters
      ? { address: { "@type": "PostalAddress", addressLocality: meta.headquarters } }
      : {}),
    ...(meta.employees
      ? { numberOfEmployees: { "@type": "QuantitativeValue", value: meta.employees } }
      : {}),
    ...(meta.logo ? { logo: meta.logo } : {}),
  });
}

// ── WebPage Schema ───────────────────────────────────────────────────────────

export interface WebPageMeta {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
  breadcrumb?: BreadcrumbItem[];
  speakable?: string[];
  inLanguage?: string;
}

export function webPageSchema(meta: WebPageMeta): string {
  const url = meta.url.startsWith("http") ? meta.url : `${SITE}${meta.url}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.name,
    description: meta.description,
    url,
    inLanguage: meta.inLanguage ?? "en-IN",
    isPartOf: { "@type": "WebSite", name: "MedhaHub", url: SITE },
    ...(meta.dateModified ? { dateModified: meta.dateModified } : {}),
    ...(meta.speakable
      ? { speakable: { "@type": "SpeakableSpecification", cssSelector: meta.speakable } }
      : {}),
    publisher: { "@type": "Organization", name: "MedhaHub", url: SITE },
  });
}

// ── CollectionPage Schema (hub / listing pages) ─────────────────────────────

export interface CollectionPageMeta {
  name: string;
  description: string;
  url: string;
  totalItems: number;
  keywords?: string;
}

export function collectionPageSchema(meta: CollectionPageMeta): string {
  const url = meta.url.startsWith("http") ? meta.url : `${SITE}${meta.url}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.name,
    description: meta.description,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "MedhaHub", url: SITE },
    publisher: { "@type": "Organization", name: "MedhaHub", url: SITE },
    ...(meta.keywords ? { keywords: meta.keywords } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: meta.totalItems,
    },
  });
}

// ── WebSite + SearchAction Schema (for sitelinks searchbox) ──────────────────

export function webSiteSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MedhaHub",
    url: SITE,
    description:
      "India's #1 interview preparation & government exam platform. 200+ company interview questions, mock tests, previous year papers & AI-powered study plans.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/interview-questions?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en-IN", "bn"],
    publisher: {
      "@type": "EducationalOrganization",
      name: "MedhaHub",
      url: SITE,
      sameAs: [SITE],
    },
  });
}

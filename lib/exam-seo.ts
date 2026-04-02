/**
 * Client-side SEO updates for exam / mock-test routes (title, meta, OG, canonical, JSON-LD).
 */

export type ExamSeoProfile = "default" | "wbcs" | "police";

const SITE = "https://interviewsathi.online";

function origin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return SITE;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(pathname: string) {
  const href = `${origin()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;
}

const JSON_LD_ID = "exam-seo-jsonld";

function injectJsonLd(data: Record<string, unknown>) {
  const existing = document.getElementById(JSON_LD_ID);
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

export interface ExamSeoPayload {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
  jsonLd?: Record<string, unknown>;
}

export function applyExamSeoPayload(payload: ExamSeoPayload) {
  const base = origin();
  const url = `${base}${payload.canonicalPath}`;

  document.title = payload.title;
  setMeta("description", payload.description);
  setMeta("keywords", payload.keywords);
  setCanonical(payload.canonicalPath);

  setProperty("og:type", "website");
  setProperty("og:url", url);
  setProperty("og:title", payload.ogTitle ?? payload.title);
  setProperty(
    "og:description",
    payload.ogDescription ?? payload.description,
  );
  setProperty("og:locale", "en_IN");
  setProperty("og:locale:alternate", "bn_IN");

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", payload.ogTitle ?? payload.title);
  setMeta("twitter:description", payload.ogDescription ?? payload.description);

  if (payload.jsonLd) {
    injectJsonLd(payload.jsonLd);
  } else {
    const stale = document.getElementById(JSON_LD_ID);
    if (stale) stale.remove();
  }
}

function webPageJsonLd(args: {
  name: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  const base = origin();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: args.name,
    description: args.description,
    url: `${base}${args.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "InterviewSathi",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "InterviewSathi",
      url: SITE,
      logo: `${SITE}/logo.png`,
    },
  };
}

const WBCS_KEYWORDS = [
  "WBCS mock test",
  "WBCS mock test online free",
  "WBCS previous year question paper mock test",
  "WBCS prelims mock test",
  "West Bengal Civil Service practice test",
  "WBCS online test",
  "WBPSC previous year paper",
  "WBCS question paper PDF mock",
  "WBCS preparation mock test West Bengal",
].join(", ");

const POLICE_KEYWORDS = [
  "WBP mock test",
  "WBP police mock test",
  "BWP police mock test",
  "West Bengal Police mock test online",
  "WBP constable previous year mock test",
  "WBP lady constable mock test",
  "police constable mock test West Bengal",
  "WBP prelims practice test",
  "West Bengal Police previous year question mock test",
].join(", ");

/** Question Hub landing variants */
export function applyQuestionHubExamSeo(profile: ExamSeoProfile) {
  if (profile === "wbcs") {
    applyExamSeoPayload({
      title:
        "WBCS Mock Test Free Online | Previous Year Question Papers | InterviewSathi",
      description:
        "Practice WBCS (West Bengal Civil Service) with free online mock tests built from official previous-year prelims papers. Timed MCQs, instant scoring, and downloads — ideal for WBCS and WBPSC exam preparation.",
      keywords: WBCS_KEYWORDS,
      canonicalPath: "/wbcs-mock-test",
      jsonLd: webPageJsonLd({
        name: "WBCS mock test & previous year papers",
        description:
          "Free online WBCS mock tests and West Bengal Civil Service previous year question papers for prelims practice.",
        path: "/wbcs-mock-test",
      }),
    });
    return;
  }

  if (profile === "police") {
    applyExamSeoPayload({
      title:
        "WBP Police Mock Test | Previous Year Question Papers Online | InterviewSathi",
      description:
        "West Bengal Police (WBP) Constable and Lady Constable previous year question papers as free online mock tests. Timed practice, answers, and PDFs for WBP recruitment exam preparation.",
      keywords: POLICE_KEYWORDS,
      canonicalPath: "/wbp-police-mock-test",
      jsonLd: webPageJsonLd({
        name: "WBP police mock test & previous year papers",
        description:
          "Free WBP Constable and Lady Constable mock tests from previous year papers.",
        path: "/wbp-police-mock-test",
      }),
    });
    return;
  }

  applyExamSeoPayload({
    title:
      "WBP & WBCS Previous Year Question Papers Free Download | SSC Mock Test | InterviewSathi",
    description:
      "Download WBP Constable & Lady Constable previous year question papers free PDF. WBCS Prelims & Mains old question papers. SSC CGL, CHSL previous year papers. Attempt AI-powered mock tests online for West Bengal government exam preparation.",
    keywords: [
      ...WBCS_KEYWORDS.split(", "),
      ...POLICE_KEYWORDS.split(", "),
      "SSC CGL previous year question paper",
      "সরকারি চাকরির পুরনো প্রশ্নপত্র",
    ].join(", "),
    canonicalPath: "/question-hub",
    jsonLd: webPageJsonLd({
      name: "Question Hub — WBP, WBCS, SSC papers",
      description:
        "Previous year papers and mock tests for WBP, WBCS, and SSC on InterviewSathi.",
      path: "/question-hub",
    }),
  });
}

/** Active PDF mock test screen */
export function applyPdfMockTestSeo(folder: string, pdfFileName: string) {
  const shortName = (pdfFileName || "Practice paper").replace(/\.pdf$/i, "").slice(0, 80);
  const base = origin();

  if (folder === "wbcs") {
    applyExamSeoPayload({
      title: `${shortName} | WBCS Mock Test Online | InterviewSathi`,
      description: `Online WBCS mock test: ${shortName}. Timed multiple-choice practice with instant results — part of InterviewSathi WBCS previous year paper tests.`,
      keywords: `${WBCS_KEYWORDS}, ${shortName}`,
      canonicalPath: "/wbcs-mock-test",
      ogTitle: `WBCS mock test — ${shortName}`,
    });
    return;
  }

  if (folder === "police") {
    applyExamSeoPayload({
      title: `${shortName} | WBP Police Mock Test Online | InterviewSathi`,
      description: `West Bengal Police mock test from previous year paper: ${shortName}. Practice online with timer and scoring on InterviewSathi.`,
      keywords: `${POLICE_KEYWORDS}, ${shortName}`,
      canonicalPath: "/wbp-police-mock-test",
      ogTitle: `WBP police mock test — ${shortName}`,
    });
    return;
  }

  applyExamSeoPayload({
    title: `${shortName} | Online Mock Test | InterviewSathi`,
    description: `Timed mock test: ${shortName}. Practice government and competitive exam MCQs on InterviewSathi.`,
    keywords: `online mock test, previous year paper MCQ, ${shortName}`,
    canonicalPath: "/pdf-mock-test",
    ogTitle: `Mock test — ${shortName}`,
  });
}

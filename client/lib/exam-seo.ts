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
  "WBCS mock test 2026",
  "WBCS prelims practice paper free",
  "WBCS previous year question paper with answers",
  "West Bengal Civil Service online test",
  "WBPSC prelims strategy",
  "ডব্লিউবিসিএস মক টেস্ট",
  "WBCS Bengali mock test",
  "WBCS preparation online West Bengal",
].join(", ");

const POLICE_KEYWORDS = [
  "WBP Constable mock test 2026",
  "WBP SI mock test online",
  "West Bengal Police recruitment practice paper",
  "WBP lady constable previous year paper",
  "WBP prelims mock test in Bengali",
  "পশ্চিমবঙ্গ পুলিশ মক টেস্ট",
  "WBP online exam practice",
  "police job preparation West Bengal",
].join(", ");

const WBPSC_KEYWORDS = [
  "WBPSC Clerkship mock test",
  "WBPSC Miscellaneous practice paper",
  "West Bengal Public Service Commission online test",
  "WBPSC Clerkship previous year question",
  "ক্লার্কশিপ মক টেস্ট",
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
      "WBP, WBCS & WBPSC Previous Year Question Papers Free Download | Online Mock Test | InterviewSathi",
    description:
      "Download WBP Constable, WBCS & WBPSC previous year question papers free PDF. Practice online mock tests for West Bengal government exams 2026. AI-powered results and analysis.",
    keywords: [
      ...WBCS_KEYWORDS.split(", "),
      ...POLICE_KEYWORDS.split(", "),
      ...WBPSC_KEYWORDS.split(", "),
      "SSC CGL previous year question paper",
      "সরকারি চাকরির পুরনো প্রশ্নপত্র",
      "পশ্চিমবঙ্গ সরকারি চাকরি প্রস্তুতি",
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
  // Clean name: remove path, extensions, JSON word, and limit length
  const baseName = (pdfFileName || "Practice paper").split('/').pop() || "";
  const shortName = baseName
    .replace(/\.(pdf|json)$/i, "")
    .replace(/json[-_]data/gi, "")
    .replace(/json/gi, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
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

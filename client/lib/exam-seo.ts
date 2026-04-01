/**
 * Client-side SEO updates for exam / mock-test routes (title, meta, OG, canonical, JSON-LD).
 */

export type ExamSeoProfile = "default" | "wbcs" | "police" | "wbpsc-clerkship" | "wb-tet" | "ssc-mts" | "ibps-po";

const BRAND = "MedhaHub";
const SITE_FALLBACK = "https://medhahub.in";

function origin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return SITE_FALLBACK;
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
      name: BRAND,
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      url: SITE_FALLBACK,
      logo: `${base}/logo.png`,
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
  "WBPSC Clerkship 2024 question paper",
  "WBPSC Clerkship 2024 all shift questions",
  "ক্লার্কশিপ মক টেস্ট",
  "WBPSC Clerkship preparation online",
].join(", ");

const WB_TET_KEYWORDS = [
  "WB Primary TET mock test 2026",
  "WB TET previous year question paper",
  "WB Primary TET 2023 question paper",
  "WB TET 2022 question paper with answers",
  "West Bengal TET online practice",
  "প্রাইমারি টেট মক টেস্ট",
  "WB TET preparation online",
  "WB TET Bengali question paper",
  "WB TET Child Development questions",
].join(", ");

const SSC_MTS_KEYWORDS = [
  "SSC MTS mock test 2026",
  "SSC MTS previous year question paper",
  "SSC MTS 2023 question paper all shifts",
  "SSC MTS 2019 question paper with answers",
  "SSC MTS online practice free",
  "SSC MTS preparation online",
  "SSC MTS GK questions",
  "SSC MTS reasoning questions",
].join(", ");

const IBPS_PO_KEYWORDS = [
  "IBPS PO mock test 2026",
  "IBPS PO previous year question paper",
  "IBPS PO prelims 2025 question paper",
  "IBPS PO mains 2022 question paper with answers",
  "IBPS PO online practice free",
  "IBPS PO preparation online",
  "IBPS PO reasoning questions",
  "IBPS PO quantitative aptitude",
  "IBPS PO English language questions",
  "banking exam mock test free",
].join(", ");

/** Question Hub landing variants */
export function applyQuestionHubExamSeo(profile: ExamSeoProfile) {
  if (profile === "wbcs") {
    applyExamSeoPayload({
      title:
        "WBCS Mock Test Free Online | Previous Year Question Papers | MedhaHub",
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
        "WBP Police Mock Test | Previous Year Question Papers Online | MedhaHub",
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

  if (profile === "wbpsc-clerkship") {
    applyExamSeoPayload({
      title:
        "WBPSC Clerkship Mock Test Free | Previous Year Question Papers (2019-2024) | MedhaHub",
      description:
        "Practice WBPSC Clerkship exam with free online mock tests from 2019, 2020, 2024 papers (all shifts). Timed MCQs covering English, GK, and Arithmetic with instant scoring.",
      keywords: WBPSC_KEYWORDS,
      canonicalPath: "/wbpsc-clerkship-mock-test",
      jsonLd: webPageJsonLd({
        name: "WBPSC Clerkship mock test & previous year papers",
        description:
          "Free online WBPSC Clerkship mock tests from 2019, 2020, 2024 question papers (all shifts).",
        path: "/wbpsc-clerkship-mock-test",
      }),
    });
    return;
  }

  if (profile === "wb-tet") {
    applyExamSeoPayload({
      title:
        "WB TET Mock Test Free | Primary TET Previous Year Question Papers | MedhaHub",
      description:
        "Practice WB Primary TET with free online mock tests from 2015, 2017, 2022, 2023 papers. Bengali, English, Child Development, Math, and EVS sections with answers and scoring.",
      keywords: WB_TET_KEYWORDS,
      canonicalPath: "/wb-tet-mock-test",
      jsonLd: webPageJsonLd({
        name: "WB Primary TET mock test & previous year papers",
        description:
          "Free WB Primary TET mock tests from previous year question papers (2015–2023).",
        path: "/wb-tet-mock-test",
      }),
    });
    return;
  }

  if (profile === "ssc-mts") {
    applyExamSeoPayload({
      title:
        "SSC MTS Mock Test Free | Previous Year Question Papers 2019 & 2023 | MedhaHub",
      description:
        "Practice SSC MTS (Multi Tasking Staff) with free online mock tests from 2019 and 2023 papers (all shifts). GK, Reasoning, English sections with answers and instant scoring.",
      keywords: SSC_MTS_KEYWORDS,
      canonicalPath: "/ssc-mts-mock-test",
      jsonLd: webPageJsonLd({
        name: "SSC MTS mock test & previous year papers",
        description:
          "Free SSC MTS mock tests from previous year papers (2019, 2023 all shifts).",
        path: "/ssc-mts-mock-test",
      }),
    });
    return;
  }

  applyExamSeoPayload({
    title:
      "WBP, WBCS, WBPSC, WB TET, SSC & IBPS PO Previous Year Question Papers Free | Online Mock Test | MedhaHub",
    description:
      "Download WBP Constable, WBCS, WBPSC Clerkship, WB TET, SSC MTS & IBPS PO previous year question papers free. Practice online mock tests for government & banking exams 2026. AI-powered results and analysis.",
    keywords: [
      ...WBCS_KEYWORDS.split(", "),
      ...POLICE_KEYWORDS.split(", "),
      ...WBPSC_KEYWORDS.split(", "),
      ...WB_TET_KEYWORDS.split(", "),
      ...SSC_MTS_KEYWORDS.split(", "),
      ...IBPS_PO_KEYWORDS.split(", "),
      "SSC CGL previous year question paper",
      "সরকারি চাকরির পুরনো প্রশ্নপত্র",
      "পশ্চিমবঙ্গ সরকারি চাকরি প্রস্তুতি",
    ].join(", "),
    canonicalPath: "/question-hub",
    jsonLd: webPageJsonLd({
      name: "Question Hub — WBP, WBCS, WBPSC, WB TET, SSC, IBPS PO papers",
      description:
        "Previous year papers and mock tests for WBP, WBCS, WBPSC Clerkship, WB TET, SSC and IBPS PO on MedhaHub.",
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
      title: `${shortName} | WBCS Mock Test Online | MedhaHub`,
      description: `Online WBCS mock test: ${shortName}. Timed multiple-choice practice with instant results — part of MedhaHub WBCS previous year paper tests.`,
      keywords: `${WBCS_KEYWORDS}, ${shortName}`,
      canonicalPath: "/wbcs-mock-test",
      ogTitle: `WBCS mock test — ${shortName}`,
    });
    return;
  }

  if (folder === "police") {
    applyExamSeoPayload({
      title: `${shortName} | WBP Police Mock Test Online | MedhaHub`,
      description: `West Bengal Police mock test from previous year paper: ${shortName}. Practice online with timer and scoring on MedhaHub.`,
      keywords: `${POLICE_KEYWORDS}, ${shortName}`,
      canonicalPath: "/wbp-police-mock-test",
      ogTitle: `WBP police mock test — ${shortName}`,
    });
    return;
  }

  if (folder === "wbpsc" || folder === "WBPSC") {
    applyExamSeoPayload({
      title: `${shortName} | WBPSC Clerkship Mock Test Online | MedhaHub`,
      description: `WBPSC Clerkship mock test: ${shortName}. Timed practice with instant scoring — part of MedhaHub WBPSC previous year paper tests.`,
      keywords: `${WBPSC_KEYWORDS}, ${shortName}`,
      canonicalPath: "/wbpsc-clerkship-mock-test",
      ogTitle: `WBPSC Clerkship mock test — ${shortName}`,
    });
    return;
  }

  if (folder === "wb-tet" || folder === "WB Primary TET Question") {
    applyExamSeoPayload({
      title: `${shortName} | WB Primary TET Mock Test Online | MedhaHub`,
      description: `WB Primary TET mock test: ${shortName}. Practice Bengali, English, Math, EVS & Child Development sections with timer and scoring on MedhaHub.`,
      keywords: `${WB_TET_KEYWORDS}, ${shortName}`,
      canonicalPath: "/wb-tet-mock-test",
      ogTitle: `WB TET mock test — ${shortName}`,
    });
    return;
  }

  if (folder === "ssc-mts" || folder === "SSC" || folder === "MTS") {
    applyExamSeoPayload({
      title: `${shortName} | SSC MTS Mock Test Online | MedhaHub`,
      description: `SSC MTS mock test: ${shortName}. Practice GK, Reasoning & English MCQs with timer and instant results on MedhaHub.`,
      keywords: `${SSC_MTS_KEYWORDS}, ${shortName}`,
      canonicalPath: "/ssc-mts-mock-test",
      ogTitle: `SSC MTS mock test — ${shortName}`,
    });
    return;
  }

  if (folder === "ibps" || folder === "IBPS" || folder === "ibps-po") {
    applyExamSeoPayload({
      title: `${shortName} | IBPS PO Mock Test Online | MedhaHub`,
      description: `IBPS PO mock test: ${shortName}. Practice Reasoning, English & Quantitative Aptitude MCQs with timer and instant results on MedhaHub.`,
      keywords: `${IBPS_PO_KEYWORDS}, ${shortName}`,
      canonicalPath: "/ibps-po-mock-test",
      ogTitle: `IBPS PO mock test — ${shortName}`,
    });
    return;
  }

  applyExamSeoPayload({
    title: `${shortName} | Online Mock Test | MedhaHub`,
    description: `Timed mock test: ${shortName}. Practice government and competitive exam MCQs on MedhaHub.`,
    keywords: `online mock test, previous year paper MCQ, ${shortName}`,
    canonicalPath: "/pdf-mock-test",
    ogTitle: `Mock test — ${shortName}`,
  });
}

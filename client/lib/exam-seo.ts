/**
 * Client-side SEO updates for exam / mock-test routes (title, meta, OG, canonical, JSON-LD).
 */

export type ExamSeoProfile = "default" | "wbcs" | "police" | "police-constable" | "police-si" | "wbpsc-clerkship" | "wb-tet" | "ssc-mts" | "ibps-po" | "jtet" | "rrb-ntpc";

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

const JTET_KEYWORDS = [
  "JTET mock test 2026",
  "JTET previous year question paper",
  "Jharkhand TET question paper with answers",
  "JTET Paper 1 previous year paper",
  "JTET Paper 2 previous year paper",
  "Jharkhand Teacher Eligibility Test online practice",
  "JTET Child Development questions",
  "JTET preparation online free",
  "Jharkhand TET 2012 question paper",
  "JTET mock test free online",
].join(", ");

const RRB_NTPC_KEYWORDS = [
  "RRB NTPC mock test 2026",
  "RRB NTPC previous year question paper",
  "RRB NTPC CBT 1 question paper with answers",
  "Railway NTPC online practice free",
  "RRB NTPC preparation online",
  "RRB NTPC GK questions",
  "RRB NTPC reasoning questions",
  "RRB NTPC math questions",
  "আরআরবি এনটিপিসি মক টেস্ট",
  "Railway recruitment exam practice",
].join(", ");

const SYLLABUS_KEYWORDS = [
  "exam syllabus 2026",
  "exam pattern 2026",
  "know your exam syllabus",
  "WBCS syllabus 2026",
  "WBCS exam pattern",
  "SSC CGL syllabus 2026",
  "SSC CGL exam pattern",
  "IBPS PO syllabus 2026",
  "IBPS PO exam pattern",
  "UPSC syllabus 2026",
  "WB Police SI syllabus",
  "WB Police constable syllabus",
  "RRB NTPC syllabus 2026",
  "Railway Group D syllabus",
  "CTET syllabus 2026",
  "WB TET syllabus 2026",
  "JTET syllabus 2026",
  "SSC MTS syllabus 2026",
  "SSC CHSL syllabus",
  "WBPSC Clerkship syllabus",
  "NDA syllabus 2026",
  "government exam syllabus India",
  "competitive exam pattern",
  "exam marks distribution",
  "exam cutoff marks",
  "previous year cutoff",
].join(", ");

/** Question Hub landing variants */
export function applyQuestionHubExamSeo(profile: ExamSeoProfile) {
  if (profile === "wbcs") {
    applyExamSeoPayload({
      title:
        "WBCS Mock Test Free Online | Syllabus & Previous Year Question Papers | MedhaHub",
      description:
        "Practice WBCS (West Bengal Civil Service) with free online mock tests built from official previous-year prelims papers. Know WBCS syllabus 2026, exam pattern, marks distribution. Timed MCQs, instant scoring, and downloads — ideal for WBCS and WBPSC exam preparation.",
      keywords: `${WBCS_KEYWORDS}, WBCS syllabus 2026, WBCS exam pattern, WBCS prelims syllabus, WBCS mains syllabus, WBCS marks distribution`,
      canonicalPath: "/wbcs-mock-test",
      jsonLd: webPageJsonLd({
        name: "WBCS mock test, syllabus & previous year papers",
        description:
          "Free online WBCS mock tests, complete syllabus and West Bengal Civil Service previous year question papers for prelims practice.",
        path: "/wbcs-mock-test",
      }),
    });
    return;
  }

  if (profile === "police-si") {
    applyExamSeoPayload({
      title: "WBP SI Mock Test 2026 Free Online | পুলিশ সাব-ইন্সপেক্টর মক টেস্ট | MedhaHub",
      description:
        "Free WBP Sub-Inspector (SI) mock test 2026 online. Full-length practice sets based on actual WBP SI exam pattern — 100 MCQs, instant scoring, Bengali medium. পশ্চিমবঙ্গ পুলিশ সাব-ইন্সপেক্টর মক টেস্ট।",
      keywords: [
        "WBP SI mock test 2026",
        "WBP SI mock test free online",
        "West Bengal Police SI mock test",
        "WBP Sub Inspector previous year question paper",
        "WBP SI preliminary question paper",
        "WBP SI 2025 mock test",
        "WBP SI 2024 question paper",
        "WBP SI practice set Bengali",
        "পশ্চিমবঙ্গ পুলিশ সাব ইন্সপেক্টর মক টেস্ট",
        "পুলিশ এসআই প্র্যাকটিস সেট",
        "WBP SI online practice free",
        "WB Police SI exam preparation",
        "WBP SI exam pattern 2026",
        "WBP SI syllabus 2026",
        "WBP SI cutoff marks",
        "medhahub wbp si",
        "WB Police Sub Inspector online test",
      ].join(", "),
      canonicalPath: "/wbp-si-mock-test",
      ogTitle: "WBP SI Mock Test 2026 Free | পুলিশ সাব-ইন্সপেক্টর প্র্যাকটিস সেট | MedhaHub",
      ogDescription:
        "Free WBP SI mock tests online. 100 MCQs · Bengali medium · Instant scoring. Start your WBP Sub-Inspector preparation today.",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://medhahub.in/wbp-si-mock-test",
            name: "WBP SI Mock Test 2026 Free Online",
            description:
              "Free full-length WBP Sub-Inspector mock tests with instant scoring, timer and Bengali medium — based on actual exam pattern.",
            url: "https://medhahub.in/wbp-si-mock-test",
            inLanguage: ["en", "bn"],
            isPartOf: { "@type": "WebSite", name: "MedhaHub", url: "https://medhahub.in" },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://medhahub.in" },
                { "@type": "ListItem", position: 2, name: "Question Hub", item: "https://medhahub.in/question-hub" },
                { "@type": "ListItem", position: 3, name: "WBP SI Mock Test", item: "https://medhahub.in/wbp-si-mock-test" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the WBP SI mock test free on MedhaHub?", acceptedAnswer: { "@type": "Answer", text: "Yes. All WBP SI mock tests on MedhaHub are completely free. No registration required to attempt the tests." } },
              { "@type": "Question", name: "What is the WBP SI exam pattern?", acceptedAnswer: { "@type": "Answer", text: "The WBP Sub-Inspector Preliminary exam has 100 MCQs: General Knowledge & Current Affairs (50), Reasoning & Logical Analysis (25), Mathematics (15), English Language (10). Duration is 90 minutes." } },
              { "@type": "Question", name: "Are WBP SI questions available in Bengali?", acceptedAnswer: { "@type": "Answer", text: "Yes. WBP SI mock tests on MedhaHub are bilingual — questions and options are available in Bengali, matching the actual exam format." } },
              { "@type": "Question", name: "What is the WBP SI eligibility criteria?", acceptedAnswer: { "@type": "Answer", text: "Candidates must hold a Bachelor's degree from a recognised university. Age limit is 20–27 years (with relaxation for reserved categories). Physical standards and medical fitness tests also apply." } },
            ],
          },
        ],
      },
    });
    return;
  }

  if (profile === "police-constable") {
    applyExamSeoPayload({
      title: "WBP Constable Mock Test 2026 Free Online | পুলিশ কনস্টেবল মক টেস্ট | MedhaHub",
      description:
        "Free WBP Constable mock test 2026 online. 12 full-length practice sets based on actual WBP exam pattern — 85 MCQs, instant scoring, Bengali medium. পশ্চিমবঙ্গ পুলিশ কনস্টেবল মক টেস্ট।",
      keywords: [
        "WBP Constable mock test 2026", "WBP Constable mock test free", "WBP Constable mock test online",
        "West Bengal Police Constable mock test", "WBP Constable previous year question paper",
        "WBP Constable preliminary question paper", "WBP Constable 2025 mock test",
        "WBP Constable 2024 question paper", "WBP Constable 2021 question paper",
        "WBP Constable practice set Bengali", "পশ্চিমবঙ্গ পুলিশ কনস্টেবল মক টেস্ট",
        "পুলিশ কনস্টেবল প্র্যাকটিস সেট", "WBP Constable online practice free",
        "WB Police Constable exam preparation", "WBP Lady Constable previous year paper",
        "WBP Constable exam pattern 2026", "medhahub wbp constable",
      ].join(", "),
      canonicalPath: "/wbp-constable-mock-test",
      ogTitle: "WBP Constable Mock Test 2026 Free | পুলিশ কনস্টেবল প্র্যাকটিস সেট | MedhaHub",
      ogDescription:
        "12 free WBP Constable mock tests online. 85 MCQs · Bengali medium · Instant scoring. Start your WBP Constable preparation today.",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://medhahub.in/wbp-constable-mock-test",
            name: "WBP Constable Mock Test 2026 Free Online",
            description:
              "12 free full-length WBP Constable mock tests with instant scoring, timer and Bengali medium — based on actual exam pattern.",
            url: "https://medhahub.in/wbp-constable-mock-test",
            inLanguage: ["en", "bn"],
            isPartOf: { "@type": "WebSite", name: "MedhaHub", url: "https://medhahub.in" },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://medhahub.in" },
                { "@type": "ListItem", position: 2, name: "Question Hub", item: "https://medhahub.in/question-hub" },
                { "@type": "ListItem", position: 3, name: "WBP Constable Mock Test", item: "https://medhahub.in/wbp-constable-mock-test" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is WBP Constable mock test free on MedhaHub?", acceptedAnswer: { "@type": "Answer", text: "Yes. All WBP Constable mock tests on MedhaHub are completely free. No registration required to attempt the tests." } },
              { "@type": "Question", name: "How many WBP Constable mock tests are available?", acceptedAnswer: { "@type": "Answer", text: "MedhaHub offers 12 full-length WBP Constable mock tests based on the actual exam pattern — 85 questions each covering GK, Arithmetic, Reasoning and Bengali Language." } },
              { "@type": "Question", name: "What is the WBP Constable exam pattern?", acceptedAnswer: { "@type": "Answer", text: "The WBP Constable Preliminary exam has 85 MCQ questions for 85 marks: General Knowledge (40), Arithmetic (20), Reasoning (15), Bengali Language (10). Duration is 85 minutes." } },
              { "@type": "Question", name: "Are the questions in Bengali medium?", acceptedAnswer: { "@type": "Answer", text: "Yes. All WBP Constable mock tests on MedhaHub are bilingual — questions and options are available in Bengali, matching the actual exam format." } },
            ],
          },
        ],
      },
    });
    return;
  }

  if (profile === "police") {
    applyExamSeoPayload({
      title:
        "WBP Police Mock Test | Syllabus & Previous Year Question Papers Online | MedhaHub",
      description:
        "West Bengal Police (WBP) Constable and Lady Constable previous year question papers as free online mock tests. Know WB Police SI & Constable syllabus 2026, exam pattern, cutoff marks. Timed practice, answers, and PDFs for WBP recruitment exam preparation.",
      keywords: `${POLICE_KEYWORDS}, WB Police SI syllabus 2026, WB Police constable syllabus, WB Police exam pattern, WBP SI cutoff marks`,
      canonicalPath: "/wbp-police-mock-test",
      jsonLd: webPageJsonLd({
        name: "WBP police mock test, syllabus & previous year papers",
        description:
          "Free WBP Constable and Lady Constable mock tests, complete syllabus and previous year papers.",
        path: "/wbp-police-mock-test",
      }),
    });
    return;
  }

  if (profile === "wbpsc-clerkship") {
    applyExamSeoPayload({
      title:
        "WBPSC Clerkship Mock Test Free | Syllabus & Previous Year Question Papers (2019-2024) | MedhaHub",
      description:
        "Practice WBPSC Clerkship exam with free online mock tests from 2019, 2020, 2024 papers (all shifts). Know WBPSC Clerkship syllabus 2026, exam pattern, cutoff marks. Timed MCQs covering English, GK, and Arithmetic with instant scoring.",
      keywords: `${WBPSC_KEYWORDS}, WBPSC Clerkship syllabus 2026, WBPSC Clerkship exam pattern, WBPSC Clerkship cutoff marks`,
      canonicalPath: "/wbpsc-clerkship-mock-test",
      jsonLd: webPageJsonLd({
        name: "WBPSC Clerkship mock test, syllabus & previous year papers",
        description:
          "Free online WBPSC Clerkship mock tests, complete syllabus from 2019, 2020, 2024 question papers (all shifts).",
        path: "/wbpsc-clerkship-mock-test",
      }),
    });
    return;
  }

  if (profile === "wb-tet") {
    applyExamSeoPayload({
      title:
        "WB TET Mock Test Free | Syllabus & Primary TET Previous Year Question Papers | MedhaHub",
      description:
        "Practice WB Primary TET with free online mock tests from 2015, 2017, 2022, 2023 papers. Know WB TET syllabus 2026, exam pattern, cutoff marks. Bengali, English, Child Development, Math, and EVS sections with answers and scoring.",
      keywords: `${WB_TET_KEYWORDS}, WB TET syllabus 2026, WB Primary TET exam pattern, WB TET cutoff marks, WB TET marks distribution`,
      canonicalPath: "/wb-tet-mock-test",
      jsonLd: webPageJsonLd({
        name: "WB Primary TET mock test, syllabus & previous year papers",
        description:
          "Free WB Primary TET mock tests, complete syllabus from previous year question papers (2015–2023).",
        path: "/wb-tet-mock-test",
      }),
    });
    return;
  }

  if (profile === "ssc-mts") {
    applyExamSeoPayload({
      title:
        "SSC MTS Mock Test Free | Syllabus & Previous Year Question Papers 2019 & 2023 | MedhaHub",
      description:
        "Practice SSC MTS (Multi Tasking Staff) with free online mock tests from 2019 and 2023 papers (all shifts). Know SSC MTS syllabus 2026, exam pattern, cutoff marks. GK, Reasoning, English sections with answers and instant scoring.",
      keywords: `${SSC_MTS_KEYWORDS}, SSC MTS syllabus 2026, SSC MTS exam pattern, SSC MTS cutoff marks`,
      canonicalPath: "/ssc-mts-mock-test",
      jsonLd: webPageJsonLd({
        name: "SSC MTS mock test, syllabus & previous year papers",
        description:
          "Free SSC MTS mock tests, complete syllabus from previous year papers (2019, 2023 all shifts).",
        path: "/ssc-mts-mock-test",
      }),
    });
    return;
  }

  if (profile === "jtet") {
    applyExamSeoPayload({
      title:
        "JTET Mock Test Free | Syllabus & Jharkhand TET Previous Year Question Papers | MedhaHub",
      description:
        "Practice Jharkhand TET (JTET) with free online mock tests from previous year papers. Know JTET syllabus 2026, exam pattern, cutoff marks. Paper I & Paper II — Child Development, Language, Math, EVS & Social Science sections with answers and scoring.",
      keywords: `${JTET_KEYWORDS}, JTET syllabus 2026, JTET exam pattern, Jharkhand TET cutoff marks`,
      canonicalPath: "/jtet-mock-test",
      jsonLd: webPageJsonLd({
        name: "JTET mock test, syllabus & previous year papers",
        description:
          "Free Jharkhand TET mock tests, complete syllabus and previous year question papers.",
        path: "/jtet-mock-test",
      }),
    });
    return;
  }

  if (profile === "rrb-ntpc") {
    applyExamSeoPayload({
      title:
        "RRB NTPC Mock Test Free | Previous Year Question Papers CBT 1 & CBT 2 | MedhaHub",
      description:
        "Practice RRB NTPC (Railway Recruitment Board) with free online mock tests from previous year papers. Know RRB NTPC syllabus 2026, exam pattern, cutoff marks. GK, Reasoning, Math sections with answers and instant scoring.",
      keywords: `${RRB_NTPC_KEYWORDS}, RRB NTPC syllabus 2026, RRB NTPC exam pattern, Railway NTPC cutoff marks`,
      canonicalPath: "/rrb-ntpc-mock-test",
      jsonLd: webPageJsonLd({
        name: "RRB NTPC mock test, syllabus & previous year papers",
        description:
          "Free RRB NTPC mock tests, complete syllabus and previous year question papers for CBT 1 & CBT 2.",
        path: "/rrb-ntpc-mock-test",
      }),
    });
    return;
  }

  if (profile === "ibps-po") {
    applyExamSeoPayload({
      title:
        "IBPS PO Mock Test Free | Previous Year Papers & AI Practice | MedhaHub",
      description:
        "Practice IBPS PO with free online mock tests from previous year papers. Know IBPS PO syllabus 2026, exam pattern, cutoff marks. Reasoning, Quant & English sections with instant scoring.",
      keywords: `${IBPS_PO_KEYWORDS}, IBPS PO syllabus 2026, IBPS PO exam pattern, IBPS PO cutoff marks`,
      canonicalPath: "/ibps-po-mock-test",
      jsonLd: webPageJsonLd({
        name: "IBPS PO mock test, syllabus & previous year papers",
        description:
          "Free IBPS PO mock tests, complete syllabus and previous year question papers for Prelims & Mains.",
        path: "/ibps-po-mock-test",
      }),
    });
    return;
  }

  applyExamSeoPayload({
    title:
      "Free Mock Tests & Previous Year Papers 2026 | MedhaHub",
    description:
      "Know your exam syllabus & pattern 2026 — WBCS, WB Police SI, SSC CGL, IBPS PO, UPSC, Railway, CTET, JTET. Download previous year question papers free. Practice online mock tests for government, banking & teaching exams. Complete exam pattern, marks distribution, cutoff marks & preparation tips on MedhaHub.",
    keywords: [
      ...WBCS_KEYWORDS.split(", "),
      ...POLICE_KEYWORDS.split(", "),
      ...WBPSC_KEYWORDS.split(", "),
      ...WB_TET_KEYWORDS.split(", "),
      ...SSC_MTS_KEYWORDS.split(", "),
      ...IBPS_PO_KEYWORDS.split(", "),
      ...JTET_KEYWORDS.split(", "),
      ...RRB_NTPC_KEYWORDS.split(", "),
      ...SYLLABUS_KEYWORDS.split(", "),
      "SSC CGL previous year question paper",
      "সরকারি চাকরির পুরনো প্রশ্নপত্র",
      "পশ্চিমবঙ্গ সরকারি চাকরি প্রস্তুতি",
    ].join(", "),
    canonicalPath: "/question-hub",
    jsonLd: webPageJsonLd({
      name: "Previous Question Set — Exam Syllabus, Mock Tests & Previous Year Papers | MedhaHub",
      description:
        "Know your exam syllabus 2026, practice mock tests, and download previous year papers for WBP, WBCS, WBPSC, WB TET, SSC, IBPS PO & JTET on MedhaHub.",
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

  if (folder === "jtet" || folder === "JTET") {
    applyExamSeoPayload({
      title: `${shortName} | JTET Mock Test Online | MedhaHub`,
      description: `Jharkhand TET mock test: ${shortName}. Practice Child Development, Language, Math & EVS MCQs with timer and instant results on MedhaHub.`,
      keywords: `${JTET_KEYWORDS}, ${shortName}`,
      canonicalPath: "/jtet-mock-test",
      ogTitle: `JTET mock test — ${shortName}`,
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

import { useEffect } from "react";
import PremiumNavbar from "@/components/premium/PremiumNavbar";
import PremiumHero from "@/components/premium/PremiumHero";
import Footer from "@/components/Footer";
import PremiumCTA from "@/components/premium/PremiumCTA";
import PremiumFeatures from "@/components/premium/PremiumFeatures";
import PremiumHowItWorks from "@/components/premium/PremiumHowItWorks";
import PremiumContact from "@/components/premium/PremiumContact";
import PremiumTestimonials from "@/components/premium/PremiumTestimonials";
import PremiumPricing from "@/components/premium/PremiumPricing";
import PremiumStats from "@/components/premium/PremiumStats";
import PremiumFAQ from "@/components/premium/PremiumFAQ";
import PremiumInterviewTypes from "@/components/premium/PremiumInterviewTypes";
import GovtPracticeSection from "@/components/premium/GovtPracticeSection";
import StudyToolsSection from "@/components/premium/StudyToolsSection";
import FreeToolsSection from "@/components/premium/FreeToolsSection";
import ExamSyllabusSection from "@/components/premium/ExamSyllabusSection";
import { applyExamSeoPayload } from "@/lib/exam-seo";

function applyHomepageSeo() {
  applyExamSeoPayload({
    title: "MedhaHub — Free WBCS, WBPSC, WB Police & TET Mock Tests 2026",
    description:
      "Free mock tests & PYQs for WBCS, WBPSC Clerkship, WB Police SI/Constable & Primary TET. AI scoring, instant results & Bengali support. Start free!",
    keywords:
      "WBCS mock test 2026, WBPSC clerkship mock test, WB Police SI mock test, WB Primary TET mock test, West Bengal govt exam preparation, free mock test online, previous year question paper, MedhaHub",
    canonicalPath: "/",
    ogTitle: "MedhaHub — Free WBCS, WBPSC, WB Police & TET Mock Tests 2026",
    ogDescription:
      "Free mock tests & previous year papers for WBCS, WBPSC, WB Police & TET. AI-powered scoring, instant results & Bengali support.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MedhaHub",
      url: "https://medhahub.in",
      description: "Free exam preparation platform — WBCS, WBPSC, WB Police & TET mock tests with previous year papers, AI scoring & Bengali support.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://medhahub.in/question-hub?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
      publisher: { "@type": "Organization", name: "MedhaHub", url: "https://medhahub.in" },
    },
  });
}

export default function PremiumLanding() {
  useEffect(() => {
    applyHomepageSeo();
  }, []);
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <PremiumNavbar />

      {/* Hero Section */}
      <PremiumHero />


 {/* Free Student Tools (CGPA, Age, Salary, Eligibility, Typing) */}
      <FreeToolsSection />

    
        {/* Exam Syllabus Explorer */}
      <ExamSyllabusSection />
      {/* Social-proof numbers */}
      <PremiumStats />


      {/*  <PremiumHowItWorks /> */}
     

      {/* Interview Categories */}
      <PremiumInterviewTypes />

      {/* Government Exam Practice */}
      <GovtPracticeSection />


     

  

      {/* Premium Features Section */}
      <PremiumFeatures />


  {/* Study Tools */}
      <StudyToolsSection />
      {/* Testimonials */}
      <PremiumTestimonials />

      {/* Pricing */}
      <PremiumPricing />

      {/* FAQ */}
      <PremiumFAQ />

      {/* Contact Section */}
      <PremiumContact />

      {/* CTA Section */}
      <PremiumCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}


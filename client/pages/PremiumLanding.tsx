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
    title: "MedhaHub – West Bengal Govt Exam Preparation 2026 | WBCS, WBPSC, WB Police, TET Mock Tests",
    description:
      "Free mock tests, previous year question papers & AI study plans for WBCS, WBPSC Clerkship, WB Police SI/Constable, WB Primary TET & SSC exams. Bengali language support, instant scoring & 200+ company interview questions. Start preparing now!",
    keywords:
      "WBCS mock test 2026, WBPSC clerkship mock test, WB Police SI mock test, WB Primary TET mock test, West Bengal govt exam preparation, সরকারি পরীক্ষার প্রস্তুতি, previous year question paper, MedhaHub, free mock test online, AI study plan, company interview questions",
    canonicalPath: "/",
    ogTitle: "MedhaHub – #1 WB Govt Exam Prep Platform | Free Mock Tests & PYQs",
    ogDescription:
      "Practice WBCS, WBPSC, WB Police & TET exams with free mock tests, previous year papers, AI scoring & Bengali support. Join 1 lakh+ aspirants!",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MedhaHub",
      url: "https://medhahub.in",
      description: "West Bengal Government Exam Preparation Platform with free mock tests, previous year papers & AI-powered study plans.",
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
    <div className="min-h-screen bg-background overflow-hidden">
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
    </div>
  );
}


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

export default function PremiumLanding() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <PremiumNavbar />

      {/* Hero Section */}
      <PremiumHero />

      {/* Social-proof numbers */}
      <PremiumStats />

      {/* How It Works Section */}
      <PremiumHowItWorks />

      {/* Interview Categories */}
      <PremiumInterviewTypes />

      {/* Government Exam Practice */}
      <GovtPracticeSection />

      {/* Study Tools */}
      <StudyToolsSection />

      {/* Premium Features Section */}
      <PremiumFeatures />

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


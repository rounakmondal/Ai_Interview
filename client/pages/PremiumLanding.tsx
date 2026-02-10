import PremiumNavbar from "@/components/premium/PremiumNavbar";
import PremiumHero from "@/components/premium/PremiumHero";
import Footer from "@/components/Footer";
import PremiumCTA from "@/components/premium/PremiumCTA";
import PremiumFeatures from "@/components/premium/PremiumFeatures";
import PremiumHowItWorks from "@/components/premium/PremiumHowItWorks";
import PremiumContact from "@/components/premium/PremiumContact";

export default function PremiumLanding() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <PremiumNavbar />

      {/* Hero Section */}
      <PremiumHero />

      {/* How It Works Section */}
      <PremiumHowItWorks />

      {/* Premium Features Section */}
      <PremiumFeatures />

      {/* Contact Section */}
      <PremiumContact />

      {/* CTA Section */}
      <PremiumCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}

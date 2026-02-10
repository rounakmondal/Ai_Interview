import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// X (Twitter) Icon
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// InterviewAI Logo
const InterviewAILogo = () => (
  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
    AI
  </div>
);

export default function Footer() {
  const footerLinks = {
    resources: [
      { label: "Compare", href: "#" },
      { label: "Blog", href: "#" },
    ],
    company: [
      { label: "Book a demo", href: "#contact" },
      { label: "Contact Us", href: "#contact" },
    ],
    product: [
      { label: "AI Interviewer", href: "/setup" },
    ],
    location: [
      { label: "India", href: "#" },
    ],
    legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  };

  return (
    <footer className="relative py-4 sm:py-6 overflow-hidden">
      {/* Background with wave patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/50 via-indigo-100/30 to-indigo-50/20 dark:from-indigo-950/30 dark:via-indigo-950/20 dark:to-background">
        {/* Wave SVG patterns */}
        <svg
          className="absolute bottom-0 left-0 w-full h-32 text-indigo-200/30 dark:text-indigo-900/20"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="absolute top-0 right-0 w-full h-24 text-indigo-200/20 dark:text-indigo-900/10 rotate-180"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 0 480 120 720 60C960 0 1200 120 1440 60V120H0V60Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer container with rounded corners */}
        <div className="bg-[#2F50B7] dark:bg-[#1e3a8a] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Section */}
            <div className="space-y-4">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <InterviewAILogo />
                <span className="text-2xl font-bold text-white">InterviewAI</span>
              </div>

              {/* Tagline */}
              <p className="text-white/80 text-lg max-w-sm">
                Master your interviews with AI-powered practice and real-time feedback.
              </p>

              {/* CTA Button */}
              <div>
                <Link to="/setup">
                  <Button 
                    className="bg-white text-[#2F50B7] hover:bg-white/90 font-semibold px-8 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Practicing
                  </Button>
                </Link>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="X (Twitter)"
                >
                  <XIcon />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>

              {/* Copyright */}
              <p className="text-white/60 text-sm pt-4">
                © 2024 InterviewAI. All rights reserved.
              </p>
            </div>

            {/* Right Section - Link Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Resources */}
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-white/70 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location */}
              <div>
                <h4 className="text-white font-semibold mb-4">Location</h4>
                <ul className="space-y-3">
                  {footerLinks.location.map((link) => (
                    <li key={link.label}>
                      <span className="text-white/70 text-sm">
                        {link.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Legal section under Location */}
                <h4 className="text-white font-semibold mt-6 mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

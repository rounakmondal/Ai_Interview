import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, BookOpen, MessageCircle, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const QUICK_LINKS = [
  { to: "/", label: "Home", icon: Home, description: "Back to the main page" },
  { to: "/govt-practice", label: "Practice Exams", icon: BookOpen, description: "WBCS, SSC, Police & more" },
  { to: "/mock-test", label: "Mock Tests", icon: Search, description: "Free timed mock tests" },
  { to: "/contact", label: "Report Issue", icon: MessageCircle, description: "Let us know about this" },
];

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-3xl flex flex-col items-center text-center">

        {/* Back link */}
        <Link to="/" className="self-start mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero */}
        <div className="mb-2 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-7xl font-extrabold tracking-tight text-primary mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
        <p className="text-muted-foreground max-w-md mb-2">
          The page you're looking for doesn't exist or may have been moved. Don't worry — MedhaHub is working fine!
        </p>
        <p className="text-xs text-muted-foreground/70 font-mono mb-8 break-all">
          {location.pathname}
        </p>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">
              <MessageCircle className="w-4 h-4 mr-2" />
              Report Broken Link
            </Link>
          </Button>
        </div>

        {/* Helpful links */}
        <p className="text-sm font-medium text-muted-foreground mb-4">Or try one of these popular pages:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {QUICK_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

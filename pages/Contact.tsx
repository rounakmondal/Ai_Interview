import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, HelpCircle, Bug, Lightbulb, Building } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24–48 hours. Check your inbox for a confirmation email.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
      });
    } catch (err: unknown) {
      toast({
        title: "Failed to Send",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Contact Us</h1>
        </div>

        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          Have questions, feedback, or need assistance? We're here to help! Reach out to us using the form below or through any of our contact channels.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="bug">Report a Bug</option>
                      <option value="partnership">Business & Partnerships</option>
                      <option value="privacy">Privacy & Data</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide as much detail as possible..."
                      rows={8}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Quick Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">Email</p>
                  <a href="mailto:aiinterview0@gmail.com" className="text-primary hover:underline">
                    aiinterview0@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">General Inquiries</p>
                  <a href="mailto:aiinterview0@gmail.com" className="text-primary hover:underline">
                    aiinterview0@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">Business & Partnerships</p>
                  <a href="mailto:aiinterview0@gmail.com" className="text-primary hover:underline">
                    aiinterview0@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Common Topics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Bug className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Technical Issues</p>
                      <p className="text-xs text-muted-foreground">
                        Problems with microphone, camera, or app functionality
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Billing Questions</p>
                      <p className="text-xs text-muted-foreground">
                        Subscriptions, payments, refunds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Feature Requests</p>
                      <p className="text-xs text-muted-foreground">
                        Suggestions for improvements
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Check out our documentation and common solutions before reaching out:
                </p>
                <ul className="text-sm space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline">
                      Troubleshooting Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">
                      Getting Started Tutorial
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Privacy & Legal</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For data privacy requests, legal matters, or compliance inquiries:
                  </p>
                  <a href="mailto:aiinterview0@gmail.com" className="text-primary hover:underline text-sm">
                    aiinterview0@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Media & Press</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Journalists and media inquiries:
                  </p>
                  <a href="mailto:aiinterview0@gmail.com" className="text-primary hover:underline text-sm">
                    aiinterview0@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Career Opportunities</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Interested in joining our team?
                  </p>
                  <a href="mailto:aiinterview0@gmail.com" className="text-primary hover:underline text-sm">
                    aiinterview0@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground">
            We value your feedback and are committed to providing excellent customer service.
            <br />
            Your success is our priority!
          </p>
        </div>
      </div>
    </div>
  );
}

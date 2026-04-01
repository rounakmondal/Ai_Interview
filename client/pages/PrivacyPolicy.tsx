import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Welcome to our AI Interview Practice Platform. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <h4 className="font-semibold mt-4">2.1 Information You Provide</h4>
              <ul>
                <li>Account information (name, email address)</li>
                <li>Resume/CV content and career information</li>
                <li>Interview session data (responses, performance metrics)</li>
                <li>Feedback and communications</li>
              </ul>

              <h4 className="font-semibold mt-4">2.2 Automatically Collected Information</h4>
              <ul>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and session data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h4 className="font-semibold mt-4">2.3 Audio and Video Data</h4>
              <ul>
                <li>Voice recordings during interview practice sessions</li>
                <li>Video recordings if camera is enabled (only processed locally unless explicitly saved)</li>
                <li>Speech-to-text transcriptions for evaluation purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain our AI interview practice service</li>
                <li>Generate personalized interview questions and feedback</li>
                <li>Analyze your performance and provide detailed evaluations</li>
                <li>Improve our AI models and service quality</li>
                <li>Communicate with you about your account and updates</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Secure servers and regular security audits</li>
                <li>Access controls and authentication measures</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="mt-4">
                Audio and video recordings are processed securely and retained only as long as necessary for service provision and improvement. You may request deletion of your data at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>We do not sell your personal information. We may share your data only in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in providing our service (AI APIs, hosting providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                We use cookies and similar technologies to enhance user experience, analyze usage patterns, and maintain session information. You can control cookies through your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Our service is not intended for users under 16 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notice on our platform. Continued use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>Email: <a href="mailto:medhahubfryou@gmail.com" className="text-primary hover:underline">medhahubfryou@gmail.com</a></li>
                <li>Contact Page: <Link to="/contact" className="text-primary hover:underline">Visit our Contact page</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            By using our AI Interview Practice Platform, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  );
}

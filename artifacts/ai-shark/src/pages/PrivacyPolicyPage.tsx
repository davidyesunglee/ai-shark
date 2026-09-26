import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@/assets/shark-mark.svg";
import { useSEO } from "@/lib/useSEO";

export default function PrivacyPolicyPage() {
  useSEO({
    title: "Privacy Policy — AI Shark",
    description: "AI Shark privacy policy. Learn how we collect, use, store, and protect your data when you use our AI business plan assessment service.",
    canonical: "/privacy",
  });
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="border-b" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="AI Shark Logo" className="h-8 w-auto" data-testid="img-logo" />
              <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
            </div>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">
              <Button variant="ghost" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center" data-testid="text-privacy-title">
            Privacy Policy
          </h1>
          <p className="text-center text-muted-foreground mb-8">Last updated: February 2026</p>
          
          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AI Shark ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our business plan assessment service at aishark.org.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Account information (name, email address, password)</li>
                <li>Registration information (phone number, address, company details)</li>
                <li>Business plan documents you upload for analysis</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your business plan assessments</li>
                <li>Process payments and prevent fraud</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">4. Document Handling</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Business plan documents you upload are processed by our AI system to generate assessments. We store document content securely and use it solely for providing our analysis service. We do not share your business plans with third parties.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">5. Payment Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All payment processing is handled by Stripe, a PCI Level 1 certified payment processor. We do not store your credit card information on our servers.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">We may use third-party services that collect, monitor, and analyze data:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Stripe for payment processing</li>
                <li>Google Analytics for website analytics</li>
                <li>Advertising networks for displaying relevant ads</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">9. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at support@aishark.org.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. For questions or assistance, contact us at{" "}<a href="mailto:info@aishark.org" className="underline hover:text-foreground" data-testid="link-contact-email">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}

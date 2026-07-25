import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@/assets/shark-mark.svg";
import { useSEO } from "@/lib/useSEO";

export default function TermsOfServicePage() {
  useSEO({
    title: "Terms of Service — AI Shark",
    description: "AI Shark terms of service. Pricing, refunds, liability disclaimers, and acceptable use rules for our AI business plan assessment platform.",
    canonical: "/terms",
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
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center" data-testid="text-terms-title">
            Terms of Service
          </h1>
          <p className="text-center text-muted-foreground mb-8">Last updated: February 2026</p>
          
          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing or using AI Shark's services at aishark.org, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AI Shark provides AI-powered business plan assessment services. Users can upload business plan documents to receive analysis and scoring based on bank debt financing criteria. Our service is designed to provide informational feedback and should not be considered financial advice.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">4. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Our service offers the following payment options:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li><strong>Free Tier:</strong> Registration only, no evaluations</li>
                <li><strong>Monthly Subscription:</strong> $6.99/month plus applicable taxes, includes 2 evaluations per month</li>
                <li><strong>One-Time Payment:</strong> $13.99 plus applicable taxes, includes 1 evaluation</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All payments are processed securely through Stripe. Subscription fees are billed monthly and can be cancelled at any time. Unused evaluation credits do not roll over to the next billing period.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">5. Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Due to the digital nature of our services, refunds are generally not provided once an evaluation has been completed. If you experience technical issues preventing you from receiving your assessment, please contact us within 7 days for resolution.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of all business plans and documents you upload. By uploading content, you grant us a limited license to process and analyze your documents for the purpose of providing our assessment service. We do not claim ownership of your content.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AI Shark provides analytical perspectives on business plan documentation for informational purposes only. Our assessments do not guarantee any particular outcome with banks or financial institutions. Results should not be construed as a decision to fund or not fund any business. We make no warranties about the accuracy, reliability, or completeness of our assessments.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To the maximum extent permitted by law, AI Shark shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services, including but not limited to loss of profits, business opportunities, or funding decisions.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">9. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Upload malicious files or content</li>
                <li>Attempt to reverse-engineer our AI analysis system</li>
                <li>Share your account credentials with others</li>
                <li>Use our service for any illegal purpose</li>
                <li>Interfere with or disrupt our services</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account at any time for violations of these Terms of Service. You may cancel your account at any time by contacting support.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by email or through our service. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">12. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us at support@aishark.org.
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

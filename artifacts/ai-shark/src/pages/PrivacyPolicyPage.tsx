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
          <p className="text-center text-muted-foreground mb-8">Last updated: September 2026</p>
          
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
                 <li>Business plan files and text submitted for analysis, and generated assessment results</li>
                 <li>For free previews: your email and the resulting score and grade</li>
                 <li>Usage and abuse-prevention data, including a hashed IP address, user agent, referrer and request activity</li>
                 <li>Billing details and payment status; card payments are handled by Stripe</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your business plan assessments</li>
                <li>Process payments and prevent fraud</li>
                 <li>Email free-preview scores and follow-up information (with an unsubscribe option), as well as technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3">4. Document Handling</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 For a free preview, the uploaded file is parsed in memory and is not saved as an assessment. Its extracted text is sent for AI analysis. We retain the email address, score and grade as a lead for follow-up messages, and record request telemetry for abuse prevention. For a paid assessment, we retain the extracted document text and generated assessment in your account; the original uploaded file is processed in memory rather than stored as a separate file. Do not submit information you are not authorized to share.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">5. Payment Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 Card payments and subscription management are handled by Stripe. We retain billing status and transaction-related records for service operation; we do not store full payment card numbers on our servers.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 We use technical and organizational measures to protect information, but no system can guarantee absolute security. Use a strong password and contact us if you suspect unauthorized access.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">7. Third-Party Services</h2>
               <p className="text-muted-foreground leading-relaxed mb-2">The service relies on providers for key functions:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                 <li>Gemini through Replit AI Integrations processes extracted document text to generate free previews and paid assessments.</li>
                 <li>Stripe handles payments and subscriptions.</li>
                 <li>Email delivery providers may process addresses and message content for service and follow-up emails.</li>
              </ul>
               <p className="text-muted-foreground leading-relaxed mb-4">
                 These providers may handle information according to their own terms. We do not make a guarantee about AI provider training or retention practices.
               </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 We use session cookies to support account access and record site events and abuse-prevention activity. You can control cookies in your browser, though disabling them may prevent account features from working.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3">9. Your Rights</h2>
               <p className="text-muted-foreground leading-relaxed mb-2">You can:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                 <li>View your paid assessments in your dashboard and delete individual assessments there. Deleting an assessment removes its saved record, including the extracted text and results, from the application database; it does not automatically delete account details, billing records, teaser leads or site events.</li>
                 <li>Unsubscribe from free-preview follow-up emails using the link in the result or email. Unsubscribing stops those emails; it does not erase the lead record.</li>
                 <li>Contact us to ask about access, correction, or deletion of other personal information, subject to applicable obligations.</li>
              </ul>
               <p className="text-muted-foreground leading-relaxed mb-4">
                 We do not state a fixed retention period for stored assessments, leads, or site events here. Contact us with specific retention or deletion questions.
               </p>

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
                 If you have any questions about this Privacy Policy or a data request, please contact us at <a href="mailto:info@aishark.org" className="underline">info@aishark.org</a>.
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

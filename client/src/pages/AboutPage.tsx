import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
          </div>
          <Link href="/">
            <Button variant="ghost" data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-8 text-center" data-testid="text-about-title">
            About AI Shark
          </h1>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed" data-testid="text-about-content">
                AI Shark is the premier business plan evaluation agent. AI Shark measures your plan content, narrative and ratios against well recognized criteria and metrics utilized by banking and financial lenders. AI Shark provides an evaluation with feedback on recommended plan modifications, enhancing your likely approval and business success. Entrepreneurs have commented on their improved plans on global social media platforms. Join us and improve your plan today!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

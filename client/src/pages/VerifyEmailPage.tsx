import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link, useSearch } from "wouter";
import logoImage from "@/assets/shark-mark.svg";

export default function VerifyEmailPage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          return res.json().then((data) => {
            setStatus("error");
            setMessage(data.message || "Verification failed.");
          });
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred during verification.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        </div>
      </header>

      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            {status === "loading" && (
              <div role="status" aria-live="polite">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" aria-hidden="true" />
                <CardTitle data-testid="text-verify-title">Verifying Email...</CardTitle>
                <CardDescription data-testid="text-verify-description">
                  Please wait while we verify your email address.
                </CardDescription>
              </div>
            )}
            {status === "success" && (
              <div role="status" aria-live="polite">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" aria-hidden="true" />
                <CardTitle data-testid="text-verify-title">Email Verified!</CardTitle>
                <CardDescription data-testid="text-verify-description">
                  {message}
                </CardDescription>
              </div>
            )}
            {status === "error" && (
              <div role="alert">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                <CardTitle data-testid="text-verify-title">Verification Failed</CardTitle>
                <CardDescription data-testid="text-verify-description">
                  {message}
                </CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {status !== "loading" && (
              <Link href="/">
                <Button data-testid="button-continue">Continue to App</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

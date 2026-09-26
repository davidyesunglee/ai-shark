import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const [hadPendingUpload, setHadPendingUpload] = useState(false);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/billing/status"] });
    if (sessionStorage.getItem("pendingUpload") === "1") {
      setHadPendingUpload(true);
      sessionStorage.removeItem("pendingUpload");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <main>
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for your purchase. Your evaluation credits have been added to your account.
            </p>
            <p className="text-sm text-muted-foreground">
              {hadPendingUpload
                ? "You're all set — upload the business plan you were about to analyze."
                : "You can now upload business plans and receive AI-powered assessments."}
            </p>
            <div className="pt-4 space-y-2">
              <Button
                className="w-full"
                data-testid="button-upload-plan"
                onClick={() => setLocation("/dashboard?upload=1")}
              >
                Upload Business Plan
              </Button>
              <Button
                variant="outline"
                className="w-full"
                data-testid="button-go-dashboard"
                onClick={() => setLocation("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AboutPage from "@/pages/AboutPage";
import EducationPage from "@/pages/EducationPage";
import RegistrationPage from "@/pages/RegistrationPage";
import PricingPage from "@/pages/PricingPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import ContactPage from "@/pages/ContactPage";
import AdminFeedbackPage from "@/pages/AdminFeedbackPage";
import { useAuth } from "@/hooks/use-auth";
import { AccessibilityToolbar } from "@/components/AccessibilityToolbar";
import { Loader2 } from "lucide-react";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-screen" role="status" aria-label="Loading application">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading application...</span>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/about" component={AboutPage} />
      <Route path="/education" component={EducationPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/feedback" component={AdminFeedbackPage} />
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
      </Route>
      <Route path="/signup">
        {isAuthenticated ? <Redirect to="/" /> : <SignupPage />}
      </Route>
      <Route path="/verify-email" component={VerifyEmailPage} />
      <Route path="/register" component={RegistrationPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/payment/success" component={PaymentSuccessPage} />
      <Route path="/dashboard">
        {isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}
      </Route>
      {!isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <Route path="/" component={Dashboard} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <AccessibilityToolbar />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { useEffect } from "react";
import { trackPageview } from "@/lib/useSEO";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import { ClerkProviderWithRoutes, SignInPage, SignUpPage, ProtectedPage } from "@/components/ClerkAuth";
import AboutPage from "@/pages/AboutPage";
import EducationPage from "@/pages/EducationPage";
import RegistrationPage from "@/pages/RegistrationPage";
import PricingPage from "@/pages/PricingPage";
import SamplePage from "@/pages/SamplePage";
import CalculatorPage from "@/pages/CalculatorPage";
import DebtToEquityCalculatorPage from "@/pages/DebtToEquityCalculatorPage";
import GlossaryPage from "@/pages/GlossaryPage";
import PartnersPage from "@/pages/PartnersPage";
import GuidesPage from "@/pages/GuidesPage";
import GuidePage from "@/pages/GuidePage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import ContactPage from "@/pages/ContactPage";
import AdminFeedbackPage from "@/pages/AdminFeedbackPage";
import { useAuth, Show } from "@clerk/react";
import { AccessibilityToolbar } from "@/components/AccessibilityToolbar";
import { Loader2 } from "lucide-react";

function Router() {
  const { isLoaded } = useAuth();
  const [location] = useLocation();
  useEffect(() => {
    trackPageview(location);
  }, [location]);

  if (!isLoaded) {
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
      <Route path="/guides" component={GuidesPage} />
      <Route path="/guides/:slug" component={GuidePage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/feedback" component={AdminFeedbackPage} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/login"><Redirect to="/sign-in" /></Route>
      <Route path="/signup"><Redirect to="/sign-up" /></Route>
      <Route path="/verify-email"><Redirect to="/sign-in" /></Route>
      <Route path="/register"><ProtectedPage><RegistrationPage /></ProtectedPage></Route>
      <Route path="/pricing" component={PricingPage} />
      <Route path="/sample" component={SamplePage} />
      <Route path="/calculator" component={CalculatorPage} />
      <Route path="/debt-to-equity-calculator" component={DebtToEquityCalculatorPage} />
      <Route path="/glossary" component={GlossaryPage} />
      <Route path="/partners" component={PartnersPage} />
      <Route path="/payment/success"><ProtectedPage><PaymentSuccessPage /></ProtectedPage></Route>
      <Route path="/dashboard">
        <ProtectedPage><Dashboard /></ProtectedPage>
      </Route>
      <Route path="/">
        <Show when="signed-in"><Redirect to="/dashboard" /></Show>
        <Show when="signed-out"><LandingPage /></Show>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ClerkProviderWithRoutes>
        <TooltipProvider>
          <Toaster />
          <Router />
          <AccessibilityToolbar />
        </TooltipProvider>
      </ClerkProviderWithRoutes>
    </WouterRouter>
  );
}

export default App;

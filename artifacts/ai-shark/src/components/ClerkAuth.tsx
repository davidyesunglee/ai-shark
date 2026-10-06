import { useEffect, useRef, type ReactNode } from "react";
import { ClerkProvider, SignIn, SignUp, useClerk, useAuth } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Redirect, useLocation } from "wouter";
import { QueryClientProvider, useQueryClient, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

// This app uses Tailwind 3, so there is no Clerk CSS layer declaration.
const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#0846AA",
    colorForeground: "#0f172a",
    colorMutedForeground: "#475569",
    colorDanger: "#b91c1c",
    colorBackground: "#ffffff",
    colorInput: "#ffffff",
    colorInputForeground: "#0f172a",
    colorNeutral: "#64748b",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-slate-900",
    headerSubtitle: "text-slate-600",
    socialButtonsBlockButtonText: "text-slate-900",
    formFieldLabel: "text-slate-900",
    footerActionLink: "text-blue-800",
    footerActionText: "text-slate-600",
    dividerText: "text-slate-600",
    identityPreviewEditButton: "text-blue-800",
    formFieldSuccessText: "text-green-800",
    alertText: "text-red-800",
    logoBox: "mb-4",
    logoImage: "h-14 w-auto",
    socialButtonsBlockButton: "border-slate-300 bg-white",
    formButtonPrimary: "bg-blue-800 text-white",
    formFieldInput: "bg-white text-slate-900 border-slate-300",
    footerAction: "bg-slate-50",
    dividerLine: "bg-slate-200",
    alert: "bg-red-50 border-red-200",
    otpCodeFieldInput: "bg-white text-slate-900 border-slate-300",
    formFieldRow: "mb-4",
    main: "gap-4",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

export function ClerkProviderWithRoutes({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={`${basePath}/dashboard`}
      signUpFallbackRedirectUrl={`${basePath}/dashboard`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back to AI Shark",
            subtitle: "Sign in to review your business plans",
          },
        },
        signUp: {
          start: {
            title: "Create your AI Shark account",
            subtitle: "Get started with your business plan review",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        {children}
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

export function ProtectedPage({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { isLoading, error } = useQuery({
    queryKey: ["/api/registration/status"],
    enabled: isLoaded && isSignedIn,
  });
  if (!isLoaded) return <div role="status">Loading account…</div>;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  if (isLoading) return <div role="status">Loading account…</div>;
  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" role="alert" data-testid="account-access-error">
        <h1 className="text-xl font-semibold">Account access unavailable</h1>
        <p>Your account could not be loaded. Please try again or contact support.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/registration/status"] })}>Try again</Button>
        <Button variant="outline" onClick={() => signOut({ redirectUrl: basePath || "/" })}>Log out</Button>
      </main>
    );
  }
  return children;
}
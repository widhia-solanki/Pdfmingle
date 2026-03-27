import { useEffect, useState } from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ShieldAlert } from "lucide-react";

import { AdminFeedbackDashboard } from "@/components/admin/AdminFeedbackDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { useToast } from "@/hooks/use-toast";

const ADMIN_AUTH_STORAGE_KEY = "admin_auth";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

const AdminPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_ADMIN_EMAIL && process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isConfigured) {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      setAuthStatus("unauthenticated");
      return;
    }

    const isAuthenticated = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
    setAuthStatus(isAuthenticated ? "authenticated" : "unauthenticated");
  }, [isConfigured]);

  const handleLogin = ({ email, password }: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(null);

    const expectedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!expectedEmail || !expectedPassword) {
      setError("Admin credentials are not configured.");
      setIsSubmitting(false);

      toast({
        title: "Missing admin configuration",
        description: "Set the admin email and password environment variables first.",
        variant: "destructive",
      });
      return;
    }

    const emailMatches = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
    const passwordMatches = password === expectedPassword;

    if (!emailMatches || !passwordMatches) {
      setError("Invalid admin credentials.");
      setIsSubmitting(false);

      toast({
        title: "Access denied",
        description: "The email or password did not match the configured admin account.",
        variant: "destructive",
      });
      return;
    }

    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true");
    setAuthStatus("authenticated");
    setIsSubmitting(false);

    toast({
      title: "Admin access granted",
      description: "The dashboard is ready.",
    });

    void router.replace("/admin");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    setError(null);
    setAuthStatus("unauthenticated");

    toast({
      title: "Logged out",
      description: "Admin access has been cleared from this browser.",
    });
  };

  return (
    <>
      <NextSeo title="Admin Dashboard" noindex />

      <section className="w-full bg-background">
        <div className="container mx-auto px-4 py-10 md:py-14">
          {authStatus === "checking" ? (
            <div className="mx-auto flex min-h-[420px] max-w-3xl items-center justify-center rounded-3xl border border-border/70 bg-card/95 px-6 text-center shadow-sm">
              <div className="space-y-3">
                <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Checking admin session</p>
                  <p className="text-sm text-muted-foreground">Validating browser auth before rendering the dashboard.</p>
                </div>
              </div>
            </div>
          ) : authStatus === "authenticated" ? (
            <AdminFeedbackDashboard onLogout={handleLogout} />
          ) : (
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-border/70 bg-secondary/60 p-8 shadow-sm">
                <div className="max-w-xl space-y-6">
                  <div className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Internal Access
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                      Review product feedback in one place
                    </h1>
                    <p className="text-base leading-7 text-muted-foreground">
                      This admin area reads feedback directly from Firestore and keeps the same layout, theme, and responsive behavior as the rest of PDFMingle.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Protected entry</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">Local browser session</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Data source</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">Firestore feedback</p>
                    </div>
                  </div>
                </div>
              </div>

              <AdminLoginForm
                error={error}
                isConfigured={isConfigured}
                isSubmitting={isSubmitting}
                onSubmit={handleLogin}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminPage;

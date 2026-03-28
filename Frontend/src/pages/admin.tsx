import { useEffect, useState } from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ShieldAlert } from "lucide-react";

import { AdminFeedbackDashboard } from "@/components/admin/AdminFeedbackDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { useToast } from "@/hooks/use-toast";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

const AdminPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", {
          credentials: "include",
        });
        const payload = (await response.json()) as {
          authenticated?: boolean;
          configured?: boolean;
        };

        if (!isMounted) {
          return;
        }

        setIsConfigured(Boolean(payload.configured));
        setAuthStatus(payload.authenticated ? "authenticated" : "unauthenticated");
      } catch (sessionError) {
        console.error("Admin session check failed:", sessionError);

        if (isMounted) {
          setAuthStatus("unauthenticated");
          setError("Could not verify the admin session.");
        }
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query.expired === "1") {
      setError("Session expired after 3 minutes. Please log in again.");
    }
  }, [router.isReady, router.query.expired]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      return;
    }

    const timeout = window.setTimeout(() => {
      window.location.replace("/admin?expired=1");
    }, 3 * 60 * 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [authStatus]);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        const message = payload.error ?? "Could not log in.";
        setError(message);

        toast({
          title: "Access denied",
          description: message,
          variant: "destructive",
        });
        return;
      }

      setAuthStatus("authenticated");
      setIsConfigured(true);

      toast({
        title: "Admin access granted",
        description: "The dashboard is ready. You will be asked to log in again after 3 minutes.",
      });

      void router.replace("/admin");
    } catch (loginError) {
      console.error("Admin login failed:", loginError);
      setError("Could not complete admin login.");
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });

    setError(null);
    setAuthStatus("unauthenticated");

    toast({
      title: "Logged out",
      description: "Admin access has been cleared from this browser.",
    });
  };

  const handleSessionExpired = (message = "Session expired. Please log in again.") => {
    setAuthStatus("unauthenticated");
    setError(message);
    void fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    void router.replace("/admin?expired=1");
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
            <AdminFeedbackDashboard onLogout={handleLogout} onSessionExpired={handleSessionExpired} />
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
                      <p className="mt-2 text-lg font-semibold text-foreground">HTTP-only session cookie</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Data source</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">Server-side Firestore admin API</p>
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

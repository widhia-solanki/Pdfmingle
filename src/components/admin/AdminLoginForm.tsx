import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AdminLoginFormProps {
  error: string | null;
  isConfigured: boolean;
  isSubmitting: boolean;
  onSubmit: (credentials: { email: string; password: string }) => void;
}

export const AdminLoginForm = ({
  error,
  isConfigured,
  isSubmitting,
  onSubmit,
}: AdminLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl text-foreground">Admin Login</CardTitle>
          <CardDescription>
            Sign in with the configured admin credentials to view submitted feedback.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isConfigured && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              Set <code>NEXT_PUBLIC_ADMIN_EMAIL</code> and <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> to enable admin access.
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting || !isConfigured}>
            {isSubmitting ? (
              <>
                <LockKeyhole className="h-4 w-4 animate-pulse" />
                Signing in
              </>
            ) : (
              "Open Dashboard"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

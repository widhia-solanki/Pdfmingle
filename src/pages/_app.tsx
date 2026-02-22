// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from 'next-seo';
import SEO from '../../config/next-seo.config';
import { CookieConsent } from '@/components/CookieConsent';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // This is your existing logic for a 'flush' or edge-to-edge layout
  const flushLayoutRoutes = new Set(['/', '/add-watermark', '/edit-pdf']);
  const shouldUseFlushLayout = flushLayoutRoutes.has(router.pathname);
  
  // --- NEW ---
  // Define the set of routes that should have NO layout at all (no header/footer)
  const authLayoutRoutes = new Set(['/login', '/signup', '/forgot-password']);
  const isAuthRoute = authLayoutRoutes.has(router.pathname);
  // --- END NEW ---

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    return <div>Error: reCAPTCHA Site Key is not configured.</div>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="google-adsense-account" content="ca-pub-9837860640878429" />
          </Head>
          <DefaultSeo {...SEO} />
          
          {/* --- MODIFIED BLOCK --- */}
          {isAuthRoute ? (
            // If it's an auth route, render the component directly
            <Component {...pageProps} />
          ) : (
            // Otherwise, wrap it in the MainLayout as before
            <MainLayout flush={shouldUseFlushLayout}>
              <Component {...pageProps} />
            </MainLayout>
          )}
          {/* --- END MODIFIED BLOCK --- */}

          <SpeedInsights />
          <Analytics />
          <CookieConsent />
        </AuthProvider>
      </ThemeProvider>
    </GoogleReCaptchaProvider>
  );
}

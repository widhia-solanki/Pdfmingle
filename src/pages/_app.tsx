// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from 'next-seo';
import SEO from '../../next-seo.config';
import { CookieConsent } from '@/components/CookieConsent';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Google Provider

const App = ({ Component, pageProps }: AppProps) => {
  // The 'flush' logic can be simplified by moving it inside the pages that need it.
  // For now, we keep your existing logic.
  const router = useRouter(); // You'll need to import useRouter from 'next/router'
  const isHomePage = router.pathname === '/';
  const flushLayoutRoutes = new Set(['/add-watermark', '/edit-pdf']);
  const shouldUseFlushLayout = isHomePage || flushLayoutRoutes.has(router.pathname);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="google-adsense-account" content="ca-pub-9837860640878429" />
          </Head>
          <DefaultSeo {...SEO} />
          <MainLayout flush={shouldUseFlushLayout}>
            <Component {...pageProps} />
          </MainLayout>
          <SpeedInsights />
          <Analytics />
          <CookieConsent />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

// You need to re-add useRouter import for the router logic to work
import { useRouter } from 'next/router';

export default App;

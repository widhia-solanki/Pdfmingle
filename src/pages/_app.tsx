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
import { AuthProvider } from '@/contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes'; // --- THIS IS THE FIX ---

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const flushLayoutRoutes = new Set(['/add-watermark', '/edit-pdf']);
  const isHomePage = router.pathname === '/';
  const shouldUseFlushLayout = isHomePage || flushLayoutRoutes.has(router.pathname);
  
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        Configuration Error: Google Client ID is missing.
      </div>
    );
  }

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

export default App;

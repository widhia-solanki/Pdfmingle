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
import { useRouter } from 'next/router';
import { firebaseKeysAreValid } from '@/lib/firebase'; // Import our new check

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const flushLayoutRoutes = new Set(['/add-watermark', '/edit-pdf']);
  const isHomePage = router.pathname === '/';
  const shouldUseFlushLayout = isHomePage || flushLayoutRoutes.has(router.pathname);
  
  // --- THIS IS THE FIX ---
  // If the keys are invalid, we show an error and do not render the AuthProvider.
  // This prevents the "API key not valid" error from ever happening.
  if (!firebaseKeysAreValid) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FFF0F0', color: '#D8000C' }}>
        <h1>Configuration Error</h1>
        <p>Firebase environment variables are not correctly configured. Please check your .env.local file and Vercel project settings.</p>
      </div>
    );
  }
  
  return (
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
  );
};

export default App;

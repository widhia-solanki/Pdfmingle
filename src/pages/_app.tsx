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
import { useRouter } from 'next/router';
import { AuthProvider } from '@/contexts/AuthContext'; // Import the new AuthProvider

const flushLayoutRoutes = new Set([
  '/add-watermark',
  '/edit-pdf',
]);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const shouldUseFlushLayout = isHomePage || flushLayoutRoutes.has(router.pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* --- THIS IS THE FIX --- */}
      {/* Wrap the entire application with the AuthProvider */}
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
}

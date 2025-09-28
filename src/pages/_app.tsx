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
import { SessionProvider } from "next-auth/react"; // Import the new provider

// The AppProps type needs to be updated to include the session
interface AppPropsWithSession extends AppProps {
  pageProps: {
    session: any; // Using `any` for simplicity, can be typed more strictly if needed
    [key: string]: any;
  };
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithSession) {
  const router = useRouter();
  const flushLayoutRoutes = new Set(['/add-watermark', '/edit-pdf']);
  const isHomePage = router.pathname === '/';
  const shouldUseFlushLayout = isHomePage || flushLayoutRoutes.has(router.pathname);

  return (
    // The SessionProvider must be the outermost provider to work correctly
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
      </ThemeProvider>
    </SessionProvider>
  );
}

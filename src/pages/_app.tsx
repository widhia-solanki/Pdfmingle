// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from 'next-seo';
import SEO from '../../next-seo.config';
import { CookieConsent } from '@/components/CookieConsent'; // Updated import

export default function App({ Component, pageProps }: AppProps) {
  // All splash screen logic has been removed.
  // The app now renders the main layout directly for all users.
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <DefaultSeo {...SEO} />
      
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      
      <SpeedInsights />
      <Analytics />

      <CookieConsent />
    </>
  );
}

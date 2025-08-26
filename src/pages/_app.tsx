// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from 'next-seo';
import SEO from '../../next-seo.config';
import CookieConsent from "react-cookie-consent";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useIsMobile } from '@/hooks/use-mobile'; // We need this hook
import { DevelopmentSplash } from '@/components/DevelopmentSplash'; // Our new component

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasAccess, setHasAccess] = useState(false);

  // --- THIS IS THE SECRET ACCESS LOGIC ---
  useEffect(() => {
    // This effect runs only in the browser
    if (router.isReady) {
      // 1. Check if the secret code is in the URL
      if (router.query.dev === 'true') {
        sessionStorage.setItem('dev_access', 'true');
        setHasAccess(true);
      } 
      // 2. Check if we already granted access during this session
      else if (sessionStorage.getItem('dev_access') === 'true') {
        setHasAccess(true);
      }
    }
  }, [router.isReady, router.query]);

  // If the user is on mobile AND doesn't have secret access, show the splash page.
  if (isMobile && !hasAccess) {
    return <DevelopmentSplash />;
  }

  // Otherwise, show the normal website.
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

      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="pdfmingleCookieConsent"
        style={{ background: "#2B373B", fontSize: "14px" }}
        buttonStyle={{ color: "#4e503b", background: "#fff", fontSize: "14px", borderRadius: "5px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </>
  );
}

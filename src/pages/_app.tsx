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
import { useIsMobile } from '@/hooks/use-mobile';
import { DevelopmentSplash } from '@/components/DevelopmentSplash';
import { MaintenanceSplash } from '@/components/MaintenanceSplash';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.dev === 'true') {
        sessionStorage.setItem('dev_access', 'true');
        setHasAccess(true);
      } 
      else if (sessionStorage.getItem('dev_access') === 'true') {
        setHasAccess(true);
      }
    }
  }, [router.isReady, router.query]);

  // Prevent flash of content while hook initializes
  if (isMobile === undefined) {
    return null; 
  }

  // --- THIS IS THE CORRECTED LOGIC ---

  // 1. FIRST, check for developer access. If granted, show the full application.
  if (hasAccess) {
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

  // 2. If NO developer access, THEN decide which splash screen to show.
  if (!isMobile) {
    return <MaintenanceSplash />;
  } else {
    return <DevelopmentSplash />;
  }
}

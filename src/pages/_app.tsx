import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from 'next-seo';
import SEO from '../../next-seo.config';
import CookieConsent from "react-cookie-consent";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Favicon and Global Head Tags */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      {/* Default SEO Configuration from next-seo.config.ts */}
      <DefaultSeo {...SEO} />
      
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      
      <SpeedInsights />
      <Analytics />

      {/* Cookie Consent Banner */}
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

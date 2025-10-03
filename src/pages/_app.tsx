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
import { SessionProvider } from "next-auth/react";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface AppPropsWithSession extends AppProps {
  pageProps: {
    session: any;
    [key: string]: any;
  };
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithSession) {
  const router = useRouter();
  const flushLayoutRoutes = new Set(['/', '/add-watermark', '/edit-pdf']);
  const shouldUseFlushLayout = flushLayoutRoutes.has(router.pathname);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    // This provides a clear error if the key is missing
    return <div>Error: reCAPTCHA Site Key is not configured.</div>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
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
    </GoogleReCaptchaProvider>
  );
}

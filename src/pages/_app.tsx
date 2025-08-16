import '@/styles/globals.css'; // Correct path to the CSS file
import type { AppProps } from 'next/app';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

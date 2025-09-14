// next-seo.config.ts

import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  titleTemplate: '%s | PDFMingle',
  defaultTitle: 'PDFMingle | Free & Secure Online PDF Tools',
  description: 'Merge, split, compress, convert, and protect your PDF files for free. PDFMingle is the ultimate online suite of tools for all your PDF needs, with a focus on security and simplicity.',
  canonical: 'https://pdfmingle.net',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://pdfmingle.net',
    siteName: 'PDFMingle',
    title: 'PDFMingle | Free & Secure Online PDF Tools',
    description: 'The ultimate online suite of tools for all your PDF needs. Merge, split, compress, and more—for free.',
    images: [
      {
        url: 'https://pdfmingle.net/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDFMingle - Free Online PDF Tools',
      },
    ],
  },
  twitter: {
    handle: '@yourtwitterhandle',
    site: '@yourtwitterhandle',
    cardType: 'summary_large_image',
  },
  // --- THIS IS THE GUARANTEED FIX ---
  // Adding a version query string (?v=2) to each href forces all caches to be bypassed.
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico?v=2',
      sizes: 'any',
    },
    {
      rel: 'apple-touch-icon',
      href: '/bglogo.jpg?v=2', 
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest?v=2',
    },
  ],
  // --- END OF FIX ---
};

export default config;

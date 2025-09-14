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
  // --- THIS IS THE FIX ---
  // Add all your favicon links here.
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
      sizes: 'any',
    },
    {
      rel: 'icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
  // --- END OF FIX ---
};

export default config;

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
  additionalLinkTags: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: '/favicon-96x96.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

export default config;

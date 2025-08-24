// src/pages/_document.tsx

import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

// Your existing Google Tag Manager ID
const GTM_ID = 'GTM-5F5T8VBP';

// Your new Google Analytics 4 ID from the screenshot
const GA_MEASUREMENT_ID = 'G-RPZJ7ZGCQG';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* --- SCRIPT SECTION --- */}

        {/* 1. Your existing Google Tag Manager Script */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* 2. The new Google Analytics 4 Tag */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        {/* End Google Analytics 4 Tag */}

      </Head>
      <body>
        {/* Your existing Google Tag Manager (noscript) - Body */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

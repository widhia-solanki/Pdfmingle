// src/components/DevelopmentSplash.tsx

import { Cog } from 'lucide-react';
import { PDFMingleIcon } from './PDFMingleIcon';
import Head from 'next/head';

export const DevelopmentSplash = () => {
  return (
    <>
      <Head>
        <title>PDFMingle - Under Development</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
        <div className="text-center">
          <PDFMingleIcon className="h-20 w-20 mx-auto" />
          <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight">
            Mobile Experience Under Construction
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-lg text-gray-300">
            We're currently optimizing PDFMingle for all screen sizes to ensure the best experience.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Cog className="h-16 w-16 animate-spin" style={{ animationDuration: '5s' }} />
            <p className="font-semibold text-lg">
              The site is fully functional on desktop.
            </p>
            <p className="text-gray-400">
              Please check back soon on your mobile device!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

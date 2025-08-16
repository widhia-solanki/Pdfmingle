import { ToolGrid } from '@/components/ToolGrid';
import Head from 'next/head';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>PDFMingle – Free Online PDF Tools | Merge, Convert, Edit & More</title>
        <meta 
          name="description" 
          content="Work with PDFs easily using PDFMingle. Merge, convert, edit, compress, split, and secure files online. Fast, free, and secure — no sign-up required." 
        />
      </Head>
      <div className="container mx-auto px-4 text-center">
        {/* --- THIS IS THE UPDATED HERO SECTION --- */}
        <div className="py-10 md:py-16">
          <div className="bg-gray-800 text-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
          </div>
        </div>

        {/* This ToolGrid component is unchanged */}
        <ToolGrid />
      </div>
    </>
  );
};

export default HomePage;

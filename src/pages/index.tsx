import { ToolGrid } from '@/components/ToolGrid';
import Head from 'next/head'; // 1. Import the Head component for SEO

const HomePage = () => {
  return (
    <>
      {/* 2. Add SEO Meta Tags */}
      <Head>
        <title>PDFMingle – Free Online PDF Tools | Merge, Convert, Edit & More</title>
        <meta 
          name="description" 
          content="Work with PDFs easily using PDFMingle. Merge, convert, edit, compress, split, and secure files online. Fast, free, and secure — no sign-up required." 
        />
      </Head>

      <div className="container mx-auto px-4 text-center">
        {/* 3. Update the Hero Section Content */}
        <div className="py-10 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ilovepdf-text">
            PDFMingle – All-in-One PDF Tools
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Merge, convert, edit, compress, split, and protect PDFs — all online, free, and fast. No sign-up, no hassle, just powerful tools that work anywhere.
            <br />
            <strong className="text-ilovepdf-text mt-2 block">Do more with your PDFs — in seconds.</strong>
          </p>
        </div>

        {/* Tool Grid Section (no changes here) */}
        <ToolGrid />
      </div>
    </>
  );
};

export default HomePage;

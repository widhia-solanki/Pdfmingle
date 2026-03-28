// src/pages/tools.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolGrid } from '@/components/ToolGrid';
import { toolArray } from '@/constants/tools';
import { buildCanonical } from '@/lib/seo';

const AllToolsPage: NextPage = () => {
  return (
    <>
      <NextSeo
        title="All PDF Tools - Free & Secure"
        description="Explore the complete suite of online PDF tools from PDFMingle. Merge, split, compress, convert, edit, and secure your PDF files for free."
        canonical={buildCanonical('/tools')}
      />
      <div className="container mx-auto py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            All PDF Tools
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Every tool you need to work with your PDFs, all in one place.
          </p>
        </header>
        
        {/* We reuse the existing ToolGrid component */}
        <ToolGrid tools={toolArray} />
      </div>
    </>
  );
};

export default AllToolsPage;

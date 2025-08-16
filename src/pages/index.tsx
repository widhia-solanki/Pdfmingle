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
        {/* Hero Section */}
        <div className="py-10 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ilovepdf-text">
            Your Go-To Solution for Any PDF Task
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Facing a document challenge? We have the solution. Our website offers a complete toolkit to handle any task, from using our simple tool to <strong className="text-ilovepdf-text">merge PDF online</strong> to converting files with our trusted <strong className="text-ilovepdf-text">PDF converter</strong>. You can even <strong className="text-ilovepdf-text">edit PDF online</strong> or add a watermark for free. It’s the simple, secure, and stress-free way to manage your documents.
          </p>
        </div>

        {/* Tool Grid Section (This remains the same) */}
        <ToolGrid />
      </div>
    </>
  );
};

export default HomePage;

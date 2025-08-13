import Head from 'next/head';
import Link from 'next/link';
import { Tool } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor'; // Your existing UI

interface ToolPageLayoutProps {
  tool: Tool;
}

export const ToolPageLayout = ({ tool }: ToolPageLayoutProps) => {
  // JSON-LD Schema for rich Google search results
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": tool.metaTitle,
    "description": tool.metaDescription,
    "step": tool.steps.map((step, index) => ({
      "@type": "HowToStep",
      "name": `Step ${index + 1}`,
      "text": step,
      "position": index + 1,
    })),
  };

  return (
    <>
      <Head>
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.metaDescription} />
        <meta name="keywords" content={tool.metaKeywords} />
        <meta property="og:title" content={tool.metaTitle} />
        <meta property="og:description" content={tool.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.pdfmingle.org/${tool.value}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-ilovepdf-text">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-xl text-muted-foreground">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full">
          <PDFProcessor />
        </div>
        
        <section className="text-left max-w-3xl mx-auto mt-16 md:mt-24">
          <h2 className="text-2xl font-bold text-center mb-6">How to {tool.label}</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            {tool.steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </section>

        <section className="mt-16 text-center w-full">
            <h3 className="text-xl font-bold mb-4">Try our other tools:</h3>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {tools.filter(t => t.value !== tool.value).slice(0, 4).map(otherTool => (
                    <Link key={otherTool.value} href={`/${otherTool.value}`} className="text-ilovepdf-red hover:underline font-medium">
                        {otherTool.label}
                    </Link>
                ))}
            </div>
        </section>
      </div>
    </>
  );
};

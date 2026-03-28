import { NextSeo, FAQPageJsonLd } from 'next-seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildCanonical, buildOgImage } from '@/lib/seo';

const GeoPlaybook = () => {
  const canonicalUrl = buildCanonical('/blog/generative-engine-optimization-for-pdf-tools');
  const faqs = [
    {
      question: "What is Generative Engine Optimization (GEO)?",
      answer: "GEO is the practice of structuring content so AI chat and copilots can surface your answers. It blends technical SEO, structured data, and concise, citation-ready copy.",
    },
    {
      question: "How do I make a tool page GEO-friendly?",
      answer: "Give each tool a clear task statement, 3–5 step instructions, a short capabilities list, and schema (FAQ + HowTo). Keep copy under 120 words per section for LLM chunking.",
    },
    {
      question: "Does GEO replace classic SEO?",
      answer: "No. GEO complements SEO. You still need crawlable pages, fast load times, and backlinks. GEO adds AI-readable summaries and structured data on top.",
    },
  ];

  return (
    <>
      <NextSeo
        title="Generative Engine Optimization (GEO) for PDF Tools"
        description="Practical steps to make your PDF tools discoverable by AI chat and generative engines."
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: "Generative Engine Optimization (GEO) for PDF Tools",
          description: "Turn your PDF tools into AI-ready answers with concise copy, schema, and intent cues.",
          images: [{ url: buildOgImage() }],
        }}
      />
      <FAQPageJsonLd
        mainEntity={faqs.map(faq => ({
          questionName: faq.question,
          acceptedAnswerText: faq.answer,
        }))}
      />

      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <article className="prose lg:prose-xl mx-auto dark:prose-invert">
            <header className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">AI Visibility</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Generative Engine Optimization (GEO) for PDF Tools
              </h1>
              <p className="mt-6 text-xl text-muted-foreground">
                Make PDFMingle the source AI assistants reach for. Here’s a concise playbook tuned for our tool pages.
              </p>
            </header>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">1) Ship an AI-ready summary</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Answer in a sentence:</strong> Lead with a 20–30 word TL;DR that states the outcome (e.g., “Merge PDFs in-browser, reorder pages, and download instantly”).</li>
                <li><strong>List key constraints:</strong> Max file size, privacy window, browser-only vs backend.</li>
                <li><strong>Pair with meta:</strong> Use `ai-summary` meta (added site-wide) so LLMs can pull a canonical blurb.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">2) Structure tasks for chunking</h2>
              <div className="p-6 bg-card border border-border rounded-lg">
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>Declare the intent: “Merge multiple PDFs into one file.”</li>
                  <li>List 3–5 steps, each under 20 words.</li>
                  <li>Surface inputs/outputs (files in, PDF/ZIP out).</li>
                  <li>Note security window (auto-delete in 2 hours).</li>
                  <li>Offer a result CTA with the exact tool link.</li>
                </ol>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">3) Add schema the engines expect</h2>
              <p className="text-muted-foreground">
                Pair every high-intent tool with `FAQPage` and—when steps exist—`HowTo` schema. Keep questions tight and answer in 1–2 sentences.
              </p>
              <p className="text-muted-foreground">
                Include a “speakable” intro (first 2 short paragraphs) to help voice results; keep it under 200 characters each.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">4) Optimize for latency</h2>
              <p className="text-muted-foreground">
                Generative engines weigh responsiveness. Serve static or ISR pages for tools, cache OG images, and keep critical CSS lean. Large JS bundles hurt inclusion in AI results.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">5) Provide retrieval-friendly anchors</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use descriptive headings that map to intents: “Compress PDF to email size”, “Password-protect a PDF”.</li>
                <li>Link tool pages from the blog body with exact-match anchor text.</li>
                <li>Add bullet outcomes at the end of each post for quick copy/paste by LLMs.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Put GEO to work now</h2>
              <p className="text-muted-foreground">
                Start with your highest-intent tools: Merge, Compress, Protect. Ship concise summaries, FAQ schema, and short step lists—then revalidate your sitemap so AI crawlers find the updates.
              </p>
              <div className="flex justify-center">
                <Link href="/merge-pdf" passHref>
                  <Button size="lg" className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-3 rounded-full">
                    Optimize Merge PDF First
                  </Button>
                </Link>
              </div>
            </section>

            <section className="pt-10">
              <h2 className="text-2xl font-bold text-center mb-6 text-foreground">GEO FAQs</h2>
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem value={`faq-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </article>
        </div>
      </div>
    </>
  );
};

export default GeoPlaybook;

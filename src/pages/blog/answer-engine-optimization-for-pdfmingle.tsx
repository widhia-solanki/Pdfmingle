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

const AnswerEnginePage = () => {
  const canonicalUrl = buildCanonical('/blog/answer-engine-optimization-for-pdfmingle');
  const faqs = [
    {
      question: "What is Answer Engine Optimization (AEO)?",
      answer: "AEO focuses on structuring content so search and AI engines can return a direct, concise answer—often in a featured snippet or AI overview.",
    },
    {
      question: "How is LLM Optimization (LLMO) different?",
      answer: "LLMO prioritizes making your content chunkable, cited, and grounded for large language models. It rewards clear summaries, schema, and stable URLs.",
    },
    {
      question: "Where should I start on PDFMingle?",
      answer: "Prioritize Merge, Compress, and Protect pages. Add crisp question/answer pairs, explicit limits, and fast load times. Then refresh the sitemap.",
    },
  ];

  return (
    <>
      <NextSeo
        title="AEO + LLM Optimization for PDFMingle"
        description="Win featured answers and AI overviews with tight FAQs, HowTo schema, and LLM-friendly summaries for every PDF tool."
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: "AEO + LLM Optimization for PDFMingle",
          description: "Practical checklist to make PDFMingle the trusted source for direct answers and LLM grounding.",
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
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Featured Answers</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Answer Engine Optimization (AEO) + LLM Optimization (LLMO)
              </h1>
              <p className="mt-6 text-xl text-muted-foreground">
                Earn the “direct answer” spot and make PDFMingle effortless for LLMs to cite and ground.
              </p>
            </header>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">AEO checklist for every tool page</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Lead with the answer:</strong> First paragraph: outcome + who it’s for + time to complete.</li>
                <li><strong>Include a mini-FAQ:</strong> 3–5 common questions with 1–2 sentence answers; we already expose FAQ schema site-wide.</li>
                <li><strong>Add HowTo schema:</strong> When a task has steps (merge, compress), wrap steps in ordered lists for easy extraction.</li>
                <li><strong>Use consistent anchors:</strong> Link text like “Compress PDF” to `/compress-pdf` so engines learn the association.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">LLMO upgrades we just shipped</h2>
              <div className="p-6 bg-card border border-border rounded-lg space-y-3 text-muted-foreground">
                <p><strong>AI summary meta:</strong> Site-wide `ai-summary` and intent metas give LLMs a canonical blurb.</p>
                <p><strong>Canonical consistency:</strong> All tool and blog pages now resolve to <code>https://pdfmmingle.net</code> via a helper, avoiding host drift.</p>
                <p><strong>OG image stability:</strong> Default OG image helper standardizes previews that LLMs often fetch for citations.</p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Copy patterns LLMs favor</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Short clauses:</strong> Keep sentences under 22 words to reduce truncation in model context windows.</li>
                <li><strong>Numbers first:</strong> State limits early: “Uploads up to 100 MB; files auto-delete after 2 hours.”</li>
                <li><strong>Parallel structure:</strong> Steps start with verbs; FAQs answer in active voice.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Implement on a live page in minutes</h2>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Add a 25-word opener that states the result.</li>
                <li>List 3–5 ordered steps with verbs.</li>
                <li>Publish 3 FAQs with 1–2 sentence answers.</li>
                <li>Verify canonical URL matches the new domain.</li>
                <li>Ping the sitemap so crawlers pick it up.</li>
              </ol>
              <div className="flex justify-center">
                <Link href="/compress-pdf" passHref>
                  <Button size="lg" className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-3 rounded-full">
                    Apply Checklist to Compress PDF
                  </Button>
                </Link>
              </div>
            </section>

            <section className="pt-10">
              <h2 className="text-2xl font-bold text-center mb-6 text-foreground">AEO + LLMO FAQs</h2>
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

export default AnswerEnginePage;

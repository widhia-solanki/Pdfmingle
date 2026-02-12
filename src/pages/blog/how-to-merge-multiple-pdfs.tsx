// src/pages/blog/how-to-merge-multiple-pdfs.tsx

import { NextSeo, FAQPageJsonLd } from 'next-seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildCanonical } from '@/lib/seo';

const BlogPost2 = () => {
    const canonicalUrl = buildCanonical('/blog/how-to-merge-multiple-pdfs');
    const faqs = [
        { question: "Can I merge different file types together?", answer: "Our Merge PDF tool works specifically with PDF files. If you have other file types like Word or JPG, you should first convert them to PDF using our converter tools, and then you can merge them together." },
        { question: "Is there a limit on the number of files I can merge?", answer: "Our free tool allows you to merge up to 20 PDF files at once, which covers most common needs for reports, presentations, and document assembly." },
        { question: "Do I need to create an account to merge files?", answer: "No. PDFMingle is designed for speed and convenience. No account or signup is required to use our PDF merger." },
    ];

    return (
        <>
            <NextSeo
                title="How to Merge Multiple PDFs into One File for Free | PDFMingle"
                description="Learn how to combine several PDF documents into a single, organized file using our free online tool. Perfect for reports, ebooks, and contracts."
                canonical={canonicalUrl}
                openGraph={{
                    url: canonicalUrl,
                    title: "How to Merge Multiple PDFs into One File for Free",
                    description: "A step-by-step guide to combining PDF files online securely and without cost.",
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
                            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Combine Documents</p>
                            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                How to Merge Multiple PDFs into One File for Free
                            </h1>
                            <p className="mt-6 text-xl text-muted-foreground">
                                Whether you're compiling a report, creating an e-book, or organizing contracts, merging PDFs is an essential task. Here's how to do it in seconds.
                            </p>
                        </header>

                        <div className="space-y-8 text-lg text-muted-foreground">
                            <p>
                                Combining several PDF documents into one is a simple way to keep your files organized and easy to share. Instead of sending multiple attachments, you can send a single, streamlined file. Let's walk through the process.
                            </p>

                            <div className="p-6 bg-card border border-border rounded-lg">
                                <h2 className="text-2xl font-bold text-foreground mb-4">Step 1: Upload Your Files</h2>
                                <p>
                                    Navigate to the <Link href="/merge-pdf" className="text-primary hover:underline font-semibold">PDFMingle Merge PDF tool</Link>. You can select multiple files from your device at once or drag and drop them directly into the browser window.
                                </p>
                            </div>

                            <div className="p-6 bg-card border border-border rounded-lg">
                                <h2 className="text-2xl font-bold text-foreground mb-4">Step 2: Arrange and Reorder</h2>
                                <p>
                                    After uploading, you'll see a preview of all your documents. Simply drag and drop the file thumbnails to arrange them in the exact order you want them to appear in the final, merged document.
                                </p>
                            </div>
                            
                            <div className="p-6 bg-card border border-border rounded-lg">
                                <h2 className="text-2xl font-bold text-foreground mb-4">Step 3: Merge Instantly and Download</h2>
                                <p>
                                    Once you're happy with the order, click the "Merge PDF" button. Our tool will instantly combine the files. You can then download your new, single PDF document immediately.
                                </p>
                            </div>

                            <h2 className="text-2xl font-bold text-foreground pt-8">Why Use PDFMingle to Merge Files?</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Fast and Secure:</strong> Your files are processed quickly and are automatically deleted from our servers for your privacy.</li>
                                <li><strong>Unlimited Free Use:</strong> Merge as many documents as you need, as often as you want, completely for free.</li>
                                <li><strong>No Software Needed:</strong> Everything works directly in your web browser, with no installation required.</li>
                            </ul>

                            <section className="pt-8">
                                <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible>
                                    {faqs.map((faq, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
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
                        </div>
                        
                        <div className="mt-12 text-center">
                            <Link href="/merge-pdf" passHref>
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                                    Merge Your PDFs Now
                                </Button>
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
};

export default BlogPost2;

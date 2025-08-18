
// src/pages/blog/index.tsx

import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const allPosts = [
  {
    slug: 'how-to-merge-multiple-pdfs',
    title: 'How to Merge Multiple PDFs into One File for Free',
    description: 'Learn how to combine several PDF documents into a single, organized file using our free online tool. Perfect for reports, ebooks, and contracts.',
  },
  {
    slug: 'how-to-convert-pdf-to-word',
    title: 'How to Convert PDF to Word in 3 Easy Steps',
    description: 'A step-by-step guide to turning your PDFs into editable Word documents online for free, without losing formatting.',
  },
];

const BlogIndexPage = () => {
    const canonicalUrl = "https://pdfmingle.net/blog";

    return (
        <>
            <NextSeo
                title="Blog | PDFMingle"
                description="Tips, tutorials, and articles on how to make the most of your PDF documents. Learn how to merge, split, compress, and convert files with PDFMingle."
                canonical={canonicalUrl}
                openGraph={{
                    url: canonicalUrl,
                    title: "PDFMingle Blog | PDF Tips & Tutorials",
                    description: "Explore our articles for the best tips on managing your PDF files for free.",
                }}
            />

            <div className="bg-white py-16 sm:py-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    <header className="mb-16 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            The PDFMingle Blog
                        </h1>
                        <p className="mt-6 text-xl text-gray-600">
                            Your resource for PDF tips, tutorials, and productivity hacks.
                        </p>
                    </header>

                    <div className="space-y-12">
                        {allPosts.map((post) => (
                            <Link 
                                key={post.slug} 
                                href={`/blog/${post.slug}`} 
                                className="group block"
                            >
                                <article className="p-8 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-600">
                                        {post.description}
                                    </p>
                                    <div className="mt-6 font-semibold text-blue-600 flex items-center">
                                        Read article
                                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogIndexPage;

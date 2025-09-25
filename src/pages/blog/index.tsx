// src/pages/blog/index.tsx

import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const allPosts = [
  {
    slug: 'how-to-compress-a-pdf',
    title: 'How to Compress a PDF Without Losing Quality',
    description: 'A guide to shrinking your PDF file size while keeping the best possible quality for sharing and storage.'
  },
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

interface Post {
  slug: string;
  title: string;
  description: string;
}

interface BlogIndexPageProps {
  posts: Post[];
}

const BlogIndexPage: NextPage<BlogIndexPageProps> = ({ posts }) => {
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
            
            {/* --- THIS IS THE FIX --- */}
            {/* Using theme variables for background and text colors */}
            <div className="bg-background py-16 sm:py-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    <header className="mb-16 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            The PDFMingle Blog
                        </h1>
                        <p className="mt-6 text-xl text-muted-foreground">
                            Your resource for PDF tips, tutorials, and productivity hacks.
                        </p>
                    </header>

                    <div className="space-y-12">
                        {posts.map((post) => (
                            <Link 
                                key={post.slug} 
                                href={`/blog/${post.slug}`} 
                                className="group block"
                            >
                                {/* Use theme variables for the article card */}
                                <article className="p-8 border border-border bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="mt-4 text-lg text-muted-foreground">
                                        {post.description}
                                    </p>
                                    <div className="mt-6 font-semibold text-primary flex items-center">
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      posts: allPosts,
    },
  };
};

export default BlogIndexPage; compatible with your site's dark mode, creating a seamless experience for your readers.

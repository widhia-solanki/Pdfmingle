// src/pages/api/generate-blog.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { toolArray } from '@/constants/tools'; // Import for the ToolGrid

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_REPO_OWNER!;
const repo = process.env.GITHUB_REPO_NAME!;

const topics = [
  'How to Merge Multiple PDFs for Free in 2025',
  'Edit PDF Text Online Without Software',
  'Crop PDF Pages: A Precise Trimming Guide',
  'How to Compress a PDF Without Losing Quality',
];

// Corrected and improved JSX template
const tsxTemplate = ({ title, slug, date, content }: { title: string; slug: string; date: string; content: string }) => `
import { NextSeo } from 'next-seo';
import { MainLayout } from '@/layouts/MainLayout';
import { ToolGrid } from '@/components/ToolGrid';
import { toolArray } from '@/constants/tools';

export default function BlogPost() {
  // Get a few tools to display as a CTA
  const featuredTools = toolArray.slice(0, 4);

  return (
    <MainLayout>
      <NextSeo
        title="${title} | PDFMingle Blog"
        description="Learn how to ${title.toLowerCase()} with PDFMingle's free and powerful online PDF tools."
      />
      <div className="bg-background">
        <article className="prose dark:prose-invert mx-auto max-w-4xl py-16 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">${title}</h1>
            <p className="text-muted-foreground">Published on ${date}</p>
          </header>
          <section className="space-y-6">
            ${content}
          </section>
        </article>
        <div className="py-16 bg-secondary">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Try Our Most Popular Tools</h2>
            <ToolGrid tools={featuredTools} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}`;

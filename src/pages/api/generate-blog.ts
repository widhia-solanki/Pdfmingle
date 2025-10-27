// src/pages/api/generate-blog.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';
// --- THIS IS THE FIX ---
// The import path is now correct.
import { authOptions } from './auth/[...nextauth]';

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

const tsxTemplate = ({ title, slug, date, content }: { title: string; slug: string; date: string; content: string }) => `
import { NextSeo } from 'next-seo';
import { MainLayout } from '@/layouts/MainLayout';
import { ToolGrid } from '@/components/ToolGrid';
import { toolArray } from '@/constants/tools';

export default function BlogPost() {
  return (
    <MainLayout>
      <NextSeo
        title="${title} | PDFMingle Blog"
        description="Learn how to ${title.toLowerCase()} with PDFMingle's free and powerful online PDF tools."
      />
      <article className="prose dark:prose-invert mx-auto max-w-4xl py-12 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">${title}</h1>
          <p className="text-muted-foreground">Published on ${date}</p>
        </header>
        <section className="space-y-6">
          ${content}
        </section>
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Try Our Tools?</h2>
          <a href="/tools" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Explore All PDFMingle Tools
          </a>
        </div>
      </article>
      <div className="py-16 bg-secondary">
        <ToolGrid tools={toolArray.slice(0, 4)} />
      </div>
    </MainLayout>
  );
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  // IMPORTANT: Replace with your actual admin email for security
  if (!session || !session.user || session.user.email !== 'contact.dafda.pdfmingle@gmail.com') {
    return res.status(401).json({ error: 'Unauthorized: Access is restricted to administrators.' });
  }

  const { action, topic } = req.body;

  if (action === 'generate') {
    try {
      const date = new Date().toISOString().split('T')[0];
      const promptTopic = topic || topics[Math.floor(Math.random() * topics.length)];
      const slug = promptTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a comprehensive, SEO-optimized blog post body for PDFMingle.net on the topic "${promptTopic}". The tone should be helpful and professional. The structure must be: An introduction (100-150 words), a step-by-step guide (3-5 numbered list items), a section on benefits (H2 heading + 4 bullet points), an FAQ section (H2 heading + 2-3 questions/answers), and a concluding paragraph. The output must be ONLY the inner JSX for these sections (e.g., <p>, <h2>, <ol>, <ul>). Do not include the main <h1> or the final CTA.`;

      const result = await model.generateContent(prompt);
      const bodyContent = await result.response.text();
      const fullTsx = tsxTemplate({ title: promptTopic, slug, date, content: bodyContent });

      res.status(200).json({ tsx: fullTsx, topic: promptTopic, slug, date });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else if (action === 'push') {
    try {
      const { tsx, slug, date } = req.body;
      const filename = `src/pages/blog/${date}-${slug}.tsx`;
      const content = Buffer.from(tsx).toString('base64');

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filename,
        message: `feat: Add new blog post - ${slug}`,
        content: content,
        branch: 'main',
      });

      res.status(200).json({ success: true, url: `https://pdfmingle.net/blog/${date}-${slug}` });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
}

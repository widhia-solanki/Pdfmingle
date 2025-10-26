import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'; // Adjust path if needed

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const topics = [
  'How to Merge Multiple PDFs for Free in 2025',
  'Edit PDF Text Online Without Software',
  'Crop PDF Pages: Precise Trimming Guide',
  // Add more from your tools.ts
];

const tsxTemplate = ({ title, slug, date, content }: { title: string; slug: string; date: string; content: string }) => `import { NextSeo } from 'next-seo';
import { MainLayout } from '@/layouts/MainLayout';
import { ToolGrid } from '@/components/ToolGrid';

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <MainLayout>
      <NextSeo
        title="${title} | PDFMingle"
        description="Learn how to ${title.toLowerCase()} with PDFMingle's free online tools."
      />
      <article className="prose mx-auto max-w-4xl py-8">
        <h1 className="text-4xl font-bold mb-4">${title}</h1>
        <p className="text-gray-600 mb-8">Published on ${date}</p>
        <section className="mb-8">
          ${content}
        </section>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Ready to Try?</h2>
          <a href="/tools" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            Explore PDFMingle Tools
          </a>
        </div>
      </article>
      <ToolGrid />
    </MainLayout>
  );
}
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { action, topic, slug } = req.body;

  if (action === 'generate') {
    try {
      const date = new Date().toISOString().split('T')[0];
      const promptTopic = topic || topics[Math.floor(Math.random() * topics.length)];
      const promptSlug = slug || promptTopic.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a complete Next.js .tsx blog post body for PDFMingle.net on "${promptTopic}". 
      Use promotional tone. Structure: Intro (100-150 words), Steps (3-5 numbered), Benefits (H2 + 4 bullets), FAQ (H2 + 2-3 Q&A), CTA. 
      Output ONLY inner JSX (<p>, <h2>, <ol><li>, <ul><li>, <a href="/tool">). Under 2000 words.`;

      const result = await model.generateContent(prompt);
      const bodyContent = await result.response.text();

      const fullTsx = tsxTemplate({ title: promptTopic, slug: promptSlug, date, content: bodyContent });

      res.status(200).json({ tsx: fullTsx, topic: promptTopic, slug: promptSlug, date });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else if (action === 'push') {
    try {
      const { tsx, topic, slug, date } = req.body;
      const filename = `src/pages/blog/${date}-${slug}.tsx`;
      const content = Buffer.from(tsx).toString('base64');

      // Get current commit SHA
      const { data: { default_branch } } = await octokit.rest.repos.get({ owner: process.env.GITHUB_REPO_OWNER!, repo: process.env.GITHUB_REPO_NAME! });
      const { data: { sha: baseSha } } = await octokit.rest.repos.getBranch({ owner: process.env.GITHUB_REPO_OWNER!, repo: process.env.GITHUB_REPO_NAME!, branch: default_branch });

      // Create blob
      const { data: { sha: blobSha } } = await octokit.rest.git.createBlob({
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.GITHUB_REPO_NAME!,
        content,
        encoding: 'base64',
      });

      // Create tree
      const { data: { sha: treeSha } } = await octokit.rest.git.createTree({
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.GITHUB_REPO_NAME!,
        base_tree: baseSha,
        tree: [{ path: filename, mode: '100644', type: 'blob', sha: blobSha }],
      });

      // Commit
      await octokit.rest.git.createCommit({
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.GITHUB_REPO_NAME!,
        message: `Add blog: ${topic}`,
        tree: treeSha,
        parents: [baseSha],
      });

      res.status(200).json({ success: true, url: `https://pdfmingle.net/blog/${date}-${slug}` });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
}

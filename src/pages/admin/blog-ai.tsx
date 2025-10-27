// src/pages/admin/blog-ai.tsx

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard'; // Import the AuthGuard

export default function BlogAI() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [tsxContent, setTsxContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('');

  const generateBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', topic }),
      });
      const data = await res.json();
      if (res.ok) {
        setTsxContent(data.tsx);
        setSlug(data.slug);
        setDate(data.date);
        toast({ title: 'Blog Post Generated!' });
      } else {
        throw new Error(data.error || 'Failed to generate blog.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
    setLoading(false);
  };

  const pushToRepo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push', tsx: tsxContent, slug, date, topic }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Success!', description: 'Blog post has been pushed to GitHub.' });
        setTopic('');
        setTsxContent('');
      } else {
        throw new Error(data.error || 'Failed to push to GitHub.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
    setLoading(false);
  };

  return (
    // This page is now wrapped in the AuthGuard to protect it.
    <AuthGuard>
      {/* The redundant <MainLayout> has been removed. */}
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">AI Blog Generator</CardTitle>
            <CardDescription>Generate and deploy new blog posts using AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter a topic (e.g., How to Compress a PDF) or leave blank for a random suggestion."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
              <Button onClick={generateBlog} disabled={loading}>
                {loading && tsxContent === '' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading && tsxContent === '' ? 'Generating...' : 'Generate TSX'}
              </Button>
            </div>
            
            {tsxContent && (
              <div className="space-y-4 pt-4 border-t">
                <Textarea
                  value={tsxContent}
                  onChange={(e) => setTsxContent(e.target.value)}
                  rows={25}
                  className="font-mono text-sm"
                  placeholder="Generated TSX will appear here..."
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={pushToRepo} disabled={loading || !slug}>
                    {loading && tsxContent !== '' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading && tsxContent !== '' ? 'Pushing...' : `Push to /blog/${date}-${slug}.tsx`}
                  </Button>
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(tsxContent)}`}
                    download={`${date}-${slug}.tsx`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                  >
                    Download TSX
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}

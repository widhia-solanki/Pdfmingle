import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';

export default function BlogAI() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [tsxContent, setTsxContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('');

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Access denied. <a href="/signup">Sign up</a> to manage blogs.</p>;

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
        toast({ title: 'Generated!' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: data.error });
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
        body: JSON.stringify({ action: 'push', tsx: tsxContent, topic, slug, date }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Pushed to GitHub!' });
        setTsxContent(''); // Clear after success
      } else {
        toast({ variant: 'destructive', title: 'Error', description: data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Blog Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter topic (or leave blank for random)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={generateBlog} disabled={loading}>
              {loading ? 'Generating...' : 'Generate TSX'}
            </Button>
            {tsxContent && (
              <>
                <Textarea
                  value={tsxContent}
                  rows={20}
                  placeholder="Generated TSX will appear here..."
                  readOnly
                />
                <div className="flex gap-2">
                  <Button onClick={pushToRepo} disabled={loading || !slug}>
                    Push to /blog/{date}-{slug}
                  </Button>
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(tsxContent)}`}
                    download={`${date}-${slug}.tsx`}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Download TSX
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        {/* Future: Add list of existing blogs with delete buttons */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Existing Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>TODO: Fetch from GitHub API and add delete/push updates.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

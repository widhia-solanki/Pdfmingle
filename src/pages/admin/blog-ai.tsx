// src/pages/admin/blog-ai.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { NextSeo } from 'next-seo';

// In a real app, you would fetch this data from Firestore
const mockScheduledPosts: any[] = [];
const mockPublishedPosts: any[] = [];

export default function BlogAI() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [tsxContent, setTsxContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('');
  const [publishDate, setPublishDate] = useState<Date | undefined>(new Date());
  const [currentAction, setCurrentAction] = useState<'generate' | 'schedule' | null>(null);

  const generateBlog = async () => {
    setLoading(true);
    setCurrentAction('generate');
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
        toast({ title: 'Blog Post Generated!', description: 'Review the TSX and schedule for publishing.' });
      } else {
        throw new Error(data.error || 'Failed to generate blog.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
    setLoading(false);
    setCurrentAction(null);
  };

  const scheduleForPublishing = async () => {
    setLoading(true);
    setCurrentAction('schedule');
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'schedule',
          tsx: tsxContent, 
          topic, 
          slug, 
          date,
          publishDate: publishDate?.toISOString()
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Blog Scheduled!', description: `Post will be published on ${format(publishDate!, 'PPP')}.` });
        setTopic('');
        setTsxContent('');
      } else {
        throw new Error(data.error || 'Failed to schedule post.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
    setLoading(false);
    setCurrentAction(null);
  };

  return (
    <AuthGuard>
      <NextSeo title="AI Blog Generator" noindex={true} />
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">AI Blog Generator</CardTitle>
              <CardDescription>Generate and schedule new blog posts to be automatically deployed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter a topic (e.g., How to Compress a PDF) or leave blank for a random suggestion."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button onClick={generateBlog} disabled={loading}>
                {loading && currentAction === 'generate' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading && currentAction === 'generate' ? 'Generating...' : 'Generate TSX'}
              </Button>
            
              {tsxContent && (
                <div className="space-y-4 pt-4 border-t">
                  <Textarea
                    value={tsxContent}
                    onChange={(e) => setTsxContent(e.target.value)}
                    rows={25}
                    className="font-mono text-sm bg-secondary"
                    placeholder="Generated TSX will appear here..."
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full sm:w-[280px] justify-start text-left font-normal", !publishDate && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {publishDate ? `Publish on: ${format(publishDate, "PPP")}` : <span>Pick a publish date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={publishDate}
                          onSelect={setPublishDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Button onClick={scheduleForPublishing} disabled={loading || !slug || !publishDate} className="flex-grow">
                      {loading && currentAction === 'schedule' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {loading && currentAction === 'schedule' ? 'Scheduling...' : 'Schedule Post'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* In a real app, you would fetch this data from Firestore */}
          <Card>
            <CardHeader>
              <CardTitle>Content Queue</CardTitle>
              <CardDescription>View posts that are scheduled or have been published.</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Scheduled</h3>
              {mockScheduledPosts.length > 0 ? (
                <div className="space-y-2">...</div>
              ) : (
                <p className="text-sm text-muted-foreground">No posts are currently scheduled.</p>
              )}
              <h3 className="font-semibold text-lg mt-6 mb-2 text-foreground">Published</h3>
              {mockPublishedPosts.length > 0 ? (
                <div className="space-y-2">...</div>
              ) : (
                <p className="text-sm text-muted-foreground">No posts have been published yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}

// src/pages/powerpoint-to-pdf.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tools } from '@/constants/tools';
import { FileSliders, Wrench, Mail, Merge, Split, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const popularTools = [
  { icon: Merge, ...tools.merge },
  { icon: Compress, ...tools.compress },
  { icon: Edit, ...tools['edit-pdf'] },
];

const PptToPdfPage: NextPage = () => {
  const tool = tools['powerpoint-to-pdf'];
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setFormStatus('submitting');
    
    // --- In a real app, you would send this to your API ---
    // e.g., await fetch('/api/notify-list', { method: 'POST', body: JSON.stringify({ email, tool: tool.value }) });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request

    setFormStatus('success');
    toast({ title: "You're on the list!", description: "We'll email you as soon as this tool is ready." });
  };

  return (
    <>
      <NextSeo 
        title={tool.metaTitle} 
        description={tool.metaDescription}
        noindex={true}
      />

      <div className="container mx-auto px-4 py-12 sm:py-20 flex flex-col items-center text-center motion-safe:animate-fade-in-up">
        {/* Animated Icon with Hover Effect */}
        <div className="relative w-28 h-28 group transition-transform duration-300 ease-out hover:scale-110">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping-slow opacity-50 group-hover:opacity-75" />
          <div className="absolute inset-2 bg-blue-200 dark:bg-blue-900/50 rounded-full animate-pulse-slow opacity-60" />
          <FileSliders className="absolute inset-0 m-auto h-14 w-14 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          {tool.h1} is Coming Soon!
        </h1>

        <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Our team is putting the final touches on this powerful new feature. Want to be the first to know when it's ready?
        </p>

        {/* Interactive "Notify Me" Form */}
        <div className="mt-8 w-full max-w-md h-20 flex justify-center items-center">
          {formStatus === 'success' ? (
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">Thank you! We'll be in touch.</p>
          ) : (
            <form onSubmit={handleNotifySubmit} className="w-full flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email..."
                className="flex-grow h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={formStatus === 'submitting'}
                required
              />
              <Button type="submit" size="lg" className="h-12" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Submitting...' : (
                  <>
                    <Mail className="mr-2 h-5 w-5" /> Notify Me
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Clickable Alternative Tools */}
        <div className="mt-16 sm:mt-24 w-full max-w-4xl text-left">
          <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-300">In the meantime, try our popular tools:</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {popularTools.map(popularTool => (
              <Link key={popularTool.value} href={`/${popularTool.value}`} className="group p-6 bg-white dark:bg-gray-800/50 border rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <popularTool.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{popularTool.label}</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{popularTool.description.split('.')[0]}.</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PptToPdfPage;

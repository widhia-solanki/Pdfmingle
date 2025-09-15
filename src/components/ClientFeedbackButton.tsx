// src/components/ClientFeedbackButton.tsx

'use client'; // This directive marks the component as client-side only

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router compatibility
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, MessageSquare } from 'lucide-react';

interface Rating {
  emoji: string;
  value: number;
  label: string;
}

const ratings: Rating[] = [
  { emoji: '😡', value: 1, label: 'Very Dissatisfied' },
  { emoji: '😕', value: 2, label: 'Dissatisfied' },
  { emoji: '😐', value: 3, label: 'Neutral' },
  { emoji: '🙂', value: 4, label: 'Satisfied' },
  { emoji: '😍', value: 5, label: 'Very Satisfied' },
];

export const ClientFeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setShowSuccess(false);
    setSelectedRating(null);
    setMessage('');
    setIsSubmitting(false);
  }, []);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(resetState, 300);
    }
  }, [resetState]);

  const handleSendFeedback = async () => {
    if (!selectedRating) {
      toast({ title: "Please select a rating.", variant: "destructive" });
      return;
    }

     setIsSubmitting(true);
    const serviceId = 'service_vwj2sx5';
    const templateId = 'template_743hx8r';
    const publicKey = 'LZ8cIn4qrUv7k80Ik';
    
     const templateParams = {
      toolName: window.location.pathname, // Safely get pathname on client
      rating: `${selectedRating.emoji} (${selectedRating.value})`,
      message: message || 'No message provided.',
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setShowSuccess(true);
      setTimeout(() => setOpen(false), 2000);
    } catch (error) {
      console.error('Failed to send feedback:', error);
      toast({
        title: "Error",
        description: "Could not send feedback. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transition-transform hover:scale-110 text-white z-50"
        aria-label="Give Feedback"
      >
        <MessageSquare />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-lg shadow-xl">
          {!showSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">Share Your Feedback</DialogTitle>
                <DialogDescription className="text-muted-foreground">How was your experience with this tool?</DialogDescription>
              </DialogHeader>

              <div className="flex justify-around items-center py-4">
                {ratings.map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => setSelectedRating(rating)}
                    className={cn(
                      "flex flex-col items-center gap-2 text-4xl rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                      selectedRating?.value === rating.value
                        ? "scale-125 transform"
                        : "scale-100 hover:scale-110 opacity-60 hover:opacity-100"
                    )}
                    aria-label={rating.label}
                  >
                    {rating.emoji}
                  </button>
                ))}
              </div>

              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you liked or what we can improve... (optional)"
                className="mt-2"
              />

              <DialogFooter className="mt-4 sm:justify-between gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSendFeedback} disabled={!selectedRating || isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <DialogTitle className="text-2xl font-semibold text-foreground">Feedback Sent!</DialogTitle>
              <DialogDescription className="text-muted-foreground">Thank you for helping us improve.</DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

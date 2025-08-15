import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';

// Your SVG icon as a React component
const FeedbackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
        <path d="M12 18C14.21 18 16 16.21 16 14H8C8 16.21 9.79 18 12 18Z" fill="currentColor"/>
    </svg>
);


const ratings = [
  { emoji: '😡', value: 1, label: 'Very Dissatisfied' },
  { emoji: '😕', value: 2, label: 'Dissatisfied' },
  { emoji: '😐', value: 3, label: 'Neutral' },
  { emoji: '🙂', value: 4, label: 'Satisfied' },
  { emoji: '😍', value: 5, label: 'Very Satisfied' },
];

export const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendFeedback = async (ratingValue: number) => {
    setIsSubmitting(true);

 const serviceId = 'service_vwj2sx5';
const templateId = 'template_743hx8r';
const publicKey = 'LZ8cIn4qrUv7k80Ik';
    
    const templateParams = {
      toolName: router.pathname, // Gets the current page URL, e.g., /merge-pdf
      rating: ratingValue,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      toast({
        title: "Thank You!",
        description: "Your feedback has been sent successfully.",
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
      toast({
        title: "Error",
        description: "Could not send feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-ilovepdf-red shadow-lg hover:bg-ilovepdf-red-dark transition-transform hover:scale-110"
        aria-label="Give Feedback"
      >
        <FeedbackIcon />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              How was your experience on this page?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-around items-center py-4">
            {ratings.map(({ emoji, value, label }) => (
              <button
                key={value}
                onClick={() => !isSubmitting && handleSendFeedback(value)}
                disabled={isSubmitting}
                className="flex flex-col items-center gap-2 text-3xl rounded-lg p-2 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-ilovepdf-red"
                aria-label={label}
              >
                {emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

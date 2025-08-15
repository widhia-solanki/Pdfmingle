import { useState } from 'react';
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

// --- THIS IS THE UPDATED ICON ---
// The SVG code has been replaced to match your new icon.
const FeedbackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z"/>
    </svg>
);
// --- END OF ICON UPDATE ---


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
      toolName: router.pathname,
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
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-ilovepdf-red shadow-lg hover:bg-ilovepdf-red-dark transition-transform hover:scale-110 text-white"
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

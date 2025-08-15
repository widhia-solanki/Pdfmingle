import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const FeedbackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z"/>
    </svg>
);

// --- START OF THE FIX ---
// Define a type for our rating object
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

export const FeedbackButton = () => {
  const [feedbackState, setFeedbackState] = useState<'rating' | 'message' | 'submitted'>('rating');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Give the state a specific type
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  
  // Give the 'rating' parameter the correct type
  const handleEmojiClick = (rating: Rating) => {
    setSelectedRating(rating);
    setFeedbackState('message');
  };
  // --- END OF THE FIX ---

  const handleSendFeedback = async () => {
    if (!selectedRating) return;

    setIsSubmitting(true);
    const serviceId = 'service_vwj2sx5';
    const templateId = 'template_743hx8r';
    const publicKey = 'LZ8cIn4qrUv7k80Ik';

    const templateParams = {
      toolName: router.pathname,
      rating: `${selectedRating.emoji} (${selectedRating.value})`, // Send emoji and value
      message: message || 'No message provided.',
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setFeedbackState('submitted');
    } catch (error) {
      console.error('Failed to send feedback:', error);
      toast({
        title: "Error",
        description: "Could not send feedback. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
        setFeedbackState('rating');
        setSelectedRating(null);
        setMessage('');
        setIsSubmitting(false);
    }, 200);
  };
  
  useEffect(() => {
    if (feedbackState === 'submitted') {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedbackState]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-ilovepdf-red shadow-lg hover:bg-ilovepdf-red-dark transition-transform hover:scale-110 text-white"
        aria-label="Give Feedback"
      >
        <FeedbackIcon />
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-md">
          {feedbackState === 'rating' && (
            <>
              <DialogHeader>
                <DialogTitle>Share Your Feedback</DialogTitle>
                <DialogDescription>How was your experience with this tool?</DialogDescription>
              </DialogHeader>
              <div className="flex justify-around items-center py-4">
                {ratings.map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => handleEmojiClick(rating)}
                    className="flex flex-col items-center gap-2 text-4xl rounded-lg p-2 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-ilovepdf-red"
                    aria-label={rating.label}
                  >
                    {rating.emoji}
                  </button>
                ))}
              </div>
            </>
          )}

          {feedbackState === 'message' && (
            <>
              <DialogHeader>
                <DialogTitle>Thank You!</DialogTitle>
                <DialogDescription>Would you like to add any details?</DialogDescription>
              </DialogHeader>
              <div className="text-5xl text-center py-4">
                {selectedRating?.emoji}
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you liked or what we can improve... (optional)"
                className="mt-2"
              />
              <DialogFooter className="mt-4">
                <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSendFeedback} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </Button>
              </DialogFooter>
            </>
          )}

          {feedbackState === 'submitted' && (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <DialogTitle className="text-2xl">Feedback Sent!</DialogTitle>
              <DialogDescription>Thank you for helping us improve.</DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

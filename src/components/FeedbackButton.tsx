import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea'; // Import the Textarea component
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Your SVG icon remains the same
const FeedbackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z"/>
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
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSendFeedback = async () => {
    if (!selectedRating) {
      toast({ title: "Please select a rating first.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const serviceId = 'service_vwj2sx5';
    const templateId = 'template_743hx8r';
    const publicKey = 'LZ8cIn4qrUv7k80Ik';

    const templateParams = {
      toolName: router.pathname,
      rating: selectedRating,
      message: message || 'No message provided.', // Use the message from state
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
      handleClose();
    }
  };
  
  // Reset state when the dialog is closed
  const handleClose = () => {
    setOpen(false);
    setSelectedRating(null);
    setMessage('');
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

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              How was your experience on this page?
            </DialogDescription>
          </DialogHeader>
          
          {/* --- UI UPDATES ARE HERE --- */}
          <div className="flex justify-around items-center py-4">
            {ratings.map(({ emoji, value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedRating(value)}
                className={cn(
                  "flex flex-col items-center gap-2 text-3xl rounded-lg p-2 transition-all duration-200",
                  selectedRating === value 
                    ? "scale-125 transform" 
                    : "scale-100 hover:scale-110 opacity-60 hover:opacity-100"
                )}
                aria-label={label}
              >
                {emoji}
              </button>
            ))}
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more... (optional)"
            className="mt-2"
          />

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSendFeedback}
              disabled={!selectedRating || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </DialogFooter>
          {/* --- END OF UI UPDATES --- */}

        </DialogContent>
      </Dialog>
    </>
  );
};

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
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

// Feedback Icon Component (unchanged)
const FeedbackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z"/>
    </svg>
);

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

  // --- FIX #1: Logic to handle opening and closing the dialog ---
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (isOpen) {
      setOpen(true);
    } else {
      // Handles closing via overlay click, escape key, or back button
      setOpen(false);
      // Wait for animation before resetting form state
      setTimeout(resetState, 300);
    }
  }, [resetState]);

  // --- FIX #2: Make the mobile back button close the dialog ---
  useEffect(() => {
    const handlePopState = () => {
      // If the back button is pressed, ensure the dialog closes
      handleOpenChange(false);
    };

    if (open) {
      // When the dialog opens, add a history entry so the back button is "captured"
      window.history.pushState({ dialog: 'feedback' }, '');
      // Listen for the back button press
      window.addEventListener('popstate', handlePopState);
    }

    // Cleanup listener
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [open, handleOpenChange]);


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
      toolName: router.pathname,
      rating: `${selectedRating.emoji} (${selectedRating.value})`,
      message: message || 'No message provided.',
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setShowSuccess(true);
      // Automatically close the dialog after showing success message
      setTimeout(() => window.history.back(), 2000);
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
        onClick={() => handleOpenChange(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transition-transform hover:scale-110 text-white z-50"
        aria-label="Give Feedback"
      >
        <FeedbackIcon />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        {/* --- FIX #3: Added explicit styling for a clean, solid white background --- */}
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
          {!showSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800">Share Your Feedback</DialogTitle>
                <DialogDescription className="text-gray-600">How was your experience with this tool?</DialogDescription>
              </DialogHeader>

              <div className="flex justify-around items-center py-4">
                {ratings.map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => setSelectedRating(rating)}
                    className={cn(
                      "flex flex-col items-center gap-2 text-4xl rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
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
                <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                <Button onClick={handleSendFeedback} disabled={!selectedRating || isSubmitting} className="bg-red-500 hover:bg-red-600">
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <DialogTitle className="text-2xl font-semibold">Feedback Sent!</DialogTitle>
              <DialogDescription>Thank you for helping us improve.</DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

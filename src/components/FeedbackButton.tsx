import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { CheckCircle, FaceFrown, FaceMeh, FaceNeutral, FaceSmile, FaceSmilePlus } from "lucide-react"; // 1. IMPORT LUCIDE ICONS

const FeedbackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z"/>
    </svg>
);

// 2. DEFINE Ratings with Lucide icons now
interface Rating {
  value: number;
  label: string;
  icon: React.ReactNode; // The "emoji" is now a React.ReactNode
}

const ratings: Rating[] = [
  { value: 1, label: 'Very Dissatisfied', icon: <FaceFrown className="h-6 w-6" /> },
  { value: 2, label: 'Dissatisfied', icon: <FaceMeh className="h-6 w-6" /> },
  { value: 3, label: 'Neutral', icon: <FaceNeutral className="h-6 w-6" /> },
  { value: 4, label: 'Satisfied', icon: <FaceSmile className="h-6 w-6" /> },
  { value: 5, label: 'Very Satisfied', icon: <FaceSmilePlus className="h-6 w-6" /> },
];

export const FeedbackButton = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSendFeedback = async () => {
    if (!selectedRating) {
      toast({ title: "Please select a rating.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const serviceId = 'YOUR_SERVICE_ID'; // <- IMPORTANT: Replace these with your EmailJS keys
    const templateId = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    const templateParams = {
      toolName: router.pathname,
      rating: `${selectedRating.label} (${selectedRating.value} stars)`, // More descriptive rating
      message: message || 'No message provided.',
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setShowSuccess(true);
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
      setShowSuccess(false);
      setSelectedRating(null);
      setMessage('');
      setIsSubmitting(false);
    }, 200);
  };
  
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(handleClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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
            <DialogDescription>How was your experience on this page?</DialogDescription>
          </DialogHeader>
          
          {/* UI is now in a single view */}
          <div className="space-y-4 py-4">
            <div className="flex justify-around items-center py-2">
              {/* 3. Render Lucide Icons instead of emoticons */}
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => setSelectedRating(rating)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg p-2 transition-all duration-200",
                    selectedRating?.value === rating.value 
                      ? "scale-125 transform text-ilovepdf-red" // Style selected rating
                      : "scale-100 hover:scale-110 opacity-60 hover:opacity-100"
                  )}
                  aria-label={rating.label}
                >
                  {rating.icon}
                  <span className="text-xs text-muted-foreground">{rating.label}</span>
                </button>
              ))}
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you liked or what we can improve... (optional)"
              className="bg-white/10 text-black placeholder:text-gray-300"
            />
          
            <DialogFooter className="mt-4">
              <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSendFeedback} disabled={!selectedRating || isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </Button>
            </DialogFooter>
          </div>
          
          {showSuccess && (
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

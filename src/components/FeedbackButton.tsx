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
import { CheckCircle, FaceFrown, FaceMeh, FaceNeutral, FaceSmile, FaceSmilePlus } from "lucide-react";

// Custom SVG feedback icon
const FeedbackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z" />
  </svg>
);

// 1. Define the Rating interface
interface Rating {
  value: number;
  label: string;
  icon: React.ReactNode;
}

// Rating options with Lucide icons
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
   // 2. Now selectedRating has the correct Rating Type
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  // 3. Pass the complete "Rating" object as value
  const handleEmojiClick = (rating: Rating) => {
    setSelectedRating(rating); // Pass the full rating object now
  };

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
      rating: `${selectedRating.label} (${selectedRating.value} stars)`, // Send both label and score for EmailJS template
      message: message || 'No message provided.',
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setShowSuccess(true);
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
          {!showSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Share Your Feedback</DialogTitle>
                <DialogDescription>How was your experience with this tool?</DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-around items-center py-4">
                {ratings.map(({ emoji, value, label, icon }) => ( // destructure icon prop
                  <button
                    key={value}
                    onClick={() => handleEmojiClick({ value, label, emoji : value.toString() })} // create a full object
                    className={cn(
                      "flex flex-col items-center gap-2 text-4xl rounded-lg p-2 transition-all duration-200",
                      selectedRating?.value === value
                        ? "scale-125 transform text-ilovepdf-red"
                        : "scale-100 hover:scale-110 opacity-60 hover:opacity-100"
                    )}
                    aria-label={label}
                  >
                      {icon} {/* show the icon name as a key */}
                    
                  </button>
                ))}
              </div>

              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you liked or what we can improve... (optional)"
                className="mt-2 bg-white/10 text-black placeholder:text-gray-300"
              />

              <DialogFooter className="mt-4">
                <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSendFeedback} disabled={!selectedRating || isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </Button>
              </DialogFooter>
            </>
          ) : (
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

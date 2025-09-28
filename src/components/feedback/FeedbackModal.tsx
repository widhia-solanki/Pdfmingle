// src/components/feedback/FeedbackModal.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react'; // Import the correct hook
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
// Note: We no longer need Firebase imports here

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

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const FeedbackModal = ({ isOpen, onOpenChange }: FeedbackModalProps) => {
  const { data: session } = useSession(); // Use the session hook
  const user = session?.user;
  const { toast } = useToast();
  const router = useRouter();

  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRating) {
      toast({ title: "Please select a rating.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    // This would be a call to your own backend API endpoint to save the feedback
    // For now, we will simulate the API call
    try {
      // Example: await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(...) });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      setShowSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        toast({
          description: `Thanks for your feedback, ${user?.name?.split(' ')[0] || 'friend'}! 💙`,
        });
      }, 1500);
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      toast({ title: "Error", description: "Could not send feedback. Please try again.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChangeWithReset = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setSelectedRating(null);
        setComment('');
        setIsSubmitting(false);
        setShowSuccess(false);
      }, 300);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeWithReset}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-lg shadow-xl">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <DialogTitle className="text-2xl font-semibold text-foreground">Feedback Sent!</DialogTitle>
          </div>
        ) : (
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
                  className={cn("flex flex-col items-center gap-2 text-4xl rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background", selectedRating?.value === rating.value ? "scale-125 transform" : "scale-100 hover:scale-110 opacity-60 hover:opacity-100")}
                  aria-label={rating.label}
                >
                  {rating.emoji}
                </button>
              ))}
            </div>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us what you liked or what we can improve... (optional)" className="mt-2" />
            <DialogFooter className="mt-4 sm:justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!selectedRating || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Feedback
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

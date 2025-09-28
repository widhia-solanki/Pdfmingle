// src/components/feedback/FeedbackButton.tsx

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

// Dynamically import the modal to avoid sending it in the initial page bundle
const FeedbackModal = dynamic(() => 
  import('./FeedbackModal').then((mod) => mod.FeedbackModal)
);

export const FeedbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 z-50"
        aria-label="Give Feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* The modal is only loaded and rendered when needed */}
      {isModalOpen && (
        <FeedbackModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      )}
    </>
  );
};

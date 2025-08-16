import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'pdfmingle-cookie-consent';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // --- THIS IS THE FIX ---
  // We wrap the localStorage access in a useEffect hook.
  // This ensures the code only runs on the client-side (in the browser).
  useEffect(() => {
    // Check if a consent choice has already been made
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (storedConsent) {
      const { expiry } = JSON.parse(storedConsent);
      // If the consent has expired, show the banner again
      if (new Date() > new Date(expiry)) {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        setShowBanner(true);
      } else {
        // Otherwise, respect the user's choice and hide the banner
        setShowBanner(false);
      }
    } else {
      // If no choice has been made, show the banner
      setShowBanner(true);
    }
  }, []);
  // --- END OF THE FIX ---

  const setConsent = (consentValue: 'accepted' | 'declined') => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    
    const consentData = {
      value: consentValue,
      expiry: expiry.toISOString(),
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
  };

  const handleAccept = () => {
    setConsent('accepted');
  };

  const handleDecline = () => {
    setConsent('declined');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-8 duration-500">
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            We use cookies to improve your experience and analyze traffic. By using PDFMingle, you agree to our{' '}
            <button onClick={() => setModalOpen(true)} className="font-semibold text-ilovepdf-red hover:underline">
              Cookie Policy
            </button>
            {' '}and{' '}
            <Link href="/privacy" className="font-semibold text-ilovepdf-red hover:underline">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              className="px-6"
              onClick={handleDecline}
            >
              Decline
            </Button>
            <Button
              className="px-6 bg-ilovepdf-red hover:bg-ilovepdf-red-dark text-white"
              onClick={handleAccept}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cookie Policy</DialogTitle>
            <DialogDescription>
              This policy explains how we use cookies on PDFMingle.
            </DialogDescription>
          </DialogHeader>
          <div className="prose max-w-none prose-sm py-4">
            <h4>What are cookies?</h4>
            <p>
              Cookies are small text files stored on your device that help our website function and help us understand how you interact with it.
            </p>
            <h4>How we use cookies</h4>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. For example, we use a cookie to remember your consent choice.
              </li>
              <li>
                <strong>Performance and Analytics Cookies:</strong> These cookies help us analyze website traffic and user activity to improve our services. All data is aggregated and anonymous.
              </li>
            </ul>
            <h4>Your Choices</h4>
            <p>
              You can accept or decline our use of non-essential cookies through the banner. Your choice will be remembered for 12 months. You can also manage cookie preferences through your browser settings.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

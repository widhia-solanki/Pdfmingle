// src/components/CookieConsent.tsx

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
const ADSENSE_CLIENT_ID = 'ca-pub-9837860640878429';

// --- THIS IS THE NEW SCRIPT LOADING LOGIC ---
const loadAdSenseScript = () => {
  // Check if the script has already been added to prevent duplicates
  if (document.getElementById('adsense-script')) {
    return;
  }

  try {
    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    console.log('AdSense script loaded due to consent.');
  } catch (error) {
    console.error('Failed to load AdSense script:', error);
  }
};

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (storedConsent) {
      const { value, expiry } = JSON.parse(storedConsent);
      
      if (new Date() > new Date(expiry)) {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        setShowBanner(true);
      } else {
        setShowBanner(false);
        // If consent was previously given, load the script
        if (value === 'accepted') {
          loadAdSenseScript();
        }
      }
    } else {
      setShowBanner(true);
    }
  }, []);

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
    // Load the script immediately upon acceptance
    loadAdSenseScript();
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
        <div className="max-w-4xl mx-auto bg-white dark:bg-dark-card p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700 dark:text-dark-text-secondary text-center sm:text-left">
            We use cookies to improve your experience and for advertising. By using PDFMingle, you agree to our{' '}
            <button onClick={() => setModalOpen(true)} className="font-semibold text-brand-blue hover:underline">
              Cookie Policy
            </button>
            {' '}and{' '}
            <Link href="/privacy" className="font-semibold text-brand-blue hover:underline">
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
              className="px-6 bg-brand-blue hover:bg-brand-blue-dark text-white"
              onClick={handleAccept}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-dark-card">
          <DialogHeader>
            <DialogTitle className="text-2xl dark:text-dark-text-primary">Cookie Policy</DialogTitle>
            <DialogDescription className="dark:text-dark-text-secondary">
              This policy explains how we use cookies on PDFMingle.
            </DialogDescription>
          </DialogHeader>
          <div className="prose dark:prose-invert max-w-none prose-sm py-4">
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
              <li>
                <strong>Advertising Cookies:</strong> We and our partners use these cookies to show you relevant ads. Accepting allows us to personalize your ad experience.
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

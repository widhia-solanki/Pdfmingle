import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// --- Your Custom SVG Icon ---
// You can easily replace this with your own SVG code.
const FeedbackIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V22L13.2 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H12.8L10 18.8V16H4V4H20V16ZM8 9H16V7H8V9ZM8 12H16V10H8V12Z"/>
    </svg>
);

const ratings = [
  { emoji: '😡', value: 1, label: 'Very Dissatisfied' },
  { emoji: '😞', value: 2, label: 'Dissatisfied' },
  { emoji: '😐', value: 3, label: 'Neutral' },
  { emoji: '🙂', value: 4, label: 'Satisfied' },
  { emoji: '😍', value: 5, label: 'Very Satisfied' },
];

export const FeedbackButton = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [feedbackState, setFeedbackState] = useState('rating'); // 'rating', 'message', 'submitted'
    const [selectedRating, setSelectedRating] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmojiClick = (rating) => {
        setSelectedRating(rating);
        setFeedbackState('message'); // Move to the next step
    };

    const handleSendFeedback = async () => {
        if (!selectedRating) return;

        setIsSubmitting(true);
        
        // --- IMPORTANT: PASTE YOUR EMAILJS KEYS HERE ---
        const serviceId = 'service_vwj2sx5';
        const templateId = 'template_743hx8r';
        const publicKey = 'LZ8cIn4qrUv7k80Ik';

        const templateParams = {
            pageURL: window.location.href,
            rating: `${selectedRating.emoji} (${selectedRating.value})`,
            message: message || 'No message provided.',
        };

        try {
            await emailjs.send(serviceID, templateID, templateParams, { publicKey });
            setFeedbackState('submitted');
        } catch (error) {
            console.error('Failed to send feedback:', error);
            alert('Sorry, something went wrong. Please try again later.');
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setModalOpen(false);
        setTimeout(() => {
            setFeedbackState('rating');
            setSelectedRating(null);
            setMessage('');
            setIsSubmitting(false);
        }, 300); // Wait for closing animation
    };

    useEffect(() => {
        if (feedbackState === 'submitted') {
            const timer = setTimeout(resetAndClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [feedbackState]);

    return (
        <>
            {/* --- STYLES --- */}
            <style>{`
                .feedback-button {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 64px; /* Slightly smaller for a cleaner look */
                    height: 64px;
                    border-radius: 50%;
                    background-color: #333; /* Darker for better contrast */
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    z-index: 1000;
                }
                .feedback-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
                }
                .feedback-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }
                .feedback-modal-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }
                .feedback-modal {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    transform: scale(0.95);
                    transition: transform 0.3s ease;
                }
                .feedback-modal-overlay.open .feedback-modal {
                    transform: scale(1);
                }
                .feedback-emojis {
                    display: flex;
                    justify-content: space-around;
                    margin: 24px 0;
                }
                .feedback-emojis button {
                    background: none;
                    border: none;
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                    padding: 8px;
                }
                .feedback-emojis button:hover {
                    transform: scale(1.2);
                }
                .feedback-textarea {
                    width: 100%;
                    min-height: 100px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 1rem;
                    margin-top: 16px;
                    resize: vertical;
                }
                .feedback-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                }
                .feedback-footer button {
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                }
                .feedback-button-cancel {
                    background-color: #f1f1f1;
                    color: #333;
                }
                .feedback-button-send {
                    background-color: #e53935;
                    color: white;
                }
                .feedback-button-send:disabled {
                    background-color: #aaa;
                    cursor: not-allowed;
                }
            `}</style>

            {/* --- HTML --- */}
            <button className="feedback-button" onClick={() => setModalOpen(true)} aria-label="Open feedback form">
                <FeedbackIcon />
            </button>
            
            <div className={`feedback-modal-overlay ${modalOpen ? 'open' : ''}`} onClick={resetAndClose}>
                <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                    {feedbackState === 'rating' && (
                        <>
                            <h2>Share Your Feedback</h2>
                            <p>How was your experience on this page?</p>
                            <div className="feedback-emojis">
                                {ratings.map((rating) => (
                                    <button key={rating.value} onClick={() => handleEmojiClick(rating)} aria-label={rating.label}>
                                        {rating.emoji}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {feedbackState === 'message' && (
                        <>
                            <h2>Thank You!</h2>
                            <p>Would you like to add any details?</p>
                            <div style={{fontSize: '4rem', margin: '16px 0'}}>{selectedRating?.emoji}</div>
                            <textarea
                                className="feedback-textarea"
                                placeholder="Tell us what you liked or what we can improve... (optional)"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="feedback-footer">
                                <button className="feedback-button-cancel" onClick={resetAndClose}>Cancel</button>
                                <button className="feedback-button-send" onClick={handleSendFeedback} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                                </button>
                            </div>
                        </>
                    )}

                    {feedbackState === 'submitted' && (
                        <div style={{padding: '24px 0'}}>
                            <div style={{ fontSize: '4rem' }}>🎉</div>
                            <h2>Feedback Sent!</h2>
                            <p>Thank you for helping us improve.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// src/components/FaqSection.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Storing FAQ data in an array makes it easy to manage and update
const faqData = [
  {
    question: "Is it safe to upload my files to PDFMingle?",
    answer:
      "Yes, absolutely. Security is our top priority. All file transfers are secured with SSL/TLS encryption. Furthermore, we automatically and permanently delete all uploaded files from our servers within a few hours. We do not access, share, or store your files.",
  },
  {
    question: "Are your PDF tools really free to use?",
    answer:
      "Yes. All tools currently available on PDFMingle are completely free to use without any hidden costs or subscriptions. We aim to provide accessible and powerful PDF utilities for everyone.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No, not at all! PDFMingle is a fully online tool. All processing happens on our secure servers, meaning you don't need to install anything on your computer or mobile device. All you need is an internet connection and a web browser.",
  },
  {
    question: "What happens to my files after I'm done?",
    answer:
      "To protect your privacy, all processed and uploaded files are automatically deleted from our servers after a short period (typically 2 hours). We do not keep any copies of your documents.",
  },
  {
    question: "My file won't upload or is taking too long. What should I do?",
    answer:
      "Please first check your internet connection. Large files may take longer to upload depending on your connection speed. Also, ensure your file is not corrupted and is a supported format. If the problem persists, try refreshing the page and attempting the upload again.",
  },
  {
    question: "Do you offer a premium or paid version?",
    answer:
      "Currently, PDFMingle is entirely free. We are focused on providing the best possible service to everyone. We may consider introducing premium features for professional users in the future, but our core tools will always remain free.",
  },
];

export const FaqSection = () => {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-12">
            Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

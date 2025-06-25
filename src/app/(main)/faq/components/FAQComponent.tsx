"use client";
import { useState } from "react";
import Image from "next/image";

const faqItems = [
  {
    question: "will there be restock?",
    answer:
      "Due to our drop system business model, we do not offer restocks. We will never have a bikini with the same style & print twice.",
  },
  {
    question: "when can I expect my package?",
    answer:
      "Please allow up to 5 business days for order processing. All orders are shipped via expedited service, with estimated delivery within 5–7 business days from the date of shipment.",
  },
  {
    question: "what if I am unsure about my size?",
    answer:
      "We recommend reviewing our Size & Fit guide, or contacting our team for personalized assistance before purchasing.",
  },
  {
    question: "what is the presale process?",
    answer:
      "Presale orders secure your item in advance. Payment is taken at the time of purchase and your order will ship as soon as it's available.",
  },
  {
    question: "what should I do if I receive a damaged item?",
    answer:
      "Please contact us within 3 days of delivery with photos of the item and packaging. We'll help resolve the issue quickly.",
  },
  {
    question: "how much is shipping?",
    answer:
      "We offer free US shipping on all orders, and free worldwide shipping on orders over $200.",
  },
  {
    question: "what if I accidentally ordered the wrong item?",
    answer:
      "If your order hasn't shipped yet, contact us immediately to request changes. Once shipped, we are unable to make changes.",
  },
  {
    question: "do you have a loyalty program?",
    answer:
      "We're currently developing our loyalty program! Stay tuned by signing up for our newsletter.",
  },
  {
    question: "are there any care instructions for my swimwear?",
    answer:
      "Yes. Hand wash cold, dry flat in shade, and avoid harsh detergents or wringing to preserve the fabric and shape.",
  },
  {
    question: "are there any additional fees for international orders?",
    answer:
      "Some countries may charge customs or import fees. These are the buyer's responsibility and not included at checkout.",
  },
  {
    question: "can I change my shipping address after placing an order?",
    answer:
      "If your order hasn't shipped, email us as soon as possible to update the address.",
  },
  {
    question: "are your products tested for quality and durability?",
    answer:
      "Yes, all items are quality-checked and undergo wear testing to ensure longevity and satisfaction.",
  },
  {
    question: "what are your business hours for customer support?",
    answer:
      "Our support team is available Monday–Friday, 9 AM to 5 PM PST. We aim to respond within 24 hours.",
  },
  {
    question: "do you offer any collaborations or partnerships with influencers?",
    answer:
      "Yes! We love collaborating with creators. Reach out to us via our Contact page or DM us on Instagram.",
  },
];

export default function FAQComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h1 className="text-2xl sm:text-3xl font-medium text-center mb-2">FAQ</h1>
      <p className="text-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-10">
        the following covers the most common questions.
      </p>

      <div className="space-y-2 sm:space-y-3">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left py-3 sm:py-4 text-xs sm:text-sm font-medium hover:text-black transition-colors duration-200"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="pr-4">{item.question}</span>
              <Image
                className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0"
                src={openIndex === index ? "/icons/minus.svg" : "/icons/pluss.svg"}
                alt={openIndex === index ? "Collapse answer" : "Expand answer"}
                width={20}
                height={20}
              />
            </button>
            {openIndex === index && (
              <div 
                id={`faq-answer-${index}`}
                className="pb-3 sm:pb-4 text-xs sm:text-sm text-gray-700"
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
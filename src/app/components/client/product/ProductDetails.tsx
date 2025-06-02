"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductDetailsProps {
  description: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  description
}) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { id: 'description', title: 'Description', content: description },
    { 
      id: 'material', 
      title: 'Material, Composition, Care', 
      content: 'A brand is your identity, an extension of who you are and what you provide. This package includes a branding guide, a primary logo, alternative logos, color schemes, mockup designs and integration, and a social media kit. Creating a connection to your ideas and executing such to the fullest extent is complex. With Web Jelly, we can make that translation happen.' 
    },
    { 
      id: 'sustainability', 
      title: 'Sustainability', 
      content: 'We are committed to sustainable practices throughout our production process. Our materials are carefully selected to minimize environmental impact while maintaining the highest quality standards.' 
    },
    { 
      id: 'shipping', 
      title: 'Shipping & Returns', 
      content: 'Free shipping on all orders. We accept returns within 30 days of delivery. Items must be unworn and in original condition with all tags attached.' 
    }
  ];

  return (
    <div className="w-full mt-8 space-y-2">
      {sections.map((section) => (
        <div key={section.id} className="border-b border-neutral-200">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex justify-between items-center w-full py-4 text-left font-darker-grotesque text-lg"
          >
            <span>{section.title}</span>
            <Image
              className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0"
              src={openSection === section.id ? "/icons/minus.svg" : "/icons/pluss.svg"}
              alt={`${openSection === section.id ? 'Collapse' : 'Expand'} ${section.title} section`}
              width={20}
              height={20}
            />
          </button>
          {openSection === section.id && section.content && (
            <div className="pb-4 text-sm text-neutral-700 font-darker-grotesque">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductDetails; 
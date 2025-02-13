import { getCollectionJournal } from '@/app/lib/shopify';
import React from 'react';

// Types for the structured JSON data
interface PolicySection {
  layout: {
    container_classes: {
      main: string;
      inner: string;
    };
  };
  header: {
    title: {
      text: string;
      classes: string;
    };
    introduction: {
      text: string;
      classes: string;
    };
  };
  sections: {
    returns: {
      title: {
        text: string;
        classes: string;
      };
      content: {
        id: string;
        title: string;
        title_classes: string;
        content: string;
        content_classes: string;
        container_classes: string;
      }[];
    };
    cancellations: {
      title: {
        text: string;
        classes: string;
      };
      content: {
        id: string;
        title: string;
        title_classes: string;
        content: string;
        content_classes: string;
        container_classes: string;
      }[];
    };
  };
  contact: {
    content: string;
    email: {
      text: string;
      url: string;
      classes: string;
    };
    content_classes: string;
    container_classes: string;
  };
  styles: {
    fonts: {
      heading: string;
      body: string;
    };
    colors: {
      background: string;
      text: {
        primary: string;
        secondary: string;
      };
    };
  };
}

interface SectionContent {
  id: string;
  title: string;
  title_classes: string;
  content: string;
  content_classes: string;
  container_classes: string;
}

export default async function ReturnPolicy() {
  const data = await getCollectionJournal('return');

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-darker-grotesque text-neutral-700">Loading policy information...</p>
      </div>
    );
  }

  const { policy_section } = JSON.parse(data.fields[0].value);
  const { layout, header, sections, contact } = policy_section as PolicySection;

  return (
    <div className={layout.container_classes.main}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={header.title.classes}>
            {header.title.text}
          </h1>
          <p className={header.introduction.classes}>
            {header.introduction.text}
          </p>
        </div>

        {/* Returns Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-darker-grotesque text-neutral-800 mb-8 text-center">
            {sections.returns.title.text}
          </h2>
          <div className="space-y-12">
            {sections.returns.content.map((section: SectionContent) => (
              <div key={section.id} className="space-y-2">
                <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800">
                  {section.title}
                </h3>
                <p className="text-lg font-darker-grotesque text-neutral-700">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-darker-grotesque text-neutral-800 mb-8 text-center">
            {sections.cancellations.title.text}
          </h2>
          <div className="space-y-12">
            {sections.cancellations.content.map((section: SectionContent) => (
              <div key={section.id} className="space-y-2">
                <h3 className="text-xl font-bold font-darker-grotesque text-neutral-800">
                  {section.title}
                </h3>
                <p className="text-lg font-darker-grotesque text-neutral-700">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <p className={contact.content_classes}>
            {contact.content}{" "}
            <a href={contact.email.url} className={contact.email.classes}>
              {contact.email.text}
            </a>
            . We&apos;re happy to assist you.
          </p>
        </div>
      </div>
    </div>
  );
}
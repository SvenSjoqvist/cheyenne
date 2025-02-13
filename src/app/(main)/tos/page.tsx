import { getCollectionJournal } from '@/app/lib/shopify';
import React from 'react';


// Define type for section content
interface SectionContent {
  id: string;
  title: string;
  title_classes: string;
  content: string;
  content_classes: string;
  container_classes: string;
}

export default async function TermsOfService() {
  const data = await getCollectionJournal('tos');

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-darker-grotesque text-neutral-700">Loading...</p>
      </div>
    );
  }

  const { terms_section } = JSON.parse(data.fields[0].value);
  const { layout, header, sections, contact } = terms_section;

  return (
    <div className={layout.container_classes.main}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={header.title.classes}>
            {header.title.text}
          </h1>
          <p className={header.last_updated.classes}>
            {header.last_updated.text}
          </p>
          <p className={header.introduction.classes}>
            {header.introduction.text}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {sections.map((section: SectionContent) => (
            <div key={section.id} className="space-y-2">
              <h2 className={section.title_classes}>
                {section.title}
              </h2>
              <p className={section.content_classes}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <h2 className={contact.title_classes}>
            {contact.title}
          </h2>
          <p className={contact.content_classes}>
            {contact.content}
            <a href={contact.email.url} className={contact.email.classes}>
              {contact.email.text}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
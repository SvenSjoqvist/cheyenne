import React from 'react';
import Image from 'next/image';
import { getCollectionJournal } from '@/app/lib/shopify';

interface ImageSection {
  container_classes: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    layout: string;
  };
}

interface ContentSection {
  heading: {
    text: string;
    classes: string;
  };
  paragraphs: Array<{
    text: string;
    classes: string;
  }>;
}

interface QuoteSection {
  container_classes: string;
  lines: string[];
}

interface AboutSectionContent {
  about_section: {
    layout: {
      container_classes: {
        main: string;
        inner: string;
        content_width: string;
      };
      responsive_classes: {
        column_layout: string;
        column_width: string;
      };
    };
    image_section: ImageSection;
    content_section: ContentSection;
    quote_section: QuoteSection;
  };
}

const AboutUs: React.FC = async () => {
  const metaobject = await getCollectionJournal('collection-journal-about');
  
  if (!metaobject) {
    throw new Error('Failed to load about section content');
  }

  const content: AboutSectionContent = JSON.parse(metaobject.fields[0].value);
  const { about_section } = content;

  return (
    <div className="flex overflow-hidden flex-col bg-neutral-100">
      <div className="flex flex-col mt-20 ml-8 w-full max-md:mt-10 max-md:max-w-full">
        <div className="w-full max-w-[1164px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            {/* Image Section */}
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex shrink-0 mx-auto max-w-full bg-zinc-100 h-[729px] w-[583px] max-md:mt-5">
                <Image
                  src={about_section.image_section.image.src}
                  alt={about_section.image_section.image.alt}
                  width={about_section.image_section.image.width}
                  height={about_section.image_section.image.height}
                  layout={about_section.image_section.image.layout as "responsive"}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col mt-2 text-neutral-800 max-md:mt-7 max-md:max-w-full">
                <h1 className="self-start text-3xl font-bold tracking-widest leading-none font-[bero]">
                  {about_section.content_section.heading.text}
                </h1>
                <div className="mt-9 text-2xl font-medium max-md:max-w-full font-darker-grotesque">
                  {about_section.content_section.paragraphs.map((paragraph, index) => (
                    <p 
                      key={index} 
                      className={index === 0 ? '' : 'mt-4'}
                    >
                      {paragraph.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <section className="self-center my-48 text-4xl font-bold leading-10 text-center text-neutral-800 tracking-[2px] max-md:mt-10 max-md:max-w-full font-[bero]">
          <article className="flex flex-col gap-4">
            {about_section.quote_section.lines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </article>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
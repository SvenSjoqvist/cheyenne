import React from 'react';
import Image from 'next/image';

interface ContentSectionData {
  content_section: {
    main_content: {
      left_column: {
        text: string[];
      };
      right_column: {
        images: {
          url: string;
          alt: string;
          position: "main" | "overlay";
        }[];
      };
    };
    bottom_content: {
      text: string[];
      additional_image: {
        url: string;
        alt: string;
      };
    };
    layout: {
      spacing: {
        top_margin: string;
        left_margin: string;
        bottom_text_margin: string;
        additional_image_margin: string;
      };
      responsive_classes: {
        container: string;
        text_container: string;
        image_container: string;
        bottom_text: string;
      };
    };
  };
}

interface CollectionContentProps {
  metaobject: {
    fields: {
      key: string;
      value: string;
    }[];
  };
}

const ContentSection: React.FC<CollectionContentProps> = ({ metaobject }) => {
  const content: ContentSectionData = JSON.parse(metaobject.fields[0].value);
  const { main_content, bottom_content, layout } = content.content_section;

  return (
    <section className={`px-16 flex flex-col ${layout.spacing.top_margin} ${layout.spacing.left_margin} w-full ${layout.responsive_classes.container}`}>
      {/* Text and Image Section */}
      <div className="max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {/* Left Column (Text) */}
          <article className={`flex flex-col w-6/12 ${layout.responsive_classes.text_container} max-md:mt-10 max-md:w-full`}>
            <p className="text-2xl text-neutral-800 font-darker-grotesque max-md:text-xl">
              {main_content.left_column.text.map((paragraph, index) => (
                <React.Fragment key={index}>
                  {paragraph}
                  {index < main_content.left_column.text.length - 1 && (
                    <>
                      <br />
                    </>
                  )}
                </React.Fragment>
              ))}
            </p>
          </article>

          {/* Right Column (Images) */}
          <div className={`flex flex-col ml-5 w-6/12 ${layout.responsive_classes.image_container}`}>
            <div className="flex flex-col grow mt-96 max-md:mt-10 max-md:max-w-full">
              {main_content.right_column.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative ${
                    image.position === "main"
                      ? "self-end max-w-full aspect-[1.54] w-[483px] max-md:w-full max-md:aspect-[1.2]"
                      : "z-10 -mt-20 ml-20 max-w-full aspect-[0.84] w-[269px] max-md:ml-10 max-md:-mt-10 max-md:w-[200px]"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes={
                      image.position === "main"
                        ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust for main image
                        : "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" // Adjust for overlay image
                    }
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text Section */}
      <article className={`mr-16 self-end w-6/12 ${layout.spacing.bottom_text_margin} text-2xl text-neutral-800 ${layout.responsive_classes.bottom_text} font-darker-grotesque`}>
        <p>
          {bottom_content.text.map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph}
              {index < bottom_content.text.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </article>

      {/* Additional Image Section */}
      {bottom_content.additional_image && (
        <div className={`relative ${layout.spacing.additional_image_margin} max-w-full aspect-[1.17] w-[546px] max-md:ml-0 max-md:w-full max-md:mt-10`}>
          <Image
            src={bottom_content.additional_image.url}
            alt={bottom_content.additional_image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust for additional image
            className="object-contain"
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
};

export default ContentSection;
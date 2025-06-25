import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/sustainability');
  
  // Enhanced metadata for the Sustainability page
  return {
    ...baseMetadata,
    title: 'Sustainability - Kilaeko | Ethical Swimwear & Conscious Production',
    description: 'Discover Kilaeko\'s commitment to sustainability through intentional design, slow production in Bali, and mindful manufacturing. Learn about our ethical practices and timeless swimwear.',
    keywords: [
      'Kilaeko sustainability',
      'ethical swimwear',
      'sustainable fashion',
      'conscious production',
      'slow fashion',
      'Bali manufacturing',
      'ethical swimwear brand',
      'sustainable swimwear',
      'mindful production',
      'limited edition swimwear',
      'artisan swimwear',
      'transparent production'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Sustainability - Kilaeko | Ethical Swimwear & Conscious Production',
      description: 'Discover Kilaeko\'s commitment to sustainability through intentional design, slow production in Bali, and mindful manufacturing. Learn about our ethical practices and timeless swimwear.',
      images: [
        {
          url: '/images/sustainability.jpg',
          width: 1200,
          height: 630,
          alt: 'Kilaeko Sustainability - Ethical swimwear production and conscious manufacturing practices',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'Sustainability - Kilaeko | Ethical Swimwear & Conscious Production',
      description: 'Discover Kilaeko\'s commitment to sustainability through intentional design, slow production in Bali, and mindful manufacturing. Learn about our ethical practices and timeless swimwear.',
      images: ['/images/sustainability.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://kilaeko.com/sustainability',
    },
    other: {
      'theme-color': '#F5F5F5',
      'color-scheme': 'light',
    },
  };
}

export default async function SustainabilityPage() {
    // Generate structured data for the Sustainability page
    const structuredData = await generateStructuredData('/sustainability') || {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Sustainability - Kilaeko',
      description: 'Discover Kilaeko\'s commitment to sustainability through intentional design, slow production in Bali, and mindful manufacturing practices',
      url: 'https://kilaeko.com/sustainability',
      mainEntity: {
        '@type': 'Article',
        headline: 'Sustainability - Kilaeko',
        description: 'Our approach to sustainability is rooted in transparency and intention. Learn more about the materials, methods, and choices behind the production.',
        author: {
          '@type': 'Organization',
          name: 'Kilaeko',
          url: 'https://kilaeko.com'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Kilaeko',
          logo: {
            '@type': 'ImageObject',
            url: 'https://kilaeko.com/logo.png'
          }
        },
        datePublished: '2025-01-22',
        dateModified: '2025-01-22',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://kilaeko.com/sustainability'
        },
        about: [
          {
            '@type': 'Thing',
            name: 'Sustainable Fashion'
          },
          {
            '@type': 'Thing',
            name: 'Ethical Production'
          },
          {
            '@type': 'Thing',
            name: 'Slow Fashion'
          },
          {
            '@type': 'Thing',
            name: 'Conscious Manufacturing'
          },
          {
            '@type': 'Thing',
            name: 'Bali Production'
          }
        ],
        mentions: [
          {
            '@type': 'Place',
            name: 'Bali, Indonesia',
            description: 'Location of Kilaeko\'s artisan production team'
          },
          {
            '@type': 'Thing',
            name: 'Limited Edition Production'
          },
          {
            '@type': 'Thing',
            name: 'Artisan Collaboration'
          },
          {
            '@type': 'Thing',
            name: 'Transparent Manufacturing'
          }
        ]
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://kilaeko.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Sustainability',
            item: 'https://kilaeko.com/sustainability'
          }
        ]
      },
      hasPart: {
        '@type': 'ItemList',
        name: 'Kilaeko Sustainability Practices',
        description: 'Comprehensive overview of Kilaeko\'s sustainable and ethical practices',
        numberOfItems: 5,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Intentional by Design',
            description: 'Limited quantity production with no restocks to avoid overproduction'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Slow Made in Bali',
            description: 'Artisan production in Bali, Indonesia with direct collaboration'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Mindful Production Process',
            description: 'Purposeful creation with clear intentions and lasting connections'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Designs that Last',
            description: 'Timeless pieces designed for longevity and repeated wear'
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Commitment to Do Less',
            description: 'Reducing impact through selective production and better decisions'
          }
        ]
      }
    };

    const sustainabilitySections = [
        {
            title: "Intentional by design.",
            content: "At Kilaeko, sustainability begins with how much we choose not to produce. Every collection is made in limited quantities, with no restocks. This is a purposeful choice that keeps our production process intentional, ensuring quality is met on every single level with every garment. It's how we avoid overproduction, reduce waste, and keep our process aligned with our values. We encourages our community to shop with mindfulness, valuing a conscious shopping experience."
        },
        {
            title: "Slow made in <br/>Bali, Indonesia.",
            content: "Our pieces are produced and manufactured in Bali, Indonesia, in close collaboration with an artisan team. We consistently maintain direct communication so we can be a part of the process from start to finish. Production goes beyond the borders—while we're based in the U.S., we've built a strong partnership with a small team abroad, working together to bring each design to life with intention and care based on shared values. By working closely with our partners, we support a more mindful atmosphere of ethics and transparency that centers people over profit."
        },
        {
            title: "A mindful production <br />process.",
            content: "Each collection begins with a clear intention. We release only what's necessary, with no plans for repeats. This creates space for more thoughtful consumption and encourages a lasting connection to each garment. When we create, it's with purpose, and every piece carries intention. This concept we embarked on challenges the idea that more is better. We are driven to make each collection count by doing less. It's our way of building a slower, more conscious brand—one that grows with our community and is representative of human experiences—a core value where each piece reflects on memories. It's a reminder that, like you, some things in life are ingrained and stay with you forever. Our swimwear is crafted to embody exactly that—a one-of-a-kind moment."
        },
        {
            title: "Designs that last.",
            content: "Sustainability at its center is rooted in longevity. Our pieces are designed to live beyond a single season, true to a timeless nature. With a focus on function, it's important to us that our swimwear continues to serve you well beyond the moment. Every decision, from cut to construction, is made with durability in mind. We choose materials and finishes that support repeated wear, wash, and movement. Because the most sustainable wardrobe is one built on things you don't have to replace. These are pieces meant to stay with you—evolving through time, not discarded because time passed."
        },
        {
            title: "Our commitment <br />to do less.",
            content: "We reduce our impact by addressing the core foundation from the get go: quantity. By being selective about what we create and how much of it is produced, we avoid excess from the very beginning. Following this model allows us to minimize waste and the footprint that comes with large-scale manufacturing. Each piece follows clear practices, shaped through a close and personal partnership with our Bali-based team. By doing less, we make room for better decisions, leading us to pour more into each design."
        }
    ];

    return (
        <>
          <Script
            id="sustainability-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
          <main className="min-h-screen bg-neutral-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <header>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center font-[bero] mb-6 md:mb-10">
                        Sustainability
                    </h1>
                    <div className="max-w-3xl mx-auto mb-16 md:mb-24">
                        <p className="text-base md:text-lg lg:text-xl font-medium text-center font-darker-grotesque">
                            Our approach to sustainability is rooted in transparency and intention. Learn more about the materials, methods, and choices behind the production.
                        </p>
                    </div>
                </header>

                <article className="space-y-16 md:space-y-24">
                    {sustainabilitySections.map((section, index) => (
                        <section 
                            key={index}
                            className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 lg:gap-20"
                        >
                            <h2 
                                className="text-2xl md:text-3xl font-medium font-darker-grotesque md:w-1/3"
                                dangerouslySetInnerHTML={{ __html: section.title }}
                            />
                            <p className="text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque md:w-2/3 leading-relaxed">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </article>
            </div>
          </main>
        </>
    );
}
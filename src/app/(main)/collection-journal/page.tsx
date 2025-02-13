import React from 'react';
import HeroSection from '../../components/grid/HeroSection';
import ContentSection from '../../components/grid/ContentSection';
import ImageGallery from '../../components/grid/ImageGallery';
import { getCollectionJournal } from '@/app/lib/shopify';

export default async function CollectionPage() {
    const metaobject = await getCollectionJournal('collection-journal');


  if (!metaobject) {
    return <div>No content available</div>;
  }

    return (
    <div className="flex overflow-hidden flex-col pb-20 bg-neutral-100">
      <HeroSection />
      <ContentSection metaobject={metaobject} />
      <ImageGallery />
    </div>
  );
};

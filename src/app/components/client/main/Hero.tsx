import React from 'react';

interface HeroSectionProps {
  minHeight?: string | number;
  topPadding?: string | number;
  onButtonClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = () => {

  return (
    <section 
      className="relative w-full"
      style={{ 
        minHeight: '866px'
      }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <video
          src="/videos/home-opening.mp4"
          autoPlay
          loop
          preload="aut>?G"
          muted
          playsInline
          className="object-cover w-full h-full"
        />
      </div>
    </section>
  );
};

export default HeroSection;
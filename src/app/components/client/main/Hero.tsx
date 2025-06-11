import React from 'react';

interface HeroSectionProps {
  minHeight?: string | number;
  topPadding?: string | number;
  onButtonClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image Container */}
      <div className="relative w-full aspect-[16/9]">
        <video
          src="/videos/home-opening.mp4"
          autoPlay
          loop
          preload="auto"
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
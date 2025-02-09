import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  backgroundImage: string;
  buttonText: string;
  minHeight?: string | number;
  topPadding?: string | number;
  buttonSize?: 'small' | 'medium' | 'large';
  onButtonClick?: () => void;
  overlay?: boolean;
  overlayOpacity?: number;
}

const buttonSizes = {
  small: {
    width: 'w-20',
    height: 'h-20',
    fontSize: 'text-base',
    padding: 'px-3'
  },
  medium: {
    width: 'w-24',
    height: 'h-24',
    fontSize: 'text-lg',
    padding: 'px-4'
  },
  large: {
    width: 'w-32',
    height: 'h-32',
    fontSize: 'text-xl',
    padding: 'px-6'
  }
};

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  buttonText,
  minHeight = '866px',
  topPadding = '660px',
  buttonSize = 'medium',
  onButtonClick,
  overlay = true,
  overlayOpacity = 0.4
}) => {
  const buttonStyles = buttonSizes[buttonSize];

  return (
    <section 
      className="relative w-full"
      style={{ 
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight 
      }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {overlay && (
          <div 
            className="absolute inset-0 bg-black" 
            style={{ opacity: overlayOpacity }}
          />
        )}
      </div>

      {/* Content Container - Removed right padding and adjusted alignment */}
      <div 
        className="relative flex flex-col w-full text-white
          max-md:py-24 max-md:max-w-full"
        style={{ 
          paddingTop: typeof topPadding === 'number' ? `${topPadding}px` : topPadding,
          paddingBottom: '7rem'
        }}
      >
        <button
          onClick={onButtonClick}
          className={`
            ${buttonStyles.width}
            ${buttonStyles.height}
            ${buttonStyles.fontSize}
            ${buttonStyles.padding}
            rounded-xl
            bg-neutral-800
            hover:bg-neutral-700
            transition-colors
            duration-200
            font-medium
            tracking-wider
            leading-5
            flex
            items-center
            justify-center
            transform
            hover:scale-105
            active:scale-95
          `}
          style={{
            position: 'absolute',
            right: 0,
            marginRight: 0
          }}
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
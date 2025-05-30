import Image from "next/image";

interface ImageOverlayProps {
  backgroundSrc: string;
  overlaySrc: string;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  backgroundSrc,
  overlaySrc,
}) => {
  return (
    <div className="relative w-full h-full min-h-[800px] max-md:min-h-[400px]">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={backgroundSrc}
          fill
          alt="Background"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-[1250px] h-full">
          <Image
            loading="lazy"
            src={overlaySrc}
            fill
            alt="Overlay"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;

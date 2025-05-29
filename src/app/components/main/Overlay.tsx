interface ImageOverlayProps {
  backgroundSrc: string;
  overlaySrc: string;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  backgroundSrc,
  overlaySrc,
}) => {
  return (
    <div className="flex relative flex-col justify-center items-center w-full h-full min-h-[800px] max-md:min-h-[400px] max-md:max-w-full">
      <img
        loading="lazy"
        src={backgroundSrc}
        alt=""
        className="object-cover absolute inset-0 w-full h-full z-0"
      />
      <img
        loading="lazy"
        src={overlaySrc}
        alt=""
        className="object-contain w-full h-full max-w-[1250px] max-md:max-w-full z-10"
      />
    </div>
  );
};

export default ImageOverlay;

interface ImageOverlayProps {
    backgroundSrc: string;
    overlaySrc: string;
  }
  
  const ImageOverlay: React.FC<ImageOverlayProps> = ({ backgroundSrc, overlaySrc }) => {
    return (
      <div className="flex relative flex-col justify-center items-center w-full min-h-[1024px] max-md:px-5 max-md:max-w-full">
        <img
          loading="lazy"
          src={backgroundSrc}
          alt=""
          className="object-cover absolute inset-0 w-full h-full z-0" // Ensure background image takes up the full width and height
        />
        <img
          loading="lazy"
          src={overlaySrc}
          alt=""
          className="object-contain w-full h-full max-w-[1192px] max-md:max-w-full z-10" // Ensure overlay image stretches fully, remove aspect ratio constraint
        />
      </div>
    );
  };
  
  export default ImageOverlay;
  
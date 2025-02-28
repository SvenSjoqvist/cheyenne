"use client";
import Image from "next/image";
import { GridTileImage } from "../grid/Tile";
import { useProduct, useUpdateURL } from "./product-context";

export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  return (
    <form>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Thumbnail sidebar - with fixed width */}
        {images.length > 1 ? (
          <div className="lg:order-first order-last flex lg:flex-col lg:w-40 flex-shrink-0 gap-2 overflow-auto pb-1">
            {images.map((image, index) => {
              const isActive = index === imageIndex;
              return (
                <div key={image.src} className="h-40 w-40 flex-shrink-0">
                  <button
                    formAction={() => {
                      const newState = updateImage(index.toString());
                      updateURL(newState);
                    }}
                    aria-label="Select product image"
                    className="h-full w-full"
                  >
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      active={isActive}
                      width={80}
                      height={80}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Main product image - with explicit height and flex-grow */}
        <div className="relative flex-grow w-full h-[700px] lg:h-[1000px]">
          {images[imageIndex] && (
            <Image
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              src={images[imageIndex]?.src as string}
              alt={images[imageIndex]?.altText as string}
              priority={true}
            />
          )}
        </div>
      </div>
    </form>
  );
}
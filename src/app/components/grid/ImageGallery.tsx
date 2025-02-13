import Image from 'next/image';

const ImageGallery: React.FC = () => {
  const images = [
    { src: "https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/759e3f439a4d5ecdb481bac5a0f211bc499b9861e6a89d2af3c9d361d2c97c40?apiKey=df24f938eeb948889fe9ad55656873a2&", alt: "Gallery image 1" },
    { src: "https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/41f27e40fb2c54c846944fc674f6f13041233bec890ca2fb3316865352000439?apiKey=df24f938eeb948889fe9ad55656873a2&", alt: "Gallery image 2" },
    { src: "https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/6555dad58b5a3725633a57fec591f17e1dc65cfb92195c951af44141550351ec?apiKey=df24f938eeb948889fe9ad55656873a2&", alt: "Gallery image 3" },
  ];

  return (
    <div className="self-center mt-32 w-full max-w-[1282px] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
            <div className="relative w-full aspect-[0.74] max-md:mt-8">
            <Image
  src={image.src}
  alt={image.alt}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover w-full h-auto" // Tailwind classes for responsiveness
  loading="lazy"
/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
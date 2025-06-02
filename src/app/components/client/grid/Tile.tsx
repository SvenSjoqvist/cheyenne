import Image from "next/image";
import clsx from "clsx";

interface GridTileImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  isInteractive?: boolean;
  background?: "white" | "pink" | "purple" | "black" | "purple-dark" | "blue" | "cyan" | "gray" | "zinc";
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
}

export function GridTileImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  isInteractive = true,
  background = "white",
  active,
  label,
}: GridTileImageProps) {
  return (
    <div
      className={clsx(
        "group relative h-full w-full overflow-hidden rounded-lg bg-neutral-100",
        {
          "bg-white": background === "white",
          "bg-pink-100": background === "pink",
          "bg-purple-100": background === "purple",
          "bg-gray-900": background === "black",
          "bg-violet-950": background === "purple-dark",
          "bg-blue-100": background === "blue",
          "bg-cyan-100": background === "cyan",
          "bg-gray-100": background === "gray",
          "bg-zinc-100": background === "zinc",
          relative: label,
          "cursor-pointer": isInteractive,
        }
      )}
    >
      {src ? (
        <Image
          className={clsx("relative h-full w-full object-cover", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          alt={alt || 'Swimwear Kilaeko'}
          src={src}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          priority={priority}
        />
      ) : null}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black/20" />
      )}
      {label ? (
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center bg-black/70",
            {
              "bg-black/60": active,
              "bg-black/70": !active,
            }
          )}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-white">{label.title}</p>
            <p className="text-sm font-medium text-white">
              {label.amount} {label.currencyCode}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
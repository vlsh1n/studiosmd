"use client";

import Zoom from "react-medium-image-zoom";

type Props = {
  images: string[];
  alt: string;
};

export default function HallGalleryZoom({ images, alt }: Props) {
  if (images.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto">
      {images.map((image) => (
        <Zoom key={image}>
          <img
            src={image}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-24 w-32 rounded object-cover"
          />
        </Zoom>
      ))}
    </div>
  );
}

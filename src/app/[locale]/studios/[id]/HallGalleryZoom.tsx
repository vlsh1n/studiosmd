"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  images: string[];
  alt: string;
};

function clampIndex(value: number, maxIndex: number) {
  return Math.min(Math.max(value, 0), maxIndex);
}

export default function HallGalleryZoom({ images, alt }: Props) {
  if (images.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const maxIndex = images.length - 1;
  const hasMultiple = images.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(hasMultiple);
  const prefersReducedMotion = useReducedMotion();
  const overlayDuration = prefersReducedMotion ? 0 : 0.2;
  const modalDuration = prefersReducedMotion ? 0 : 0.22;
  const imageDuration = prefersReducedMotion ? 0 : 0.2;
  const modalInitialScale = prefersReducedMotion ? 1 : 0.98;

  function changeInlineSlide(direction: -1 | 1) {
    if (!emblaApi || !hasMultiple) return;
    if (direction === -1) {
      emblaApi.scrollPrev();
    } else {
      emblaApi.scrollNext();
    }
  }

  function openModal(index: number) {
    setModalIndex(index);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function changeModalSlide(direction: -1 | 1) {
    if (!hasMultiple) return;
    setModalIndex((current) => clampIndex(current + direction, maxIndex));
  }

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowLeft") {
        changeModalSlide(-1);
      } else if (event.key === "ArrowRight") {
        changeModalSlide(1);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen, hasMultiple, maxIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    const syncEmblaState = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    syncEmblaState();
    emblaApi.on("select", syncEmblaState);
    emblaApi.on("reInit", syncEmblaState);

    return () => {
      emblaApi.off("select", syncEmblaState);
      emblaApi.off("reInit", syncEmblaState);
    };
  }, [emblaApi]);

  return (
    <>
      <div className="relative">
        <div className="w-full touch-pan-y overflow-hidden rounded" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="flex-none w-full">
                <button
                  type="button"
                  onClick={() => openModal(index)}
                  className="h-56 w-full overflow-hidden rounded sm:h-64"
                >
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => changeInlineSlide(-1)}
              disabled={!canScrollPrev}
              className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white lg:flex disabled:opacity-40"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => changeInlineSlide(1)}
              disabled={!canScrollNext}
              className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white lg:flex disabled:opacity-40"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}

        {hasMultiple && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 text-xs text-white">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: overlayDuration, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/85 p-3 sm:p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: modalInitialScale }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: modalInitialScale }}
              transition={{ duration: modalDuration, ease: "easeOut" }}
              className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full bg-black/55 text-xl text-white sm:right-4 sm:top-4"
                aria-label="Close gallery"
              >
                ×
              </button>

              <button
                type="button"
                onClick={() => changeModalSlide(-1)}
                disabled={!hasMultiple || modalIndex === 0}
                className="absolute left-2 z-10 h-10 w-10 rounded-full bg-black/55 text-2xl text-white sm:left-4 disabled:opacity-40"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => changeModalSlide(1)}
                disabled={!hasMultiple || modalIndex === maxIndex}
                className="absolute right-2 z-10 h-10 w-10 rounded-full bg-black/55 text-2xl text-white sm:right-4 disabled:opacity-40"
                aria-label="Next image"
              >
                ›
              </button>

              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={modalIndex}
                  src={images[modalIndex]}
                  alt={alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: imageDuration, ease: "easeOut" }}
                  className="max-h-full w-full rounded object-contain"
                />
              </AnimatePresence>

              {hasMultiple && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-sm text-white">
                  {modalIndex + 1}/{images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

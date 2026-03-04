"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  images: string[];
  alt: string;
};

function clampIndex(value: number, maxIndex: number) {
  return Math.min(Math.max(value, 0), maxIndex);
}

const SWIPE_THRESHOLD_PX = 42;

export default function HallGalleryZoom({ images, alt }: Props) {
  if (images.length === 0) return null;

  return <HallGalleryZoomContent images={images} alt={alt} />;
}

function HallGalleryZoomContent({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [inlinePortraitByIndex, setInlinePortraitByIndex] = useState<Record<number, boolean>>({});
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
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeCurrentRef = useRef<{ x: number; y: number } | null>(null);

  const changeInlineSlide = useCallback((direction: -1 | 1) => {
    if (!emblaApi || !hasMultiple) return;
    if (direction === -1) {
      emblaApi.scrollPrev();
    } else {
      emblaApi.scrollNext();
    }
  }, [emblaApi, hasMultiple]);

  const openModal = useCallback((index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const changeModalSlide = useCallback((direction: -1 | 1) => {
    if (!hasMultiple) return;
    setModalIndex((current) => clampIndex(current + direction, maxIndex));
  }, [hasMultiple, maxIndex]);

  const handleModalTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!hasMultiple || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const point = { x: touch.clientX, y: touch.clientY };
    swipeStartRef.current = point;
    swipeCurrentRef.current = point;
  }, [hasMultiple]);

  const handleModalTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!swipeStartRef.current || event.touches.length !== 1) return;
    const touch = event.touches[0];
    swipeCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleModalTouchEnd = useCallback(() => {
    const start = swipeStartRef.current;
    const end = swipeCurrentRef.current;
    swipeStartRef.current = null;
    swipeCurrentRef.current = null;

    if (!start || !end) return;

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < SWIPE_THRESHOLD_PX || absX <= absY) return;

    changeModalSlide(deltaX > 0 ? -1 : 1);
  }, [changeModalSlide]);

  const handleInlineImageLoad = useCallback(
    (index: number, event: SyntheticEvent<HTMLImageElement>) => {
      const imageElement = event.currentTarget;
      const isPortrait = imageElement.naturalHeight > imageElement.naturalWidth;
      setInlinePortraitByIndex((current) => {
        if (current[index] === isPortrait) {
          return current;
        }
        return { ...current, [index]: isPortrait };
      });
    },
    []
  );

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
  }, [isModalOpen, closeModal, changeModalSlide]);

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
            {images.map((image, index) => {
              const useContain = inlinePortraitByIndex[index] === true;

              return (
                <div key={`${image}-${index}`} className="flex-none w-full">
                  <button
                    type="button"
                    onClick={() => openModal(index)}
                    className="relative w-full overflow-hidden rounded bg-black/5 aspect-[4/3] sm:aspect-[16/10]"
                  >
                    <img
                      src={image}
                      alt={alt}
                      loading="lazy"
                      decoding="async"
                      onLoad={(event) => handleInlineImageLoad(index, event)}
                      className={`absolute inset-0 h-full w-full object-center ${
                        useContain ? "object-contain" : "object-cover"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
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

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: overlayDuration, ease: "easeOut" }}
                className="fixed inset-0 z-[120] bg-black/85"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ opacity: 0, scale: modalInitialScale }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: modalInitialScale }}
                  transition={{ duration: modalDuration, ease: "easeOut" }}
                  className="relative flex h-[100dvh] w-[100dvw] items-center justify-center"
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

                  <div
                    className="max-h-screen max-w-screen touch-pan-y"
                    onTouchStart={handleModalTouchStart}
                    onTouchMove={handleModalTouchMove}
                    onTouchEnd={handleModalTouchEnd}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={modalIndex}
                        src={images[modalIndex]}
                        alt={alt}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: imageDuration, ease: "easeOut" }}
                        className="max-h-screen max-w-screen object-contain"
                      />
                    </AnimatePresence>
                  </div>

                  {hasMultiple && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-sm text-white">
                      {modalIndex + 1}/{images.length}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

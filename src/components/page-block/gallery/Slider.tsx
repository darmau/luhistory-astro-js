import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Counter from "yet-another-react-lightbox/plugins/counter";
import ArrowLeft from "../../react-icon/ArrowLeft.tsx";
import ArrowRight from "../../react-icon/ArrowRight.tsx";
import Close from "../../react-icon/Close.tsx";
import type { GallerySliderProps, RemoteImageSet } from "@/types";
import type { SlideImage } from "yet-another-react-lightbox";

type GallerySlide = SlideImage & {
  imageSet?: RemoteImageSet | null;
  description?: string;
};

const parseDimension = (value?: number | string): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

export default function GallerySlider({ images }: GallerySliderProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const slides = useMemo<GallerySlide[]>(
    () =>
      images.map((image) => {
        const imageSet = image.imageSet;
        const lightboxImg = imageSet?.lightbox?.img ?? imageSet?.img;
        const slide: GallerySlide = {
          type: "image",
          src: lightboxImg?.src ?? image.url,
          alt: lightboxImg?.alt ?? image.caption ?? "Gallery image",
          width: parseDimension(lightboxImg?.width),
          height: parseDimension(lightboxImg?.height),
          imageSet,
          description: image.caption ?? undefined,
        };

        return slide;
      }),
    [images]
  );

  const [spaceBetween, setSpaceBetween] = useState(32);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1024) {
        setSpaceBetween(16);
      } else {
        setSpaceBetween(32);
      }
    };

    handleResize(); // 获取初始值

    // 添加防抖的 resize 监听器
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .swiper-slide {
            width: auto !important;
          }
        `
      }} />
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView="auto"
        centeredSlides={false}
        mousewheel
        modules={[Keyboard, Mousewheel]}
        keyboard={{
          enabled: true,
        }}
      >
        {images.map((item, imageIndex) => {
          const imageSet = item.imageSet;

          return (
            <SwiperSlide key={item.url}>
              {({ isActive }) => (
                <button
                  type="button"
                  className="block focus:outline-none"
                  onClick={() => {
                    setIndex(imageIndex);
                    setOpen(true);
                  }}
                  aria-label={item.caption ?? "Open gallery image"}
                >
                  <picture>
                    {imageSet ? (
                      <>
                        {imageSet.sources.map((source, index) => (
                          <source
                            key={`${source.type}-${index}`}
                            type={source.type}
                            srcSet={source.srcSet}
                            sizes={imageSet.img.sizes}
                          />
                        ))}
                        <img
                          {...imageSet.img}
                          alt={imageSet.img.alt}
                          className={`bg-gray-50 object-contain h-[480px] w-auto max-w-full ${
                            !isActive ? "grayscale" : ""
                          }`}
                        />
                      </>
                    ) : (
                      <>
                        <source srcSet={`${item.url}?h=640&f=avif`} type="image/avif" />
                        <source srcSet={`${item.url}?h=640&f=webp`} type="image/webp" />
                        <img
                          src={`${item.url}?h=640`}
                          alt={item.caption || "Gallery image"}
                          className={`bg-gray-50 object-contain h-[480px] w-auto max-w-full ${
                            !isActive ? "grayscale" : ""
                          }`}
                        />
                      </>
                    )}
                  </picture>
                </button>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Lightbox
        open={open}
        plugins={[Captions, Counter]}
        index={index}
        close={() => setOpen(false)}
        slides={slides}
        render={{
          slide: ({ slide }) => {
            const gallerySlide = slide as GallerySlide;
            const imageSet = gallerySlide.imageSet;
            if (!imageSet) {
              return undefined;
            }

            const pictureSources = imageSet.lightbox?.sources ?? imageSet.sources;
            const { alt: imageAlt, sizes: imageSizes, ...imgRest } = imageSet.lightbox?.img ?? imageSet.img;
            const resolvedAlt = imageAlt ?? gallerySlide.alt ?? "Gallery image";
            const resolvedSizes = imageSizes ?? "100vw";

            return (
              <div
                className="yarl__slide_image"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
              >
                <picture className="block max-h-full max-w-full">
                  {pictureSources.map((source, sourceIndex) => (
                    <source
                      key={`${source.type}-${sourceIndex}`}
                      type={source.type}
                      srcSet={source.srcSet}
                      sizes={resolvedSizes}
                    />
                  ))}
                  <img
                    {...imgRest}
                    sizes={resolvedSizes}
                    alt={resolvedAlt}
                    className="yarl__slide_image"
                    style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
                  />
                </picture>
              </div>
            );
          },
          iconPrev: () => <ArrowLeft />,
          iconNext: () => <ArrowRight />,
          iconClose: () => <Close />,
        }}
        styles={{
          container: {
            background: "white",
          },
          root: {
            "--yarl__button_filter": "filter: none",
            "--yarl__counter_color": "black",
            "--yarl__counter_filter": "filter: none",
          },
          captionsDescriptionContainer: { background: "white" },
          captionsDescription: { color: "black", textAlign: "center" },
        }}
        counter={{ container: { style: { top: 0 } } }}
      />
    </div>
  );
}

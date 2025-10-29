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
import type { GallerySliderProps } from "@/types";
import type { SlideImage } from "yet-another-react-lightbox";

type GallerySlide = SlideImage & {
  description?: string;
};

const buildSanityImageUrl = (url: string, params: Record<string, string | number>) => {
  const search = new URLSearchParams({ auto: "format" });
  Object.entries(params).forEach(([key, value]) => {
    search.set(key, String(value));
  });
  return `${url}?${search.toString()}`;
};

const buildSanityImageSrcSet = (url: string, params: Record<string, string | number>, baseWidth?: number) => [
  {
    src: buildSanityImageUrl(url, { ...params, dpr: 1 }),
    width: baseWidth,
  },
  {
    src: buildSanityImageUrl(url, { ...params, dpr: 2 }),
    width: baseWidth !== undefined ? baseWidth * 2 : undefined,
  },
];

export default function GallerySlider({ images }: GallerySliderProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const slides = useMemo<GallerySlide[]>(
    () =>
      images.map((image) => ({
        type: "image",
        src: buildSanityImageUrl(image.url, { w: 1600, fit: "max" }),
        srcSet: buildSanityImageSrcSet(image.url, { w: 1600, fit: "max" }, 1600),
        alt: image.caption ?? "Gallery image",
        description: image.caption ?? undefined,
      })),
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
        {images.map((item, imageIndex) => (
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
                <img
                  src={buildSanityImageUrl(item.url, { h: 640, fit: "max" })}
                  srcSet={[
                    `${buildSanityImageUrl(item.url, { h: 640, fit: "max", dpr: 1 })} 1x`,
                    `${buildSanityImageUrl(item.url, { h: 640, fit: "max", dpr: 2 })} 2x`,
                  ].join(", ")}
                  alt={item.caption || "Gallery image"}
                  className={`bg-gray-50 object-contain h-[480px] w-auto max-w-full ${
                    !isActive ? "grayscale" : ""
                  }`}
                />
              </button>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <Lightbox
        open={open}
        plugins={[Captions, Counter]}
        index={index}
        close={() => setOpen(false)}
        slides={slides}
        render={{
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

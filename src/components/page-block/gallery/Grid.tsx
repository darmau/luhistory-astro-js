import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import ArrowLeft from "../../react-icon/ArrowLeft.tsx";
import ArrowRight from "../../react-icon/ArrowRight.tsx";
import Close from "../../react-icon/Close.tsx";
import type { GalleryGridProps } from "@/types";
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

export default function GalleryGrid({ title, images }: GalleryGridProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const slides = React.useMemo<GallerySlide[]>(
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

  return (
    <div>
      <hgroup className="md:mb-6 flex justify-between items-baseline max-w-3xl">
        <h2 className="font-title font-bold text-neutral-900 text-3xl md:text-5xl">
          {title}
        </h2>
        <small className="font-sans text-base text-neutral-900 opacity-50">
          {images.length} photos
        </small>
      </hgroup>

      <div className="grid grid-cols-3 gap-4 lg:gap-8">
        {images.slice(0, 6).map((image, imageIndex) => (
          <button
            type="button"
            key={image.url}
            className="group block focus:outline-none"
            onClick={() => {
              setIndex(imageIndex);
              setOpen(true);
            }}
            aria-label={image.caption ?? "Open gallery image"}
          >
            <div className="aspect-square w-full">
              <img
                className="object-cover w-full h-full cursor-pointer group-focus-visible:ring-2 group-focus-visible:ring-neutral-900"
                src={buildSanityImageUrl(image.url, { w: 480, h: 480, fit: "crop" })}
                srcSet={[
                  `${buildSanityImageUrl(image.url, { w: 480, h: 480, fit: "crop", dpr: 1 })} 1x`,
                  `${buildSanityImageUrl(image.url, { w: 480, h: 480, fit: "crop", dpr: 2 })} 2x`,
                ].join(", ")}
                alt={image.caption || "Gallery image"}
                width="192"
                height="192"
              />
            </div>
          </button>
        ))}
      </div>

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

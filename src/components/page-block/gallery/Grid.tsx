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

export default function GalleryGrid({ title, images }: GalleryGridProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const slides = React.useMemo(
    () => images.map((image) => ({ src: image.url, description: image.caption })),
    [images]
  );

  return (
    <div>
      <hgroup className="md:mb-6 flex justify-between items-baseline max-w-3xl">
        <h2 className="font-serif font-bold text-neutral-900 text-3xl md:text-5xl">
          {title}
        </h2>
        <small className="font-sans text-base text-neutral-900 opacity-50">
          {images.length} photos
        </small>
      </hgroup>

      <div className="grid grid-cols-3 gap-4 lg:gap-8">
        {images.slice(0, 6).map((image, imageIndex) => {
          const imageSet = image.imageSet;

          return (
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
              {imageSet ? (
                <picture className="block h-full w-full">
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
                    className="object-cover w-full h-full cursor-pointer group-focus-visible:ring-2 group-focus-visible:ring-neutral-900"
                  />
                </picture>
              ) : (
                <img
                  className="object-cover w-full h-full cursor-pointer group-focus-visible:ring-2 group-focus-visible:ring-neutral-900"
                  src={`${image.url}?h=480`}
                  alt={image.caption || "Gallery image"}
                  width="192"
                  height="192"
                />
              )}
              </div>
            </button>
          );
        })}
      </div>

      <Lightbox
        open={open}
        plugins={[Captions, Counter]}
        index={index}
        close={() => setOpen(false)}
        slides={slides}
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
        render={{
          iconPrev: () => <ArrowLeft />,
          iconNext: () => <ArrowRight />,
          iconClose: () => <Close />,
        }}
        counter={{ container: { style: { top: 0 } } }}
      />
    </div>
  );
}

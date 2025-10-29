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
import type { GalleryGridProps, RemoteImageSet } from "@/types";
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

export default function GalleryGrid({ title, images }: GalleryGridProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const slides = React.useMemo<GallerySlide[]>(
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
          description: image.caption ?? undefined,
          imageSet,
        };

        return slide;
      }),
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

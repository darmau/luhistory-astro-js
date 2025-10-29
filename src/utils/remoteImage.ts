import { getImage } from "astro:assets";
import type { RemoteImageSet } from "@/types";

type RemoteImageFormat = {
  format: string;
  type: string;
};

export type BuildRemoteImageOptions = {
  src: string;
  alt: string;
  widths: number[];
  sizes: string;
  formats?: RemoteImageFormat[];
  fallbackFormat?: string;
  inferSize?: boolean;
};

const defaultFormats: RemoteImageFormat[] = [
  { format: "avif", type: "image/avif" },
  { format: "webp", type: "image/webp" },
];

const DEFAULT_FALLBACK_FORMAT = "jpeg";

const parseDimension = (value?: number | string): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

export async function buildRemoteImageSet({
  src,
  alt,
  widths,
  sizes,
  formats = defaultFormats,
  fallbackFormat = DEFAULT_FALLBACK_FORMAT,
  inferSize = true,
}: BuildRemoteImageOptions): Promise<RemoteImageSet> {
  const optimizedImages = await Promise.all(
    formats.map(async ({ format, type }) => {
      const image = await getImage({ src, widths, format, inferSize });
      return {
        type,
        srcSet: image.srcSet.attribute,
      };
    })
  );

  const fallback = await getImage({
    src,
    widths,
    format: fallbackFormat,
    inferSize,
  });

  const fallbackSrcSet = fallback.srcSet.values.length > 0 ? fallback.srcSet.attribute : undefined;
  const {
    class: _ignoredClass,
    width: attrWidth,
    height: attrHeight,
    ...fallbackAttributes
  } = fallback.attributes;
  void _ignoredClass;

  const fallbackWidth = parseDimension(attrWidth);
  const fallbackHeight = parseDimension(attrHeight);

  const baseImageAttributes = {
    ...fallbackAttributes,
    ...(fallbackWidth !== undefined ? { width: fallbackWidth } : {}),
    ...(fallbackHeight !== undefined ? { height: fallbackHeight } : {}),
    src: fallback.src,
    ...(fallbackSrcSet ? { srcSet: fallbackSrcSet } : {}),
    alt,
  } satisfies RemoteImageSet["img"];

  const pictureSources = optimizedImages.map((image) => ({
    type: image.type,
    srcSet: image.srcSet,
  }));

  const sliderImg: RemoteImageSet["img"] = {
    ...baseImageAttributes,
    sizes,
  };

  const lightboxImg: RemoteImageSet["img"] = {
    ...baseImageAttributes,
    sizes: "100vw",
    loading: "eager",
  };

  return {
    sources: pictureSources,
    img: sliderImg,
    lightbox: {
      sources: pictureSources.map((source) => ({ ...source })),
      img: lightboxImg,
    },
  } satisfies RemoteImageSet;
}

export async function buildRemoteImageSetOrNull(options: BuildRemoteImageOptions): Promise<RemoteImageSet | null> {
  try {
    return await buildRemoteImageSet(options);
  } catch {
    return null;
  }
}

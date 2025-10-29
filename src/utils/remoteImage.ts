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

type RetryOptions = {
  attempts?: number;
  baseDelay?: number;
  multiplier?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    attempts = 3,
    baseDelay = 200,
    multiplier = 2,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        break;
      }

      const delay = baseDelay * multiplier ** (attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

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
      const image = await withRetry(() => getImage({ src, widths, format, inferSize }));
      return {
        type,
        srcSet: image.srcSet.attribute,
      };
    })
  );

  const fallback = await withRetry(() =>
    getImage({
      src,
      widths,
      format: fallbackFormat,
      inferSize,
    }),
  );

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
  } catch (error) {
    console.error("Failed to transform remote image", {
      src: options.src,
      widths: options.widths,
      sizes: options.sizes,
      alt: options.alt,
      error,
    });
    return null;
  }
}

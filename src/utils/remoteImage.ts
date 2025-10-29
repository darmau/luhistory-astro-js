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

export async function buildRemoteImageSet({
  src,
  alt,
  widths,
  sizes,
  formats = defaultFormats,
  fallbackFormat = DEFAULT_FALLBACK_FORMAT,
  inferSize = true,
}: BuildRemoteImageOptions): Promise<RemoteImageSet> {
  const optimizedSources = await Promise.all(
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
  const { class: _ignoredClass, ...fallbackAttributes } = fallback.attributes;
  void _ignoredClass;

  return {
    sources: optimizedSources,
    img: {
      ...fallbackAttributes,
      src: fallback.src,
      ...(fallbackSrcSet ? { srcSet: fallbackSrcSet } : {}),
      sizes,
      alt,
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

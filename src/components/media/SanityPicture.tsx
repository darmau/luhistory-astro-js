import * as React from "react";

const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280] as const;
const DEFAULT_FORMATS = [
  { format: "avif", type: "image/avif" },
  { format: "webp", type: "image/webp" },
] as const;
const FALLBACK_FORMAT = { format: "jpg", type: "image/jpeg" } as const;

type SanityPictureProps = {
  src: string;
  alt: string;
  widths?: number[];
  aspectRatio?: number;
  quality?: number;
  fit?: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
} & Omit<React.ComponentPropsWithoutRef<"picture">, "children" | "className">;

const clampWidths = (widths: number[] | undefined) => {
  if (!widths || widths.length === 0) {
    return [...DEFAULT_WIDTHS];
  }

  const unique = new Set(widths.filter((value) => Number.isFinite(value) && value > 0));
  return Array.from(unique).sort((a, b) => a - b);
};

const buildSanityUrl = (
  src: string,
  params: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: string;
    format?: string;
  }
) => {
  try {
    const url = new URL(src);

    if (params.width) {
      url.searchParams.set("w", Math.round(params.width).toString());
    }

    if (params.height) {
      url.searchParams.set("h", Math.round(params.height).toString());
    }

    if (params.quality) {
      url.searchParams.set("q", Math.min(100, Math.max(30, params.quality)).toString());
    }

    if (params.fit) {
      url.searchParams.set("fit", params.fit);
    }

    if (params.format) {
      url.searchParams.set("fm", params.format);
    }

    if (!url.searchParams.has("auto")) {
      url.searchParams.set("auto", "format");
    }

    return url.toString();
  } catch (error) {
    console.warn("Failed to build Sanity image URL", error);
    return src;
  }
};

export default function SanityPicture({
  src,
  alt,
  widths,
  aspectRatio,
  quality = 80,
  fit = "crop",
  className,
  imgClassName,
  imgStyle,
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  ...pictureProps
}: SanityPictureProps) {
  const normalizedWidths = React.useMemo(() => clampWidths(widths), [widths]);

  const buildHeight = React.useCallback(
    (width: number | undefined) => {
      if (!aspectRatio || !width) {
        return undefined;
      }

      return Math.round(width / aspectRatio);
    },
    [aspectRatio]
  );

  const buildSrcSet = React.useCallback(
    (format: string) =>
      normalizedWidths
        .map((width) => {
          const url = buildSanityUrl(src, {
            width,
            height: buildHeight(width),
            quality,
            fit,
            format,
          });

          return `${url} ${width}w`;
        })
        .join(", "),
    [buildHeight, fit, normalizedWidths, quality, src]
  );

  const fallbackWidth = normalizedWidths[normalizedWidths.length - 1];
  const fallbackSrc = React.useMemo(
    () =>
      buildSanityUrl(src, {
        width: fallbackWidth,
        height: buildHeight(fallbackWidth),
        quality,
        fit,
        format: FALLBACK_FORMAT.format,
      }),
    [buildHeight, fallbackWidth, fit, quality, src]
  );

  const fallbackSrcSet = React.useMemo(
    () => buildSrcSet(FALLBACK_FORMAT.format),
    [buildSrcSet]
  );

  return (
    <picture className={className} {...pictureProps}>
      {DEFAULT_FORMATS.map(({ format, type }) => (
        <source key={format} type={type} srcSet={buildSrcSet(format)} sizes={sizes} />
      ))}
      <img
        src={fallbackSrc}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={imgClassName}
        style={imgStyle}
      />
    </picture>
  );
}

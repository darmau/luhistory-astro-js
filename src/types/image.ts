/**
 * Shared remote image metadata types
 * These types describe the image sources and attributes generated via astro:assets
 * and are consumed by both Astro and React components across the project.
 */

export type RemoteImageSource = {
  type: string;
  srcSet: string;
};

export type RemoteImageAttributes = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  loading?: "lazy" | "eager";
  decoding?: "sync" | "async" | "auto";
  [attribute: string]: string | number | undefined;
};

export type RemoteImageSet = {
  sources: RemoteImageSource[];
  img: RemoteImageAttributes;
  lightbox?: {
    sources: RemoteImageSource[];
    img: RemoteImageAttributes;
  };
};

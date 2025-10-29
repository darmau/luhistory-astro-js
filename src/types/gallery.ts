/**
 * Gallery-related type definitions
 * Consolidated from multiple components to ensure consistency
 */

import type { RemoteImageSet } from "./image";

export type GalleryImage = {
  url: string;
  caption?: string | null;
  imageSet?: RemoteImageSet | null;
};

export type GalleryGridProps = {
  title: string;
  images: GalleryImage[];
};

export type GallerySliderProps = {
  images: GalleryImage[];
};

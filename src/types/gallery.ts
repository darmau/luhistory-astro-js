/**
 * Gallery-related type definitions
 * Consolidated from multiple components to ensure consistency
 */

export type GalleryImage = {
  url: string;
  caption?: string | null;
};

export type GalleryGridProps = {
  title: string;
  images: GalleryImage[];
};

export type GallerySliderProps = {
  images: GalleryImage[];
};

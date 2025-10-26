/**
 * Component prop type definitions
 * Centralized types for all React and Astro component props
 */

import type { Page } from "astro";
import type { GalleryImage } from "./gallery";
import type { PortableBlock } from "./blocks";
import type { PortableTextBlock } from "@portabletext/types";

// Slider component props
export type CaseItem = {
  title: string;
  slug: string;
  cover?: string | null;
};

export type CaseSliderProps = {
  cases: CaseItem[];
};

export type ExhibitionItem = {
  title: string;
  slug: string;
  year: string;
  city: string;
  cover?: {
    url: string;
    caption?: string | null;
  } | null;
};

export type ExhibitionSliderProps = {
  exhibitions: ExhibitionItem[];
};

export type LatestNewsItem = {
  title: string;
  subtitle?: string | null;
  slug: string;
  cover?: string | null;
};

export type LatestNewsSliderProps = {
  news: LatestNewsItem[];
};

// Image preview component
export type HoverImagePreviewProps = {
  type: string;
  slug: string;
  title: string;
  location: string;
  imgUrl: string;
};

// Page components
export type PageTitleProps = {
  title: string;
  subtitle?: string;
  bgWhite?: boolean;
  remoteImg?: string;
  localImg?: string;
};

export type PaginationProps = {
  page: Page<unknown>;
  anchor?: string;
  paddingClass?: string;
};

// Timeline component
export type TimelineProps = {
  title?: string;
  records?: Array<{
    startDate: string;
    endDate: {
      present?: boolean;
      endDate?: string;
    } | null;
    details: PortableTextBlock | PortableTextBlock[];
  }>;
};

// Gallery component (from page-block/Gallery.astro)
export type GalleryProps = {
  gallery?: string;
  title?: string;
  images?: GalleryImage[];
};

// TextBlock component
export type TextBlockProps = {
  overview?: PortableBlock[];
  title?: string;
};

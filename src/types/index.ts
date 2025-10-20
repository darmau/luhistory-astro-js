/**
 * Central type definitions export
 * Import types from here for convenience: import { GalleryImage, IconProps } from '@/types'
 */

// Gallery types
export type {
  GalleryImage,
  GalleryGridProps,
  GallerySliderProps,
} from "./gallery";

// UI types
export type { IconProps, ImageSize, CursorPosition } from "./ui";

// Content block types
export type {
  BaseBlock,
  GalleryBlock,
  ImageBlock,
  PortableBlock,
} from "./blocks";

// Teaching and timeline types
export type {
  TimelineEndDate,
  TimelineRecord,
  TeachingLink,
  TeachingLinkEntry,
  TeachingAsset,
  TeachingEntry,
} from "./teaching";

// Component prop types
export type {
  CaseItem,
  CaseSliderProps,
  ExhibitionItem,
  ExhibitionSliderProps,
  LatestNewsItem,
  LatestNewsSliderProps,
  HoverImagePreviewProps,
  PageTitleProps,
  PaginationProps,
  TimelineProps,
  GalleryProps,
  TextBlockProps,
} from "./components";

// Sanity CMS data types
export type {
  ExhibitionDetail,
  ExhibitionSummary,
  ArticleDetail,
  ArticleSummary,
  BookDetail,
  BookSummary,
  CaseStudy,
  PageBlockItem,
} from "./sanity";

// Link types
export type {
  ExternalLink,
  RelatedBook,
  RelatedArticle,
  RelatedExhibition,
  LinkItem,
  NonNullableLinkItem,
} from "./links";

// Category types
export type { ArchiveCategory } from "./category";

/**
 * Content block type definitions
 * Used for Sanity CMS portable text and custom content blocks
 */

import type { PortableTextBlock } from "@portabletext/types";

export type BaseBlock = {
  _type: string;
  [key: string]: unknown;
};

export type GalleryBlock = {
  _type: "gallery";
  type: string;
  title?: string;
  pictures?: Array<{ url: string; caption?: string | null }>;
};

export type ImageBlock = {
  _type: "imageBlock";
  type: string;
  url: string;
  caption?: string | null;
};

export type PortableBlock = PortableTextBlock | GalleryBlock | ImageBlock | BaseBlock;

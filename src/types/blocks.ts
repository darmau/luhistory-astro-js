/**
 * Content block type definitions
 * Used for Sanity CMS portable text and custom content blocks
 */

export type BaseBlock = {
  _type?: string;
  [key: string]: unknown;
};

export type GalleryBlock = BaseBlock & {
  _type: "gallery";
  type: string;
  title?: string;
  pictures?: Array<{ url: string; caption?: string | null }>;
};

export type ImageBlock = BaseBlock & {
  _type: "imageBlock";
  type: string;
  url: string;
  caption?: string | null;
};

export type PortableBlock = GalleryBlock | ImageBlock | BaseBlock;

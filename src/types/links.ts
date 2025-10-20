/**
 * Link type definitions
 * Types for internal and external links, related content
 */

export type ExternalLink = {
  url: string;
  title: string;
  tag?: string | null;
};

export type RelatedBook = {
  title: string;
  slug: string;
  publishDate: string;
  cover?: string | null;
};

export type RelatedArticle = {
  title: string;
  slug: string;
  category?: string | null;
};

export type RelatedExhibition = {
  title: string;
  slug: string;
  year?: string | null;
};

export type LinkItem = {
  type: string;
  title: string;
  slug: string;
};

export type NonNullableLinkItem = LinkItem | {
  title: string;
  type: "file";
  url: string;
};

/**
 * Article-related type definitions
 * Used for collection pages and article listings
 */

export type ArticleItem = {
  title: string;
  publishDate: string;
  category: string;
  isExternalLink: boolean;
} & (
  | {
      isExternalLink: true;
      externalUrl: string;
      slug: null;
    }
  | {
      isExternalLink: false;
      externalUrl: null;
      slug: string;
    }
);

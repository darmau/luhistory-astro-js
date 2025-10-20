/**
 * Sanity CMS data type definitions
 * Types for content fetched from Sanity headless CMS
 */

export type ExhibitionDetail = {
  title: string;
  slug: string;
  subtitle?: string | null;
  start: string;
  end: string;
  cover?: string | null;
  curator?: string | null;
  city?: string | null;
  place?: string | null;
  overview: unknown;
  blocks?: Array<Record<string, unknown>>;
};

export type ExhibitionSummary = {
  title: string;
  slug: string;
  year: string;
  city: string;
  cover?: {
    url: string;
    caption?: string | null;
  } | null;
};

export type ArticleDetail = {
  title: string;
  publishDate: string;
  author?: string | null;
  slug: string;
  body: unknown;
};

export type ArticleSummary = {
  title: string;
  subtitle?: string | null;
  slug: string;
  cover?: string | null;
};

export type BookDetail = {
  title: string;
  slug: string;
  publishDate: string;
  cover?: string | null;
  isbn?: string | null;
  publisher?: string | null;
  pages?: number | null;
  description?: unknown;
};

export type BookSummary = {
  title: string;
  slug: string;
  publishDate: string;
  cover?: string | null;
};

export type CaseStudy = {
  title: string;
  slug: string;
  cover?: string | null;
};

export type PageBlockItem = Record<string, unknown>;

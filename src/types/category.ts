/**
 * Category type definitions
 * Types for content categories used across the site
 */

/**
 * Archive category definition
 * Used for categorizing collection articles (interviews, conversations, etc.)
 * Contains both display name and URL-friendly slug
 */
export type ArchiveCategory = {
  /** Display name of the category */
  name: string;
  /** URL-friendly slug for routing */
  slug: string;
};


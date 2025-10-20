/**
 * Teaching and timeline-related type definitions
 * Used for education experience, teaching materials, and timeline components
 */

import type { PortableTextBlock } from "@portabletext/types";

export type TimelineEndDate = {
  present?: boolean;
  endDate?: string;
} | null;

export type TimelineRecord = {
  startDate: string;
  endDate: TimelineEndDate;
  details: PortableTextBlock | PortableTextBlock[];
};

export type TeachingLink = {
  type: string;
  title: string;
  slug: string;
};

export type TeachingLinkEntry = TeachingLink | null;

export type TeachingAsset = {
  title: string;
  type: "file";
  url: string;
};

export type TeachingEntry = {
  experience?: {
    type: "timeline";
    records: TimelineRecord[];
  };
  overview?: unknown[];
  links: TeachingLinkEntry[];
  assets: TeachingAsset[];
};

import type { Page } from 'astro';

export type PaginationSegment = number | 'ellipsis';

export interface PaginationComputation {
  shouldRender: boolean;
  segments: PaginationSegment[];
  pageHref: Record<number, string>;
  prevHref?: string;
  nextHref?: string;
}

export interface PaginationOptions {
  anchor?: string;
  currentPathname?: string | null;
}

/**
 * Compute pagination helpers derived from the Astro page object so they can be
 * unit-tested without rendering the component.
 */
export function computePagination(
  page: Page<unknown>,
  options: PaginationOptions = {},
): PaginationComputation {
  const totalPages = page.lastPage ?? 0;
  const currentPage = page.currentPage ?? 1;
  const hasPrev = Boolean(page.url?.prev);
  const hasNext = Boolean(page.url?.next);
  const shouldRender = totalPages > 1 || hasPrev || hasNext;

  const anchor = options.anchor;
  const anchorFragment = anchor
    ? anchor.startsWith('#')
      ? anchor
      : `#${anchor}`
    : '';

  const currentPathname =
    options.currentPathname ??
    page.url?.current ??
    '/';
  const trailingSlash = currentPathname.endsWith('/');
  const pathWithoutTrailingSlash = trailingSlash ? currentPathname.slice(0, -1) : currentPathname;
  const basePath = pathWithoutTrailingSlash.replace(/\/\d+$/, '');
  const normalizedBasePath =
    basePath !== '/' && basePath.endsWith('/')
      ? basePath.slice(0, -1)
      : basePath;

  const buildLink = (pageNumber: number) => {
    const base = normalizedBasePath.endsWith('/')
      ? normalizedBasePath.slice(0, -1)
      : normalizedBasePath;
    const prefix = base === '' ? '' : base === '/' ? '' : base;
    let path = `${prefix}/${pageNumber}`;
    if (!path.startsWith('/')) {
      path = `/${path.replace(/^\/+/, '')}`;
    }
    const withSlash = trailingSlash ? `${path}/` : path;
    return `${withSlash}${anchorFragment}`;
  };

  const pageNumbers = new Set<number>();
  if (totalPages > 0) {
    pageNumbers.add(1);
    pageNumbers.add(totalPages);
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
      if (index >= 1 && index <= totalPages) {
        pageNumbers.add(index);
      }
    }
  }

  const sortedNumbers = Array.from(pageNumbers).sort((a, b) => a - b);
  const segments: PaginationSegment[] = [];
  for (let index = 0; index < sortedNumbers.length; index++) {
    const value = sortedNumbers[index];
    if (index > 0 && value - sortedNumbers[index - 1] > 1) {
      segments.push('ellipsis');
    }
    segments.push(value);
  }

  const pageHrefEntries = sortedNumbers.map((pageNumber) => [pageNumber, buildLink(pageNumber)] as const);
  const pageHref = Object.fromEntries(pageHrefEntries) as Record<number, string>;

  const prevHref = hasPrev && page.url?.prev ? `${page.url.prev}${anchorFragment}` : undefined;
  const nextHref = hasNext && page.url?.next ? `${page.url.next}${anchorFragment}` : undefined;

  return {
    shouldRender,
    segments,
    pageHref,
    prevHref,
    nextHref,
  };
}

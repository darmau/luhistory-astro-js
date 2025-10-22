import type { Page } from 'astro';
import { describe, expect, it } from 'vitest';
import { computePagination } from '../../functions/pagination';

type PageOverrides = {
  currentPage?: number;
  lastPage?: number;
  url?: {
    current?: string;
    next?: string;
    prev?: string;
  };
  start?: number;
  end?: number;
  total?: number;
  size?: number;
  data?: unknown[];
};

const createPage = (overrides: PageOverrides = {}): Page<unknown> => {
  const base = {
    data: [],
    start: 1,
    end: 1,
    total: 1,
    currentPage: 1,
    lastPage: 1,
    size: 20,
    url: {
      current: '/collection/all/1/',
      next: undefined,
      prev: undefined,
    },
  };

  return {
    ...base,
    ...overrides,
    url: {
      ...base.url,
      ...(overrides.url ?? {}),
    },
  } as unknown as Page<unknown>;
};

describe('Pagination', () => {
  it('does not request rendering when only one page is available', () => {
    const page = createPage();
    const model = computePagination(page, { currentPathname: page.url.current });

    expect(model.shouldRender).toBe(false);
  });

  it('computes the expected page links and ellipses around the current page', () => {
    const page = createPage({
      currentPage: 5,
      lastPage: 10,
      url: {
        current: '/collection/all/5/',
        prev: '/collection/all/4/',
        next: '/collection/all/6/',
      },
    });
    const model = computePagination(page, { currentPathname: page.url.current });

    expect(model.shouldRender).toBe(true);
    expect(model.segments).toEqual([1, 'ellipsis', 3, 4, 5, 6, 7, 'ellipsis', 10]);
    expect(model.pageHref[4]).toBe('/collection/all/4/');
    expect(model.pageHref[6]).toBe('/collection/all/6/');
    expect(model.prevHref).toBe('/collection/all/4/');
    expect(model.nextHref).toBe('/collection/all/6/');
  });

  it('appends anchor fragments to generated and navigation links', () => {
    const page = createPage({
      currentPage: 2,
      lastPage: 3,
      url: {
        current: '/collection/category/example/2',
        prev: '/collection/category/example/1',
        next: '/collection/category/example/3',
      },
    });
    const model = computePagination(page, {
      anchor: 'gallery',
      currentPathname: page.url.current,
    });

    expect(model.pageHref[1]).toBe('/collection/category/example/1#gallery');
    expect(model.pageHref[2]).toBe('/collection/category/example/2#gallery');
    expect(model.pageHref[3]).toBe('/collection/category/example/3#gallery');
    expect(model.prevHref).toBe('/collection/category/example/1#gallery');
    expect(model.nextHref).toBe('/collection/category/example/3#gallery');
  });
});

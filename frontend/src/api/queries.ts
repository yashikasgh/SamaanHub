import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { catalogApi } from './client';

export const queryKeys = {
  config: ['config'] as const,
  categories: ['categories'] as const,
  products: (filters: any) => ['products', filters] as const,
  product: (slug: string) => ['product', slug] as const,
  relatedProducts: (slug: string) => ['relatedProducts', slug] as const,
  productsByIds: (ids: string[]) => ['productsByIds', ids] as const,
};

export function useStoreConfig() {
  return useQuery({
    queryKey: queryKeys.config,
    queryFn: catalogApi.getConfig,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: catalogApi.getCategories,
    staleTime: 10 * 60 * 1000,
  });
}

export function useProducts(filters: { category?: string; q?: string; sort?: string }) {
  return useInfiniteQuery({
    queryKey: queryKeys.products(filters),
    queryFn: ({ pageParam }) => catalogApi.getProducts({ ...filters, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_cursor : undefined,
    staleTime: 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => catalogApi.getProduct(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: queryKeys.relatedProducts(slug),
    queryFn: () => catalogApi.getRelatedProducts(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}

export function useProductsByIds(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.productsByIds(ids),
    queryFn: () => catalogApi.getProductsByIds(ids),
    enabled: ids.length > 0,
    staleTime: 60 * 1000,
  });
}

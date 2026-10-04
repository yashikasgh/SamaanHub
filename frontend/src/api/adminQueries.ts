import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, getAdminToken } from './adminClient';

export const adminKeys = {
  stats: ['admin', 'stats'] as const,
  settings: ['admin', 'settings'] as const,
  runs: ['admin', 'runs'] as const,
  products: (page: number, q: string) => ['admin', 'products', page, q] as const,
  product: (id: string) => ['admin', 'product', id] as const,
  categories: ['admin', 'categories'] as const,
};

export function useAdminAuth() {
  const token = getAdminToken();
  return !!token;
}

export function useAdminStats() {
  return useQuery({ queryKey: adminKeys.stats, queryFn: adminApi.getStats, refetchInterval: 10000 });
}

export function useAdminSettings() {
  return useQuery({ queryKey: adminKeys.settings, queryFn: adminApi.getSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.settings })
  });
}

export function useAdminRuns() {
  return useQuery({ queryKey: adminKeys.runs, queryFn: adminApi.getSyncRuns, refetchInterval: 5000 });
}

export function useAdminProducts(page: number, q: string) {
  return useQuery({ queryKey: adminKeys.products(page, q), queryFn: () => adminApi.getProducts(page, q) });
}

export function useAdminProduct(id: string) {
  return useQuery({ queryKey: adminKeys.product(id), queryFn: () => adminApi.getProduct(id) });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => adminApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: adminKeys.product(variables.id) });
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });
}

export function useAdminCategories() {
  return useQuery({ queryKey: adminKeys.categories, queryFn: adminApi.getCategories });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => adminApi.updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.categories })
  });
}

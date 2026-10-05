import { StoreConfig, Category, PaginatedProducts, ProductDetail, ProductCard } from './types';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!configuredApiBaseUrl && !import.meta.env.DEV) {
  throw new Error('VITE_API_BASE_URL must be set for production builds.');
}

const API_BASE_URL = (configuredApiBaseUrl || 'http://localhost:8000/api').replace(/\/$/, '');

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = 'An error occurred';
    try {
      const errBody = await response.json();
      message = errBody.detail || errBody.error?.message || message;
    } catch {
      // Ignored
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export const catalogApi = {
  getConfig: () => fetchJson<StoreConfig>('/catalog/config'),
  
  getCategories: () => fetchJson<{ items: Category[] }>('/catalog/categories').then(res => res.items),
  
  getProducts: (params?: { category?: string; q?: string; cursor?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.q) query.set('q', params.q);
    if (params?.cursor) query.set('cursor', params.cursor);
    if (params?.sort) query.set('sort', params.sort);
    
    const qs = query.toString();
    return fetchJson<PaginatedProducts>(`/catalog/products${qs ? `?${qs}` : ''}`);
  },
  
  getProduct: (slug: string) => fetchJson<ProductDetail>(`/catalog/products/${slug}`),
  
  getRelatedProducts: (slug: string) => fetchJson<{ items: ProductCard[] }>(`/catalog/products/${slug}/related`).then(res => res.items),
  
  getProductsByIds: (ids: string[]) => fetchJson<{ items: ProductCard[] }>('/catalog/products/by-ids', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  }).then(res => res.items),
};

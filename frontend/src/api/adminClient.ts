const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getAdminToken = () => sessionStorage.getItem('admin_token');
export const setAdminToken = (token: string) => sessionStorage.setItem('admin_token', token);
export const removeAdminToken = () => sessionStorage.removeItem('admin_token');

async function fetchAdmin<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...init?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...init, headers });

  if (!response.ok) {
    if (response.status === 401) {
      removeAdminToken();
      window.dispatchEvent(new Event('unauthorized'));
    }
    let message = 'An error occurred';
    try {
      const errBody = await response.json();
      message = errBody.detail || message;
    } catch {
      // Ignored
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export const adminApi = {
  login: (data: any) => fetchAdmin<{access_token: string}>('/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  getStats: () => fetchAdmin<any>('/admin/stats'),
  getSettings: () => fetchAdmin<Record<string, string>>('/admin/settings'),
  updateSettings: (settings: Record<string, string>) => fetchAdmin<{status: string}>('/admin/settings', { method: 'POST', body: JSON.stringify({ settings }) }),
  getSyncRuns: () => fetchAdmin<any>('/admin/sync/runs'),
  importSource: (source: string) => fetchAdmin<{run_id: string}>(`/admin/import/${source}`, { method: 'POST' }),
  syncSource: (source: string) => fetchAdmin<{run_id: string}>(`/admin/sync/${source}`, { method: 'POST' }),
  getProducts: (page: number, q: string = "") => fetchAdmin<any>(`/admin/products?page=${page}&q=${encodeURIComponent(q)}`),
  getProduct: (id: string) => fetchAdmin<any>(`/admin/products/${id}`),
  updateProduct: (id: string, data: any) => fetchAdmin<{status: string}>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getCategories: () => fetchAdmin<any>('/admin/categories'),
  updateCategory: (id: string, data: any) => fetchAdmin<{status: string}>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

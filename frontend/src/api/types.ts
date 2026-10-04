export interface StoreConfig {
  active_design: string;
  whatsapp_number: string;
  store_name: string;
  currency: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  slug: string;
  name: string;
  position: number;
  product_count: number;
}

export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  currency: string;
  availability: string;
  thumb: string | null;
}

export interface PaginatedProducts {
  items: ProductCard[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface ProductImage {
  url: string;
  alt: string | null;
}

export interface ProductVariant {
  title: string;
  sku: string | null;
  price: number | null;
  availability: string;
  stock_quantity: number;
  options: Record<string, string>;
}

export interface ProductCategory {
  slug: string;
  name: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  description_html: string;
  price: number | null;
  compare_at_price: number | null;
  currency: string;
  availability: string;
  stock_quantity: number;
  source_url: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: ProductCategory[];
}

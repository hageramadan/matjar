// services/productService.ts
const API_BASE_URL = 'https://alfareed.admin.t-carts.com';

export interface Product {
  id: number;
  type: string;
  is_active: boolean;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    subcategories: any[];
    image: string;
  };
  subcategory: any | null;
  brand: any | null;
  has_production_date: boolean;
  pricing: {
    price: number;
    has_discount: boolean;
    discount_type: string | null;
    discount_value: number | null;
    price_after_discount: number | null;
    final_price: number;
  };
  has_variants: boolean;
  variants: any | null;
  quantity: number;
  images: string[];
}

export interface ProductsResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    products: Product[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number | null;
      to: number | null;
      next_page: string | null;
      previous_page: string | null;
    };
  };
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface FilterOptions {
  type?: string;
  category?: string;
}

export async function fetchProducts(
  page: number = 1,
  sort: SortOption = 'newest',
  filters?: FilterOptions
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  
  // إضافة معاملات الترتيب
  switch (sort) {
    case 'newest':
      params.append('sort', 'created_at');
      params.append('order', 'desc');
      break;
    case 'price_asc':
      params.append('sort', 'final_price');
      params.append('order', 'asc');
      break;
    case 'price_desc':
      params.append('sort', 'final_price');
      params.append('order', 'desc');
      break;
  }
  
  // إضافة الفلاتر
  if (filters?.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }
  
  if (filters?.category && filters.category !== 'all') {
    params.append('category_id', filters.category);
  }
  
  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: ProductsResponse = await response.json();
  
  if (data.errNum !== 200 || !data.result) {
    throw new Error(data.message || 'Failed to fetch products');
  }
  
  return data;
}
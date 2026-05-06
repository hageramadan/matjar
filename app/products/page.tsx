"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ============= واجهات البيانات =============
interface Category {
  id: number;
  name: string;
  image?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  pricing: {
    price: number;
    has_discount: boolean;
    discount_type: string | null;
    discount_value: number | null;
    price_after_discount: number | null;
    final_price: number;
  };
  images: string[];
  category: Category;
  quantity: number;
}

interface ApiResponse {
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

const API_BASE_URL = 'https://alfareed.admin.t-carts.com/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // حالة التقسيم (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  // جلب المنتجات من API
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // فلترة المنتجات محلياً بعد جلبها
   

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/products?page=${currentPage}&per_page=${perPage}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.errNum === 200 && data.result === true) {
        setProducts(data.data.products);
        setFilteredProducts(data.data.products);
        setTotalPages(data.data.pagination.last_page);
        setTotalProducts(data.data.pagination.total);
        
        // استخراج الفئات الفريدة من المنتجات
        const uniqueCategories = Array.from(
          new Map(
            data.data.products.map(product => [product.category.id, product.category])
          ).values()
        );
        setCategories(uniqueCategories);
      } else {
        throw new Error(data.message || 'فشل في تحميل المنتجات');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتجات');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // الفلترة حسب البحث
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // الفلترة حسب الفئة
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        product => product.category.id.toString() === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProducts();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setShowFilters(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حساب نطاق المنتجات المعروضة
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalProducts);

  // عرض حالة التحميل
  if (isLoading && products.length === 0) {
    return <LoadingSkeleton />;
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <ErrorState error={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#23A6F0] to-[#195073]  py-3 md:py-6">
        <div className="container-custom text-center mt-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">جميع المنتجات</h1>
          <p className="text-white/90">
            اكتشف أحدث المنتجات والعروض الحصرية
          </p>
        </div>
      </div>

      <div className="container-custom py-4 md:py-8">
      

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredProducts.length > 0 ? (
              <span className="mb-5">عرض {filteredProducts.length} من {totalProducts} منتج</span>
            ) : (
              <>لا توجد منتجات</>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in zoom-in duration-500"
                  style={{
                    animationFillMode: 'both',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <ProductCard
                    id={product.id.toString()}
                    name={product.name}
                    price={product.pricing.final_price}
                    image={`https://alfareed.admin.t-carts.com${product.images[0]}`}
                    href={`/products/${product.id}`}
                    originalPrice={product.pricing.has_discount ? product.pricing.price : undefined}
                    discount={product.pricing.has_discount ?
                      Math.round(((product.pricing.price - product.pricing.final_price) / product.pricing.price) * 100) :
                      undefined}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={currentPage === page ? "bg-[#23A6F0]" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState onClear={clearFilters} />
        )}
      </div>
    </div>
  );
}

// ============= المكونات المساعدة =============

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="animate-pulse">
          {/* Hero Skeleton */}
          <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
          
          {/* Search Bar Skeleton */}
          <div className="h-16 bg-gray-200 rounded-lg mb-8"></div>
          
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <X className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">حدث خطأ</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <Button onClick={onRetry} className="bg-[#23A6F0] hover:bg-[#1f98df]">
        إعادة المحاولة
      </Button>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        لا توجد منتجات
      </h3>
      <p className="text-gray-600 mb-4">
        لم نتمكن من العثور على منتجات تطابق معايير البحث الخاصة بك
      </p>
      <Button onClick={onClear} variant="outline">
        مسح جميع الفلاتر
      </Button>
    </div>
  );
}
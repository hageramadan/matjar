"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductCard } from "../products/ProductCard";
import { Button } from "../ui/button";

interface Product {
  id: number;
  name: string;
  pricing: {
    price: number;
    has_discount: boolean;
    discount_type: string | null;
    discount_value: number | null;
    price_after_discount: number | null;
    final_price: number;
  };
  images: string[];
  category: {
    id: number;
    name: string;
  };
  subcategory: {
    id: number;
    name: string;
  };
  quantity: number;
  is_active: boolean;
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
      from: number | null;      // قد يكون null
      to: number | null;        // قد يكون null
      next_page: string | null;
      previous_page: string | null;
    };
  };
}

interface ProductsSectionProps {
  title: string;
  apiEndpoint: string;
  initialDisplayCount?: number;
  showViewMore?: boolean;
}

const API_BASE_URL = 'https://alfareed.admin.t-carts.com';

export function ProductsSection({ 
  title, 
  apiEndpoint, 
  initialDisplayCount = 8,
  showViewMore = false 
}: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}${apiEndpoint}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (isMounted) {
          // ✅ التغيير الأساسي هنا
          // نتحقق فقط من نجاح الاستجابة (errNum === 200)
          // ولا نعتبر المنتجات الفارغة خطأ
          if (data.errNum === 200 && data.result === true) {
            // المنتجات قد تكون مصفوفة فارغة - هذا مقبول
            setProducts(data.data.products || []);
          } else {
            // فقط نعرض خطأ إذا كانت الاستجابة فاشلة فعلاً
            throw new Error(data.message || 'Failed to fetch products');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتجات');
          setProducts([]); // تأكيد أن المنتجات فارغة في حالة الخطأ
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 6, products.length));
      setIsLoading(false);
    }, 500);
  };

  const visibleProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  // ✅ حالة التحميل الأولي
  if (isLoading && products.length === 0) {
    return <LoadingState />;
  }

  // ✅ حالة الخطأ الحقيقي (فقط عندما يكون error !== null)
  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // ✅ حالة عدم وجود منتجات (استجابة ناجحة ولكن products فارغة)
  if (!isLoading && products.length === 0) {
    return <EmptyState title={title} />;
  }

  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="container-custom">
        <SectionHeader title={title} />
        
        <ProductsGrid products={visibleProducts} />
        
        {isLoading && <LoadingSpinner />}
        
        {showViewMore && hasMore && !isLoading && (
          <ViewMoreButton onClick={handleLoadMore} />
        )}
      </div>
    </section>
  );
}

// ============= المكونات المساعدة =============

function LoadingState() {
  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="container-custom">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#23A6F0] border-r-transparent"></div>
            <p className="mt-2 text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="container-custom">
        <div className="text-center text-red-500">
          <p>عذراً، حدث خطأ: {error}</p>
          <button 
            onClick={onRetry} 
            className="mt-2 px-4 py-2 bg-[#23A6F0] text-white rounded hover:bg-[#1f98df] transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    </section>
  );
}

// ✅ مكون جديد: حالة عدم وجود منتجات
function EmptyState({ title }: { title: string }) {
  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="container-custom">
        <SectionHeader title={title} />
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-500">لم يتم العثور على منتجات في هذا القسم حالياً</p>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 md:mb-10 flex justify-between">
      <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#112B40' }}>
        {title}
      </h2>
      <p className="text-[#23A6F0] cursor-pointer hover:underline">
        عرض المزيد
      </p>
    </div>
  );
}

function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-5 md:mb-10">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in zoom-in duration-500"
          style={{ 
            animationFillMode: 'both',
            animationDelay: `${index * 100}ms`
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
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#23A6F0]"></div>
    </div>
  );
}

function ViewMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center">
      <Button
        onClick={onClick}
        className="group px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'white',
          color: '#23A6F0',
          border: '2px solid #23A6F0',
          borderRadius: '12px'
        }}
      >
        عرض المزيد
        <ChevronLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>
    </div>
  );
}
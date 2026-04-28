"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories?: Subcategory[];
}

interface ApiResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    categories: Category[];
  };
}

export function CategoriesDragDrop() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب البيانات من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://alfareed.admin.t-carts.com/api/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.result && data.data.categories) {
          setCategories(data.data.categories);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الأقسام');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // دوال السحب
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.userSelect = 'none';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollStart(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollStart - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollStart - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.userSelect = 'auto';
    }
  };

  // دوال أزرار التحريك
  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // دالة للحصول على صورة ثابتة لكل قسم بناءً على الاسم
  const getCategoryImage = (categoryName: string): string => {
    // تعيين صور مختلفة حسب اسم القسم
    const imageMap: { [key: string]: string } = {
      'الإلكترونيات': '/images/categories/cate1.png',
      'الهواتف الذكية': '/images/categories/cate1.png',
      'أجهزة اللابتوب': '/images/categories/cat2.png',
      'الكمبيوتر': '/images/categories/cat2.png',
      'اكسسوارات': '/images/categories/cate3.png',
      'سماعات': '/images/categories/cate4.png',
    };

    // البحث عن الصورة المناسبة
    for (const [key, value] of Object.entries(imageMap)) {
      if (categoryName.includes(key)) {
        return value;
      }
    }
    
    // صورة افتراضية إذا لم يتم العثور على تطابق
    return '/images/categories/cate1.png';
  };

  // عرض شاشة التحميل
  if (loading) {
    return (
      <section className="py-2 md:py-12">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex justify-center items-center h-[236px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#23A6F0] border-r-transparent"></div>
              <p className="mt-2 text-gray-600">جاري تحميل الأقسام...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <section className="py-2 md:py-12">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center text-red-500">
            <p>عذراً، حدث خطأ: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-[#23A6F0] text-white rounded hover:bg-[#1f98df]"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  // إذا لم توجد أقسام
  if (categories.length === 0) {
    return (
      <section className="py-2 md:py-12">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center text-gray-500">
            <p>لا توجد أقسام متاحة حالياً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 md:py-12">
      <div className="container-custom px-4 sm:px-6 relative">
        
        {/* زر السهم الأيمن */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#23A6F0] rounded-full shadow-lg p-2 md:p-3 hover:bg-[#1f98df] transition-all duration-300 hidden md:block"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateX(50%) translateY(-50%)'
          }}
          aria-label="التمرير لليسار"
        >
          <FaArrowRightLong className="text-white"/>
        </button>

        {/* زر السهم الأيسر */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#23A6F0] rounded-full shadow-lg p-2 md:p-3 hover:bg-[#1f98df] transition-all duration-300 hidden md:block"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateX(-50%) translateY(-50%)'
          }}
          aria-label="التمرير لليمين"
        >
        <FaArrowLeftLong className="text-white" />
        </button>

        {/* حاوية السحب الأفقية */}
        <div 
          ref={sliderRef}
          className="overflow-x-auto md:h-[236px] h-[100px] pt-12 hide-scrollbar"
          style={{ 
            width: '100%',
            overflowY: 'hidden',
            cursor: 'grab',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="flex gap-2 md:gap-[26px] justify-start items-center h-full">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 flex items-center group transition-all duration-300 hover:-translate-y-2"
              >
                <Link href={`/category/${category.id}`}>
                  <div className="flex items-center flex-col transition-all w-[85px] md:w-[220px] duration-300 cursor-pointer pb-7">
                    <div 
                      className="relative bg-gray-100 flex items-center justify-center overflow-hidden rounded-full h-[64px] md:h-[196px] w-[64px] md:w-[196px] transition-transform duration-300"
                    >
                      <Image
                        src={getCategoryImage(category.name)}
                        alt={category.name}
                        width={148}
                        height={148}
                        className="object-contain transition-transform duration-500 w-[32px] h-[32px] md:w-[148px] md:h-[148px]"
                        sizes="148px"
                      />
                    </div>
                    <div className="text-center mt-2 pb-2 w-full">
                      <h3 
                        className="text-[10px] sm:text-[16px] whitespace-nowrap"
                        style={{ color: '#112B40' }}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
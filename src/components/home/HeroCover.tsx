"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";

// ============= واجهات البيانات =============
interface Slide {
  id: number;
  sub_title: string | null;
  name: string;
  description: string | null;
  link: string | null;
  image: string;
  is_active: number;
}

interface ApiResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    sliders: Slide[];
  };
}

const API_BASE_URL = 'https://alfareed.admin.t-carts.com';

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // متغيرات للسحب باللمس
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // جلب السلايدر من API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/sliders`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.errNum === 200 && data.result === true) {
          // تصفية السلايدرات النشطة فقط
          const activeSliders = data.data.sliders.filter(slider => slider.is_active === 1);
          setSlides(activeSliders);
        } else {
          throw new Error(data.message || 'فشل في تحميل السلايدر');
        }
      } catch (err) {
        console.error('Error fetching sliders:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل السلايدر');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToNextSlide = () => {
    if (slides.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevSlide = () => {
    if (slides.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // ============= دوال السحب باللمس للموبايل =============
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const minSwipeDistance = 50; // أقل مسافة للسحب لتغيير السلايد
    
    if (touchStartX.current && touchEndX.current) {
      const distance = touchEndX.current - touchStartX.current;
      const isLeftSwipe = distance < -minSwipeDistance; // سحب لليسار -> السلايد التالي
      const isRightSwipe = distance > minSwipeDistance; // سحب لليمين -> السلايد السابق
      
      if (isLeftSwipe) {
        goToNextSlide();
      } else if (isRightSwipe) {
        goToPrevSlide();
      }
    }
    
    // إعادة تعيين القيم
    setIsDragging(false);
    setDragOffset(0);
    touchStartX.current = 0;
    touchEndX.current = 0;
    
    // استئناف التشغيل التلقائي بعد 10 ثواني
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <section className="relative w-full h-[70vh] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#23A6F0] border-r-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // في حالة الخطأ أو عدم وجود سلايدرات، لا نعرض أي شيء
  if (error || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
      {/* Slides Container - مع إضافة أحداث اللمس */}
      <div 
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          // حساب التحويل الأفقي أثناء السحب
          let transform = '';
          if (isDragging && index === currentSlide) {
            transform = `translateX(${dragOffset}px)`;
          } else if (index === currentSlide) {
            transform = 'translateX(0)';
          } else if (index === currentSlide - 1 || (currentSlide === 0 && index === slides.length - 1)) {
            transform = 'translateX(-100%)';
          } else if (index === currentSlide + 1 || (currentSlide === slides.length - 1 && index === 0)) {
            transform = 'translateX(100%)';
          } else {
            transform = 'translateX(100%)';
          }
          
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out ${
                index === currentSlide ? "z-10" : "z-0"
              }`}
              style={{
                transform: transform,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {/* Background Image */}
              <div className="relative w-full h-full">
                <Image
                  src={`${API_BASE_URL}${slide.image}`}
          alt={slide.name}
                  fill
                  loading="eager"
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="container-custom text-center text-white gap-3">
                  {/* الاسم الرئيسي */}
                  <h1 className="text-3xl md:text-5xl lg:text-[58px] font-bold mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {slide.name}
                  </h1>
                  
                  {/* الوصف */}
                  {slide.description && (
                    <p className="text-base md:text-lg lg:text-[20px] mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                      {slide.description}
                    </p>
                  )}
                  
                  {/* زر التسوق */}
                  <Button
                    asChild
                    className="animate-in text-[16px] font-bold fade-in slide-in-from-bottom-5 duration-700 delay-200 rounded-xl"
                    style={{ 
                      backgroundColor: '#23A6F0',
                      width: '177px',
                      height: '56px'
                    }}
                  >
                    <Link 
                      href={slide.link || "/products"} 
                      className="flex items-center justify-center gap-2"
                    >
                      تسوق الآن
                      <FaArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - تظهر فقط إذا كان هناك أكثر من سلايد */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          <button
            onClick={goToNextSlide}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </>
      )}

      {/* Dots Navigation - تظهر فقط إذا كان هناك أكثر من سلايد */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-[#23A6F0]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
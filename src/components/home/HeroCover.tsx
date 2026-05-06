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
  
  // متغيرات محسنة للسحب باللمس
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSwipingHorizontal = useRef<boolean>(false);

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

  // ============= دوال السحب المحسنة للموبايل =============
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
    setIsAutoPlaying(false);
    isSwipingHorizontal.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;
    
    // تحديد الاتجاه - أفقي أم عمودي
    if (!isSwipingHorizontal.current && Math.abs(diffX) > 5) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        isSwipingHorizontal.current = true;
        e.preventDefault();
      }
    }
    
    if (isSwipingHorizontal.current) {
      e.preventDefault();
      const containerWidth = containerRef.current.clientWidth;
      let progress = diffX / containerWidth;
      // تحديد حدود السحب
      progress = Math.min(Math.max(progress, -0.8), 0.8);
      setDragProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const minSwipeDistance = 0.15; // 15% عتبة السحب
    
    if (Math.abs(dragProgress) > minSwipeDistance && isSwipingHorizontal.current) {
      // سحب ناجح - تغيير الصورة فوراً
      if (dragProgress < 0) {
        goToNextSlide(); // سحب لليسار -> التالي
      } else if (dragProgress > 0) {
        goToPrevSlide(); // سحب لليمين -> السابق
      }
    }
    
    // إعادة التعيين
    setIsDragging(false);
    setDragProgress(0);
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwipingHorizontal.current = false;
    
    // استئناف التشغيل التلقائي بعد 10 ثواني
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // حساب مؤشرات السلايدات المجاورة
  const getPrevIndex = () => {
    return currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  };

  const getNextIndex = () => {
    return (currentSlide + 1) % slides.length;
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

  // في حالة الخطأ أو عدم وجود سلايدرات
  if (error || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
      {/* Slides Container - سحب سلس مثل المعرض */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          touchAction: isDragging && isSwipingHorizontal.current ? 'none' : 'pan-y',
        }}
      >
        <div className="relative w-full h-full">
          {/* السلايد الحالي + السحب المباشر */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `translateX(${dragProgress * 100}%)`,
              zIndex: 10,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${API_BASE_URL}${slides[currentSlide].image}`}
                alt={slides[currentSlide].name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="container-custom text-center text-white gap-3 pointer-events-auto">
                <h1 className="text-3xl md:text-5xl lg:text-[58px] font-bold mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  {slides[currentSlide].name}
                </h1>
                
                {slides[currentSlide].description && (
                  <p className="text-base md:text-lg lg:text-[20px] mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    {slides[currentSlide].description}
                  </p>
                )}
                
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
                    href={slides[currentSlide].link || "/products"} 
                    className="flex items-center justify-center gap-2"
                  >
                    تسوق الآن
                    <FaArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* السلايد التالي - يظهر من اليمين عند السحب لليسار */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `translateX(${dragProgress < 0 ? (100 + dragProgress * 100) : 100}%)`,
              zIndex: dragProgress < 0 ? 15 : 5,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${API_BASE_URL}${slides[getNextIndex()].image}`}
                alt={slides[getNextIndex()].name}
                fill
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>

          {/* السلايد السابق - يظهر من اليسار عند السحب لليمين */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `translateX(${dragProgress > 0 ? (-100 + dragProgress * 100) : -100}%)`,
              zIndex: dragProgress > 0 ? 15 : 5,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${API_BASE_URL}${slides[getPrevIndex()].image}`}
                alt={slides[getPrevIndex()].name}
                fill
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - مخفية على الموبايل */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110 bg-black/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          <button
            onClick={goToNextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110 bg-black/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
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
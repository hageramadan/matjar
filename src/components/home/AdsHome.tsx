"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

// ============= واجهات البيانات =============
interface Ad {
  id: number;
  sub_title: string | null;
  name: string;
  description: string | null;
  link: string | null;
  image: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    ad_pop_up: Ad[];
  };
}

const API_BASE_URL = 'https://alfareed.admin.t-carts.com';

export function AdsHome() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب الإعلانات من API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/ads`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.errNum === 200 && data.result === true) {
          // تصفية الإعلانات النشطة فقط
          const activeAds = data.data.ad_pop_up.filter(ad => ad.is_active === 1);
          setAds(activeAds);
        } else {
          throw new Error(data.message || 'فشل في تحميل الإعلانات');
        }
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الإعلانات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  // التبديل التلقائي بين الإعلانات كل 5 ثواني
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // تغيير الإعلان كل 5 ثواني

    return () => clearInterval(interval);
  }, [ads.length]);

  // الانتقال إلى إعلان محدد
  const goToAd = (index: number) => {
    setCurrentAdIndex(index);
  };

  // التبديل يدوياً
  const nextAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <section className="py-6 md:py-12 bg-white">
        <div className="container-custom">
          <div className="bg-[#F2F8FD] rounded-2xl p-8 animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded w-64"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-12 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="w-[336px] md:w-[536px] h-[124px] md:h-[424px] bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <section className="py-6 md:py-12 bg-white">
        <div className="container-custom">
          <div className="bg-red-50 rounded-2xl p-8 text-center">
            <p className="text-red-500 mb-4">عذراً، حدث خطأ: {error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-[#23A6F0] hover:bg-[#1f98df]"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // عرض حالة عدم وجود إعلانات
  if (ads.length === 0) {
    return null; // أو يمكن عرض إعلان افتراضي
  }

  const currentAd = ads[currentAdIndex];

  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="container-custom">
        <div className="bg-[#F2F8FD] rounded-2xl flex flex-col md:flex-row items-center justify-between px-4 md:px-10 py-6 md:py-8 relative overflow-hidden">
          
          {/* أزرار التنقل (إذا كان هناك أكثر من إعلان) */}
          {ads.length > 1 && (
            <>
              <button
                onClick={prevAd}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 md:p-2 shadow-lg transition-all"
                aria-label="إعلان سابق"
              >
                <FaArrowLeft className="h-4 w-4 md:h-6 md:w-6 text-[#23A6F0] rotate-180" />
              </button>
              <button
                onClick={nextAd}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 md:p-2 shadow-lg transition-all"
                aria-label="إعلان تالي"
              >
                <FaArrowLeft className="h-4 w-4 md:h-6 md:w-6 text-[#23A6F0]" />
              </button>
            </>
          )}

          {/* محتوى الإعلان */}
          <div className="flex flex-col gap-2 md:gap-[22px] flex-1 z-10 px-4 md:px-0">
            {currentAd.sub_title && (
              <p className="text-[10px] md:text-[14px] font-semibold py-1 px-2 bg-[#FF995D] text-white w-fit rounded">
                {currentAd.sub_title}
              </p>
            )}
            
            <h1 className="text-xl md:text-[48px] font-bold text-[#191C1F]">
              {currentAd.name}
            </h1>
            
            {currentAd.description && (
              <p className="text-sm md:text-[24px] text-[#191C1F] w-full md:w-[80%] leading-[1.5]">
                {currentAd.description}
              </p>
            )}
            
            <Button
              asChild
              aria-label='buy now'
              className="w-fit md:w-[180px] md:h-[60px] animate-in text-[12px] md:text-[16px] font-bold fade-in slide-in-from-bottom-5 duration-700 delay-200 rounded-xl"
              style={{ backgroundColor: '#23A6F0' }}
            >
              <Link 
                href={currentAd.link || "/products"} 
                className="flex items-center justify-center gap-2 text-white"
              >
                تسوق الان
                <FaArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* صورة الإعلان */}
          <div className="mt-4 md:mt-0">
            <Image 
              src={`${API_BASE_URL}${currentAd.image}`}
              alt={currentAd.name}
              className="w-[280px] md:w-[536px] h-[180px] md:h-[424px] object-cover rounded-lg"
              width={536}
              height={424}
              priority
            />
          </div>
        </div>

        {/* مؤشرات التقدم (dots) للإعلانات المتعددة */}
        {ads.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => goToAd(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentAdIndex === index
                    ? 'w-6 h-2 bg-[#23A6F0]'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`الانتقال إلى الإعلان ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
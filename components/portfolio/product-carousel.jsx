'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/cards';
import { useTheme } from '@/context/themeContext';
import { cn } from '@/lib/utils';

export function ProductCarousel({ products = [], showStockStatus = true }) {
  const { portfolioTheme } = useTheme();
  const themeColor = portfolioTheme?.themeColor || '#000000';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  if (!products || products.length === 0) return null;

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    if (products.length <= itemsPerView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [maxIndex, products.length, itemsPerView]);

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'grid gap-4 md:gap-6',
              itemsPerView === 1 && 'grid-cols-1',
              itemsPerView === 2 && 'grid-cols-2',
              itemsPerView === 3 && 'grid-cols-3',
              itemsPerView === 4 && 'grid-cols-4'
            )}
          >
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} showStockStatus={showStockStatus} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {products.length > itemsPerView && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4',
              'w-12 h-12 rounded-full shadow-lg backdrop-blur-sm',
              'bg-white/90 hover:bg-white border border-gray-200',
              'hidden md:flex'
            )}
            style={{ color: themeColor }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4',
              'w-12 h-12 rounded-full shadow-lg backdrop-blur-sm',
              'bg-white/90 hover:bg-white border border-gray-200',
              'hidden md:flex'
            )}
            style={{ color: themeColor }}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map((_, idx) => {
            const pageIndex = idx * itemsPerView;
            const isActive = currentIndex >= pageIndex && currentIndex < pageIndex + itemsPerView;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(pageIndex)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  isActive ? 'w-8' : 'w-2',
                  isActive ? 'opacity-100' : 'opacity-50'
                )}
                style={{
                  backgroundColor: isActive ? themeColor : `${themeColor}40`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}


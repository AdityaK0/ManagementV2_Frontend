'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl bg-white">
      <div className="relative aspect-square w-full bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
      </CardFooter>
    </Card>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 bg-gray-300 rounded w-64 mx-auto animate-pulse" />
          <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}


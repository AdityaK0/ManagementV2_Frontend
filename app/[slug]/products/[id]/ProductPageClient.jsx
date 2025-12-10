'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePortfolioContext } from '@/context/portfolioContext';
import { useProduct } from '@/hooks/api-hooks';
import ProductDetailView from '@/components/shared/ProductDetailView';
import { setProductCache } from '@/lib/productCache';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/shared/loading-states';

export default function ProductPageClient() {
  const params = useParams();
  // Handle id - it might be a string or array
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { slug, portfolio } = usePortfolioContext();
  
  // Get slug from context (which is set in layout from server-side)
  // The context should always be available since layout is server component
  const effectiveSlug = slug;

  // Validate that we have both slug and id before making the query
  const isValid = effectiveSlug && id;

  // Use React Query for proper data fetching with caching and refetching
  // This will always fetch fresh data from backend, even on refresh
  const { data: product, isLoading, isError, error, isFetching } = useProduct(
    effectiveSlug, 
    id, 
    {
      // Only enable query if we have valid params
      enabled: !!isValid,
      // Always refetch on mount to get fresh data from backend
      refetchOnMount: true,
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      // Don't use stale data - always check with backend
      staleTime: 0,
    }
  );

  // Cache the product when it's fetched (for quick navigation)
  useEffect(() => {
    if (product && id) {
      setProductCache(id, product);
    }
  }, [product, id]);

  // Show loading state (including when fetching or slug/id not ready)
  if (!isValid || isLoading || isFetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm">Loading product...</p>
      </div>
    );
  }

  // Show error state
  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="Product Not Found"
          description={error?.message || "The requested product does not exist or could not be loaded."}
        />
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}


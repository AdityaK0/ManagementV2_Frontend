import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { api_v1 } from '@/lib/api';


export const usePortfolio = (slug) => {
  return useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => api_v1.get(`/portfolio/public/${slug}/`),
    enabled: !!slug,
  });
};


export const useProducts = (
  slug,
  { page = 1, search = '', min_price = '', max_price = '', category = '' } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ['products', slug, page, search, min_price, max_price, category],
    queryFn: () =>
      api_v1.get(`/portfolio/public/${slug}/products/`, {  // ✅ Regular template literal
        params: {
          page,
          page_size: 10,
          search,
          min_price,
          max_price,
          category,
        },
      }),
    enabled: !!slug,
    ...options,
  });
};

export const useProduct = (slug, id, options = {}) => {
  return useQuery({
    queryKey: ['product', slug, id],
    queryFn: () =>
      api_v1.get(`/portfolio/public/${slug}/products/${id}/`),
    enabled: !!slug && !!id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount (for refresh)
    ...options,
  });
};

// export const getSingleProduct = (slug,id)=>{ 
//   return useQuery({
//     queryKey:['products',slug,id],
//     queryFn:()=>
//       api.get(`/portfolio/public/${slug}/products/${id}`, {
//       }),
//     enabled: !!slug && !!id, // base condition
//     ...options, 
//   });
// }

// export function useProductsFilter(
//   slug,
//   { page = 1, min_price = '', max_price = '' } = {}
// ) {
//   return useQuery({
//     queryKey: ['products-filter', slug, page, min_price, max_price],
//     queryFn: () =>
//       api.get(`/portfolio/public/${slug}/products/filter/`, {
//         params: { page, min_price, max_price },
//       }),
//     enabled: !!slug && (min_price !== '' || max_price !== ''),

//   });
// }

// export function useProductsFilter(
//   slug,
//   { page = 1, min_price = '', max_price = '' } = {},
//   options = {}
// ) {
//   return useQuery({
//     queryKey: ['products-filter', slug, page, min_price, max_price],
//     queryFn: () =>
//       api.get(`/portfolio/public/${slug}/products/filter/`, {
//         params: { page, min_price, max_price },
//       }),
//     enabled: !!slug && (min_price !== '' || max_price !== ''),
//     ...options, // allow mode-based overrides
//   });
// }




// export const useCollections = (slug) => {
//   return useQuery({
//     queryKey: ['collections', slug],
//     queryFn: () => api.get(`/portfolio/public/${slug}/collections/`),
//     enabled: !!slug,
//   });
// };


export const useCollections = (slug) => {
  return useQuery({
    queryKey: ['collections', slug],
    queryFn: () => api_v1.get(`/portfolio/public/${slug}/collections/`),
    enabled: !!slug,
  });
};

export const useTestimonials = (slug) => {
  return useQuery({
    queryKey: ['testimonials', slug],
    queryFn: () => api.get(`/portfolio/public/${slug}/testimonials/`),
    enabled: !!slug,
  });
};
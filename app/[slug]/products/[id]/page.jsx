import { generateProductMetadata, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import ProductPageClient from './ProductPageClient';

// Server component for metadata generation
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const { slug, id } = resolvedParams;

    // Fetch portfolio data
    const portfolioResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    
    if (!portfolioResponse.ok) {
      throw new Error('Portfolio not found');
    }
    
    const portfolio = await portfolioResponse.json();

    // Fetch product data
    const productResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/products/${id}/`,
      { cache: "no-store" }
    );
    
    if (!productResponse.ok) {
      throw new Error('Product not found');
    }
    
    const product = await productResponse.json();

    return generateProductMetadata(product, portfolio, slug);
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Product | Portfolio',
      description: 'View product details',
    };
  }
}

// Server component wrapper
export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const { slug, id } = resolvedParams;

  // Fetch data for JSON-LD (optional - client will fetch if this fails)
  let product = null;
  let portfolio = null;

  try {
    const portfolioResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    
    if (portfolioResponse.ok) {
      portfolio = await portfolioResponse.json();
    }

    const productResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/products/${id}/`,
      { cache: "no-store" }
    );
    
    if (productResponse.ok) {
      product = await productResponse.json();
    }
  } catch (error) {
    // Silently fail - client component will handle data fetching
    console.error('Error fetching data for JSON-LD (non-critical):', error);
  }

  // Generate JSON-LD structured data only if we have the data
  const productSchema = product && portfolio ? generateProductSchema(product, portfolio, slug) : null;
  const breadcrumbSchema = product && portfolio ? generateBreadcrumbSchema([
    { name: portfolio?.display_name || portfolio?.business_name || 'Home', url: `/${slug}` },
    { name: 'Products', url: `/${slug}/products` },
    { name: product.name || 'Product', url: `/${slug}/products/${id}` },
  ], slug) : null;

  return (
    <>
      {/* JSON-LD Structured Data - only render if we have data */}
      {productSchema && <JsonLd data={productSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <ProductPageClient />
    </>
  );
}



// 'use client';
// import { useSearchParams,useParams } from 'next/navigation';
// import { useState,useEffect } from 'react';
// import ProductDetailView from '@/components/shared/ProductDetailView';
// import { getProductCache } from '@/lib/productCache';
// import api from '@/lib/api';
// import { Loader2 } from 'lucide-react'; 
// // import { getSingleProduct } from '@/hooks/api-hooks';
// // import { PRODUCT_DECODE } from '@/lib/productEncoder';
// // import { useMemo } from 'react';


// export default function ProductPage() {
//   const searchParams = useSearchParams();

//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [slug,setSlug] = useState(null)
//   const [loading, setLoading] = useState(false);

//   // Get encoded product JSON from query string
//   // const encoded = searchParams.get('data');

//   // Decode + parse product safely
//   // const product = useMemo(() => {
//   //   if (!encoded) return null;
//   //   try {
//   //     // return JSON.parse(decodeURIComponent(encoded));
//   //     return PRODUCT_DECODE(encoded);

//   //   } catch (err) {
//   //     console.error('Failed to parse product data', err);
//   //     return null;
//   //   }
//   // }, [encoded]);


//   useEffect(() => {
//     const cached = getProductCache(id);
//     if (cached) {
//       setProduct(cached);
//     console.log("RAN @@@ 1")

//     } else {
//       // Fallback: fetch product if not cached
//       if (typeof window !== 'undefined') {
//         const hostname = window.location.hostname;
//         const subdomain = hostname.split('.')[0];
//         setSlug(subdomain);
//       }
//     }
//   }, [id]);


//   useEffect(() => {
//     console.log("RAN @@@ 2")
//     if (!slug || getProductCache(id)) return;
//     setLoading(true);
//     // setError(false);

//     api.get(`/portfolio/public/${slug}/products/${id}`)
//       .then((res) => {
//         console.log(res,"RESSS")
//         setProduct(res);
//       })
//       .catch(() => {
//         console.log("got error while getting the product")
//         // setError(true)
//       })
//       .finally(() => setLoading(false));
//   }, [slug, id]);

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         No product data found.
//       </div>
//     );
//   }

//   return <ProductDetailView product={product} />;
// }

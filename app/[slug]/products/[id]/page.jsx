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


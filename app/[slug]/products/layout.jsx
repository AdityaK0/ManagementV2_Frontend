import { generateProductsListingMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    const portfolio = await response.json();

    return generateProductsListingMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating products listing metadata:', error);
    return {
      title: 'Products | Portfolio',
      description: 'Browse our product catalog',
    };
  }
}

export default function ProductsLayout({ children }) {
  return children;
}


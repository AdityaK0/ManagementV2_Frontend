import { generateCollectionsListingMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    const portfolio = await response.json();

    return generateCollectionsListingMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating collections listing metadata:', error);
    return {
      title: 'Collections | Portfolio',
      description: 'Browse our collections',
    };
  }
}

export default function CollectionsLayout({ children }) {
  return children;
}


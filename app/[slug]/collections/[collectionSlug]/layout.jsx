import { generateCollectionMetadata, generateCollectionSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const { slug, collectionSlug } = resolvedParams;

    // Fetch portfolio data
    const portfolioResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    const portfolio = await portfolioResponse.json();

    let collection = null;
    try {
      const collectionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/collections/${collectionSlug}/`,
        { cache: "no-store" }
      );
      if (collectionResponse.ok) {
        collection = await collectionResponse.json();
      }
    } catch (error) {
      // Collection might be passed via query params, so this is optional
      console.log('Collection not available via API, will use query params');
    }

    if (collection) {
      return generateCollectionMetadata(collection, portfolio, slug);
    }

    // Fallback metadata if collection not available
    const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
    return {
      title: `Collection | ${siteName}`,
      description: `Browse collection from ${siteName}`,
    };
  } catch (error) {
    console.error('Error generating collection metadata:', error);
    return {
      title: 'Collection | Portfolio',
      description: 'View collection',
    };
  }
}

export default async function CollectionLayout({ children, params }) {
  const resolvedParams = await params;
  const { slug, collectionSlug } = resolvedParams;

  // Try to fetch collection for JSON-LD
  let collection = null;
  let portfolio = null;

  try {
    const portfolioResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    portfolio = await portfolioResponse.json();

    const collectionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/collections/${collectionSlug}/`,
      { cache: "no-store" }
    );
    if (collectionResponse.ok) {
      collection = await collectionResponse.json();
    }
  } catch (error) {
    // Collection might be passed via query params
  }

  // Generate JSON-LD if collection data is available
  const collectionSchema = collection ? generateCollectionSchema(collection, portfolio, slug) : null;

  return (
    <>
      {collectionSchema && <JsonLd data={collectionSchema} />}
      {children}
    </>
  );
}


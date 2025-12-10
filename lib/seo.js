/**
 * SEO Utility Functions
 * Comprehensive SEO metadata, JSON-LD structured data, and OpenGraph generation
 */

/**
 * Get the base URL for the site
 */
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
}

/**
 * Generate full canonical URL
 */
export function getCanonicalUrl(path = '', baseUrl = null) {
  const base = baseUrl || getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Generate comprehensive metadata for portfolio pages
 */
export function generatePortfolioMetadata(portfolio, slug) {
  if (!portfolio) {
    return {
      title: 'Portfolio | Vendor Portfolio',
      description: 'View our portfolio and products',
    };
  }

  const title = portfolio.meta_title || portfolio.display_name || portfolio.business_name || 'Portfolio';
  const description = portfolio.meta_description || portfolio.tagline || portfolio.description || 'View our portfolio and products';
  const image = portfolio.banner_image || portfolio.logo || '';
  const keywords = portfolio.meta_keywords || '';
  const siteName = portfolio.display_name || portfolio.business_name || 'Portfolio';
  const canonical = getCanonicalUrl(`/${slug}`);

  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()).join(', ') : undefined,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonical,
      siteName,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteName} - Portfolio Banner`,
        }
      ] : [],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: image ? [image] : [],
      creator: portfolio.twitter_handle || undefined,
      site: portfolio.twitter_handle || undefined,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'theme-color': portfolio.theme_color || '#000000',
    },
  };
}

/**
 * Generate comprehensive metadata for product pages
 */
export function generateProductMetadata(product, portfolio, slug) {
  if (!product) {
    return {
      title: 'Product | Portfolio',
      description: 'View product details',
    };
  }

  const title = product.meta_title || product.name || 'Product';
  const description = product.meta_description || product.description || `View ${product.name || 'this product'} details and specifications`;
  const image = product.images?.[0] || product.image || portfolio?.banner_image || '';
  const price = product.price ? parseFloat(product.price) : null;
  const currency = 'INR';
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
  const canonical = getCanonicalUrl(`/${slug}/products/${product.id}`);

  return {
    title: `${title} | ${siteName}`,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    keywords: product.meta_keywords || product.category_name || product.category || undefined,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonical,
      siteName,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name || 'Product image',
        }
      ] : [],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'product:price:amount': price ? price.toString() : undefined,
      'product:price:currency': price ? currency : undefined,
      'product:availability': product.is_in_stock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
    },
  };
}

/**
 * Generate metadata for products listing page
 */
export function generateProductsListingMetadata(portfolio, slug, searchParams = {}) {
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
  const title = `Products | ${siteName}`;
  const description = portfolio?.meta_description || `Browse our complete product catalog from ${siteName}`;
  const canonical = getCanonicalUrl(`/${slug}/products`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for collection pages
 */
export function generateCollectionMetadata(collection, portfolio, slug) {
  if (!collection) {
    return {
      title: 'Collection | Portfolio',
      description: 'View collection',
    };
  }

  const title = collection.name || 'Collection';
  const description = collection.description || collection.meta_description || `Browse ${collection.name || 'this collection'}`;
  const image = collection.cover_image_url || collection.cover_image || portfolio?.banner_image || '';
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
  const canonical = getCanonicalUrl(`/${slug}/collections/${collection.slug || ''}`);

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonical,
      siteName,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: collection.name || 'Collection cover',
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate Organization JSON-LD structured data
 */
export function generateOrganizationSchema(portfolio, slug) {
  if (!portfolio) return null;

  const baseUrl = getBaseUrl();
  const siteUrl = getCanonicalUrl(`/${slug}`, baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: portfolio.display_name || portfolio.business_name || 'Portfolio',
    description: portfolio.meta_description || portfolio.tagline || portfolio.description,
    url: siteUrl,
    logo: portfolio.logo ? {
      '@type': 'ImageObject',
      url: portfolio.logo,
    } : undefined,
    image: portfolio.banner_image || portfolio.logo,
    address: portfolio.address ? {
      '@type': 'PostalAddress',
      streetAddress: portfolio.address,
      addressLocality: portfolio.city,
      addressRegion: portfolio.state,
      postalCode: portfolio.pincode,
      addressCountry: portfolio.country || 'IN',
    } : undefined,
    contactPoint: portfolio.contact_phone || portfolio.business_phone ? {
      '@type': 'ContactPoint',
      telephone: portfolio.contact_phone || portfolio.business_phone,
      contactType: 'Customer Service',
    } : undefined,
    sameAs: [
      portfolio.facebook_url,
      portfolio.twitter_url,
      portfolio.instagram_url,
      portfolio.linkedin_url,
    ].filter(Boolean),
  };
}

/**
 * Generate Product JSON-LD structured data
 */
export function generateProductSchema(product, portfolio, slug) {
  if (!product || !product.id) return null;

  try {
    const baseUrl = getBaseUrl();
    const productId = product.id?.toString() || '';
    if (!productId) return null;
    
    const productUrl = getCanonicalUrl(`/${slug}/products/${productId}`, baseUrl);
    const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const price = product.price ? parseFloat(product.price) : null;
    const availability = product.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
    const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name || 'Product',
      description: product.meta_description || product.description || '',
      image: images.length > 0 ? images : (product.image ? [product.image] : []),
      sku: product.sku || productId,
      brand: {
        '@type': 'Brand',
        name: siteName,
      },
    };

    // Add optional fields only if they exist
    if (product.mpn) {
      schema.mpn = product.mpn;
    }
    
    if (product.category_name || product.category) {
      schema.category = product.category_name || product.category;
    }

    if (price && !isNaN(price)) {
      schema.offers = {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'INR',
        price: price.toString(),
        availability: availability,
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: siteName,
        },
      };
    }

    if (product.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.review_count || 0,
      };
    }

    return schema;
  } catch (error) {
    console.error('Error generating product schema:', error);
    return null;
  }
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 */
export function generateBreadcrumbSchema(items, slug) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  try {
    const baseUrl = getBaseUrl();
    
    const breadcrumbItems = items
      .filter(item => item && item.name) // Filter out invalid items
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name || '',
        item: item.url ? getCanonicalUrl(item.url, baseUrl) : undefined,
      }));

    if (breadcrumbItems.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    };
  } catch (error) {
    console.error('Error generating breadcrumb schema:', error);
    return null;
  }
}

/**
 * Generate WebSite JSON-LD structured data
 */
export function generateWebSiteSchema(portfolio, slug) {
  const baseUrl = getBaseUrl();
  const siteUrl = getCanonicalUrl(`/${slug}`, baseUrl);
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: portfolio?.meta_description || portfolio?.tagline || portfolio?.description,
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Collection JSON-LD structured data
 */
export function generateCollectionSchema(collection, portfolio, slug) {
  if (!collection) return null;

  const baseUrl = getBaseUrl();
  const collectionUrl = getCanonicalUrl(`/${slug}/collections/${collection.slug || ''}`, baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collectionUrl,
    image: collection.cover_image_url || collection.cover_image,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collection.products?.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: getCanonicalUrl(`/${slug}/products/${product.id}`, baseUrl),
        },
      })) || [],
    },
  };
}

/**
 * Generate metadata for About page
 */
export function generateAboutMetadata(portfolio, slug) {
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
  const title = `About Us | ${siteName}`;
  const description = portfolio?.about_us || portfolio?.our_story || portfolio?.meta_description || `Learn more about ${siteName}`;
  const canonical = getCanonicalUrl(`/${slug}/about`);

  return {
    title,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for Contact page
 */
export function generateContactMetadata(portfolio, slug) {
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
  const title = `Contact Us | ${siteName}`;
  const description = `Get in touch with ${siteName}. Contact us for inquiries, support, or collaboration opportunities.`;
  const canonical = getCanonicalUrl(`/${slug}/contact`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for Collections listing page
 */
export function generateCollectionsListingMetadata(portfolio, slug) {
  const siteName = portfolio?.display_name || portfolio?.business_name || 'Portfolio';
  const title = `Collections | ${siteName}`;
  const description = `Browse our curated collections from ${siteName}`;
  const canonical = getCanonicalUrl(`/${slug}/collections`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


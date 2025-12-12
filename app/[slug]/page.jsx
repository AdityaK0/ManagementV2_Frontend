// 'use client';

// import { usePortfolio, useProducts } from '@/hooks/api-hooks';
// import { useTheme } from '@/context/themeContext';
// import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
// import { ProductCard } from '@/components/shared/cards';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { useEffect } from 'react';

// export default async function HomePage({ params }) {
//   const { slug } = await params;
//   const { updateTheme } = useTheme();
//   const { data: portfolio, isLoading: loadingPortfolio } = usePortfolio(slug);
//   const { data: productsData, isLoading: loadingProducts } = useProducts(slug, { page: 1 });

//   // Update theme colors when portfolio data is loaded
//   useEffect(() => {
//     if (portfolio?.theme) {
//       updateTheme(portfolio.theme);
//     }
//   }, [portfolio, updateTheme]); 

//   if (loadingPortfolio || loadingProducts) {
//     return <LoadingSpinner />;
//   }

//   if (!portfolio) {
//     return (
//       <EmptyState
//         title="Portfolio Not Found"
//         description="The requested vendor portfolio does not exist."
//       />
//     );
//   }

//   return (
//     <div>
//       {/* Hero Section */}
//       <div className="relative h-[60vh] min-h-[400px]">
//         <Image
//           src={portfolio.banner_image}
//           alt={portfolio.name}
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center text-white p-6"
//           >
//             <h1 className="text-4xl md:text-6xl font-bold mb-4">{portfolio.name}</h1>
//             <p className="text-xl md:text-2xl">{portfolio.tagline}</p>
//           </motion.div>
//         </div>
//       </div>

//       {/* Featured Products */}
//       <section className="container mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {productsData?.results?.slice(0, 8).map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="bg-muted/50 py-16">
//         <div className="container mx-auto px-4">
//           <div className="max-w-3xl mx-auto text-center">
//             <h2 className="text-3xl font-bold mb-6">About Us</h2>
//             <p className="text-lg text-muted-foreground">
//               {portfolio.about_us?.slice(0, 200)}...
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact CTA */}
//       <section className="container mx-auto px-4 py-16 text-center">
//         <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
//         <p className="text-lg text-muted-foreground mb-8">
//           Have questions about our products? We'd love to help!
//         </p>
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className="inline-block"
//         >
//           <a
//             href={`/${slug}/contact`}
//             className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//           >
//             Contact Us
//           </a>
//         </motion.div>
//       </section>
//     </div>
//   );
// }
export const runtime = 'edge';

"use client";

import { usePortfolioContext } from '@/context/portfolioContext';
import { useTheme } from '@/context/themeContext';
import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
import { ProductCard } from '@/components/shared/cards';
import { HeroSection } from '@/components/shared/hero-section';
import { AboutSection } from '@/components/shared/about-section';
import { GalleryCarousel } from '@/components/shared/gallery-carousel';
import { SectionContainer, LayoutContainer, ProductGrid } from '@/components/shared/layouts';
import { ProductCarousel } from '@/components/portfolio/product-carousel';
import { SectionsRenderer } from '@/components/portfolio/sections-renderer';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { StickyCTA } from '@/components/shared/sticky-cta';

export default function HomePage() {
  const { portfolio, slug } = usePortfolioContext();
  const { updatePortfolioTheme, portfolioTheme } = useTheme();

  useEffect(() => {
    if (portfolio) {
      updatePortfolioTheme(portfolio);
    }
  }, [portfolio, updatePortfolioTheme]);

  if (!portfolio) {
    return (
      <EmptyState
        title="Portfolio Not Found"
        description="The requested vendor portfolio does not exist."
      />
    );
  }

  const themeColor = portfolioTheme?.themeColor || '#000000';
  const hasGallery = portfolio?.gallery_images && portfolio.gallery_images.length > 0;
  const hasCarousel = portfolio?.carousel_images && portfolio.carousel_images.length > 0;
  const galleryImages = portfolio?.gallery_images || portfolio?.carousel_images || [];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: portfolioTheme?.backgroundColor || '#ffffff' }}>
      {/* Hero Section */}
      <HeroSection portfolio={portfolio} />

      {/* Featured Products Section - Premium Carousel */}
      {portfolio?.featured_products && portfolio.featured_products.length > 0 && (
        <SectionContainer variant="default">
          <LayoutContainer>
            <motion.div {...fadeInUp}>
              <div className="text-center mb-8 md:mb-12">
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                  style={{ color: themeColor, fontFamily: portfolioTheme?.fontFamily || 'inherit' }}
                >
                  Featured Products
                </h2>
                {portfolio?.show_pricing !== false && (
                  <p className="text-lg md:text-xl text-muted-foreground">
                    Discover our handpicked selection
                  </p>
                )}
              </div>
            </motion.div>

            {/* Premium Product Carousel */}
            <ProductCarousel
              products={portfolio.featured_products}
              showStockStatus={portfolio.show_stock_status !== false}
            />

            {/* View All Products CTA */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="text-center mt-8 md:mt-12"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{
                  backgroundColor: themeColor,
                  color: portfolioTheme?.accentColor || '#ffffff',
                }}
              >
                <Link href="/products" className="flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </LayoutContainer>
        </SectionContainer>
      )}

      {/* Gallery/Carousel Section */}
      {(hasGallery || hasCarousel) && (
        <SectionContainer variant="default" className="bg-muted/30">
          <LayoutContainer>
            <motion.div {...fadeInUp} className="text-center mb-8 md:mb-12">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: themeColor }}
              >
                {portfolio.is_carousel ? 'Gallery' : 'Our Work'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {portfolio.is_carousel ? 'Browse through our collection' : 'Explore our portfolio'}
              </p>
            </motion.div>

            <GalleryCarousel 
              images={galleryImages} 
              isCarousel={portfolio.is_carousel || false}
            />
          </LayoutContainer>
        </SectionContainer>
      )}

      {/* About/Story Section */}
      {(portfolio?.about_us || portfolio?.our_story || portfolio?.mission || portfolio?.vision) && (
        <SectionContainer variant="default">
          <LayoutContainer>
            <motion.div {...fadeInUp} className="text-center mb-8 md:mb-12">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: themeColor, fontFamily: portfolioTheme?.fontFamily || 'inherit' }}
              >
                Our Story
              </h2>
            </motion.div>

            <AboutSection portfolio={portfolio} />
          </LayoutContainer>
        </SectionContainer>
      )}

      {/* Optional Sections Renderer */}
      {portfolio?.sections && portfolio.sections.length > 0 && (
        <SectionContainer variant="default">
          <LayoutContainer>
            <SectionsRenderer sections={portfolio.sections} />
          </LayoutContainer>
        </SectionContainer>
      )}

      {/* Contact CTA Section */}
      <SectionContainer 
        variant="default" 
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${themeColor}15, ${portfolioTheme?.accentColor || '#ffffff'}15)`,
        }}
      >
        <LayoutContainer>
          <motion.div
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ color: themeColor }}
            >
              Get In Touch
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Have questions about our products? We'd love to help!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{
                  backgroundColor: themeColor,
                  color: portfolioTheme?.accentColor || '#ffffff',
                }}
              >
                <Link href="/contact" className="flex items-center gap-2">
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              {portfolio?.whatsapp_number && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold border-2"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  <a
                    href={`https://wa.me/${portfolio.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                </Button>
              )}

              {portfolio?.contact_phone && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold border-2"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  <a
                    href={`tel:${portfolio.contact_phone}`}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </LayoutContainer>
      </SectionContainer>

      {/* Sticky Mobile CTA */}
      <StickyCTA portfolio={portfolio} />
    </div>
  );
}




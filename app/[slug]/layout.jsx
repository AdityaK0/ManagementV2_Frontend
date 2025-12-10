// import { Navbar } from '@/components/shared/navbar';
// import { Footer } from '@/components/shared/footer';
// import { Metadata } from 'next';

// export async function generateMetadata({ params }) {
//   try {
//     const { slug } = await params; 
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/portfolio/public/${slug}/`
//     );
//     const portfolio = await response.json();

//     return {
//       title: `${portfolio.name} | Portfolio`,
//       description: portfolio.tagline,
//       openGraph: {
//         title: portfolio.name,
//         description: portfolio.tagline,
//         images: [portfolio.banner],
//       },
//     };
//   } catch (error) {
//     return {
//       title: 'Vendor Portfolio',
//       description: 'View vendor portfolio and products',
//     };
//   }
// }

// export default async function PortfolioLayout({ children, params }) {
//   const { slug } = await params; 
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar slug={params.slug} />
//       <main className="flex-1">
//         {children}
//       </main>
//       <Footer slug={params.slug} />
//     </div>
//   );
// }

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { PortfolioProvider } from '@/context/portfolioContext';
import { generatePortfolioMetadata, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
       { cache: "no-store" }
    );
    const portfolio = await response.json();

    return generatePortfolioMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Vendor Portfolio',
      description: 'View vendor portfolio and products',
    };
  }
}

export default async function PortfolioLayout({ children, params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch portfolio data ONCE - shared across all pages
  let portfolio = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    portfolio = await response.json();
  } catch (error) {
    console.error('Error fetching portfolio for layout:', error);
  }

  // Generate JSON-LD structured data
  const organizationSchema = generateOrganizationSchema(portfolio, slug);
  const websiteSchema = generateWebSiteSchema(portfolio, slug);

  return (
    <PortfolioProvider portfolio={portfolio} slug={slug}>
      {/* JSON-LD Structured Data */}
      {organizationSchema && <JsonLd data={organizationSchema} />}
      {websiteSchema && <JsonLd data={websiteSchema} />}
      
      <div className="flex flex-col min-h-screen">
        <Navbar slug={slug} portfolio={portfolio} />
        <main className="flex-1">{children}</main>
        <Footer slug={slug} portfolio={portfolio} />
      </div>
    </PortfolioProvider>
  );
}

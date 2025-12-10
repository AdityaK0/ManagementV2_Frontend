import { generateContactMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`,
      { cache: "no-store" }
    );
    const portfolio = await response.json();

    return generateContactMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating contact metadata:', error);
    return {
      title: 'Contact Us | Portfolio',
      description: 'Get in touch with us',
    };
  }
}

export default function ContactLayout({ children }) {
  return children;
}


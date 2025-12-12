export const runtime = 'edge';
'use client';

import { useTestimonials } from '@/hooks/api-hooks';
import { usePortfolioContext } from '@/context/portfolioContext';
import { useTheme } from '@/context/themeContext';
import { EmptyState } from '@/components/shared/loading-states';
import { TestimonialCard } from '@/components/shared/cards';
import { motion } from 'framer-motion';

export default function TestimonialsPage() {
  const { slug, portfolio } = usePortfolioContext();
  const { portfolioTheme } = useTheme();
  const { data: testimonials, isLoading } = useTestimonials(slug);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!testimonials?.length) {
    return (
      <EmptyState
        title="No Testimonials Yet"
        description="Be the first to share your experience with us!"
      />
    );
  }

  const themeColor = portfolioTheme?.themeColor || '#000000';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: portfolioTheme?.backgroundColor || '#ffffff' }}>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ color: themeColor, fontFamily: portfolioTheme?.fontFamily || 'inherit' }}
          >
            Client Testimonials
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our valued customers have to say about their experience with us.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
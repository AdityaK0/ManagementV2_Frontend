'use client';

import { usePortfolioContext } from '@/context/portfolioContext';
import { useTheme } from '@/context/themeContext';
import { EmptyState } from '@/components/shared/loading-states';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Target, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const { portfolio } = usePortfolioContext();
  const { portfolioTheme } = useTheme();

  if (!portfolio) {
    return (
      <EmptyState
        title="Portfolio Not Found"
        description="The requested vendor portfolio does not exist."
      />
    );
  }

  const themeColor = portfolioTheme?.themeColor || '#000000';
  const accentColor = portfolioTheme?.accentColor || '#ffffff';

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6 },
  };

  // Define sections with icons
  const sections = [
    {
      title: 'About Us',
      content: portfolio.about_us || portfolio.our_story,
      icon: Heart,
      gradient: `linear-gradient(135deg, ${themeColor}15, ${accentColor}15)`,
    },
    {
      title: 'Our Mission',
      content: portfolio.mission,
      icon: Target,
      gradient: `linear-gradient(135deg, ${accentColor}15, ${themeColor}15)`,
    },
    {
      title: 'Our Vision',
      content: portfolio.vision,
      icon: Eye,
      gradient: `linear-gradient(135deg, ${themeColor}15, ${accentColor}15)`,
    },
  ].filter(section => section.content); // Auto-hide empty sections

  return (
    <div className="min-h-screen" style={{ backgroundColor: portfolioTheme?.backgroundColor || '#ffffff' }}>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          {...fadeInUp}
        >
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ color: themeColor, fontFamily: portfolioTheme?.fontFamily || 'inherit' }}
          >
            About {portfolio.display_name || portfolio.business_name || portfolio.name}
          </h1>
          {portfolio.tagline && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {portfolio.tagline}
            </p>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          {/* About Image Section */}
          {(portfolio.about_image || portfolio.banner_image) && (
            <motion.div 
              className="relative aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Image
                src={portfolio.about_image || portfolio.banner_image}
                alt={portfolio.display_name || portfolio.business_name || 'About us'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>
          )}

          {/* Sections */}
          {sections.length > 0 && (
            <div className="space-y-8 md:space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    {...fadeInUp}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={cn(
                      'rounded-2xl p-6 md:p-10 lg:p-12 shadow-lg',
                    )}
                    style={{ background: section.gradient }}
                  >
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-md"
                        style={{ backgroundColor: themeColor }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <h2
                          className="text-2xl md:text-3xl lg:text-4xl font-bold"
                          style={{ color: themeColor }}
                        >
                          {section.title}
                        </h2>
                        <div className="prose prose-lg max-w-none">
                          {typeof section.content === 'string' ? (
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-line space-y-3">
                              {section.content.split('\n').map((paragraph, idx) => (
                                paragraph.trim() && (
                                  <p key={idx} className="text-base md:text-lg">
                                    {paragraph}
                                  </p>
                                )
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                              {section.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Divider with accent color */}
          {sections.length > 0 && (
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center py-8"
            >
              <div 
                className="h-1 w-24 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
            </motion.div>
          )}

          {/* Empty State if no sections */}
          {sections.length === 0 && (
            <motion.div
              {...fadeInUp}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No about information available at the moment.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
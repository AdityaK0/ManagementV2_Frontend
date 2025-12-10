'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/themeContext';
import { Heart, Target, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AboutSection({ portfolio }) {
  const { portfolioTheme, layoutStyle } = useTheme();

  const themeColor = portfolioTheme?.themeColor || '#000000';
  const accentColor = portfolioTheme?.accentColor || '#ffffff';

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6 },
  };

  const sections = [
    {
      title: 'Our Story',
      content: portfolio?.about_us || portfolio?.our_story,
      icon: Heart,
      gradient: `linear-gradient(135deg, ${themeColor}15, ${accentColor}15)`,
    },
    {
      title: 'Our Mission',
      content: portfolio?.mission,
      icon: Target,
      gradient: `linear-gradient(135deg, ${accentColor}15, ${themeColor}15)`,
    },
    {
      title: 'Our Vision',
      content: portfolio?.vision,
      icon: Eye,
      gradient: `linear-gradient(135deg, ${themeColor}15, ${accentColor}15)`,
    },
  ].filter(section => section.content);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-12 md:space-y-16">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            {...fadeInUp}
            transition={{ delay: index * 0.2 }}
            className={cn(
              'rounded-2xl p-8 md:p-12',
              layoutStyle === 'minimal' ? 'bg-transparent border border-border' : 'shadow-lg'
            )}
            style={{ background: section.gradient }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              {/* Icon */}
              <div
                className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <h2
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: themeColor }}
                >
                  {section.title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  {typeof section.content === 'string' ? (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
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
  );
}


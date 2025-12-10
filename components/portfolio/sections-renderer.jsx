'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/themeContext';
import { cn } from '@/lib/utils';
import { Play, Image as ImageIcon, FileText, MessageSquare } from 'lucide-react';

export function SectionsRenderer({ sections = [] }) {
  const { portfolioTheme } = useTheme();
  const themeColor = portfolioTheme?.themeColor || '#000000';

  if (!sections || sections.length === 0) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6 },
  };

  return (
    <div className="space-y-12 md:space-y-16">
      {sections.map((section, index) => {
        if (!section || !section.type) return null;

        switch (section.type) {
          case 'text':
            return (
              <motion.section
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="prose prose-lg max-w-none"
              >
                {section.title && (
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ color: themeColor }}
                  >
                    {section.title}
                  </h2>
                )}
                {section.content && (
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </motion.section>
            );

          case 'gallery':
            if (!section.images || section.images.length === 0) return null;
            return (
              <motion.section
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="space-y-6"
              >
                {section.title && (
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ color: themeColor }}
                  >
                    {section.title}
                  </h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.images.map((image, imgIndex) => (
                    <motion.div
                      key={imgIndex}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-md"
                    >
                      <Image
                        src={image.url || image}
                        alt={image.alt || `Gallery image ${imgIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );

          case 'testimonials':
            if (!section.testimonials || section.testimonials.length === 0) return null;
            return (
              <motion.section
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="space-y-6"
              >
                {section.title && (
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ color: themeColor }}
                  >
                    {section.title}
                  </h2>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.testimonials.map((testimonial, testIndex) => (
                    <motion.div
                      key={testIndex}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                    >
                      {testimonial.rating && (
                        <div className="flex text-yellow-400 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'fill-gray-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      {testimonial.message && (
                        <p className="text-muted-foreground mb-4">{testimonial.message}</p>
                      )}
                      {testimonial.name && (
                        <div className="flex items-center gap-3">
                          {testimonial.image && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            {testimonial.role && (
                              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );

          case 'video':
            if (!section.video_url) return null;
            // Extract YouTube video ID
            const getYouTubeId = (url) => {
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
              const match = url.match(regExp);
              return match && match[2].length === 11 ? match[2] : null;
            };

            const videoId = getYouTubeId(section.video_url);
            const embedUrl = videoId
              ? `https://www.youtube.com/embed/${videoId}`
              : section.video_url;

            return (
              <motion.section
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="space-y-6"
              >
                {section.title && (
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ color: themeColor }}
                  >
                    {section.title}
                  </h2>
                )}
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title={section.title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>
              </motion.section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}


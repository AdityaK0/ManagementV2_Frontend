'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/themeContext';
import { ArrowRight, MessageCircle, Instagram, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroSection({ portfolio }) {
  const { portfolioTheme } = useTheme();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const themeColor = portfolioTheme?.themeColor || '#000000';
  const accentColor = portfolioTheme?.accentColor || '#ffffff';

  const socialLinks = [
    { 
      icon: Instagram, 
      href: portfolio?.social_links?.instagram,
      label: 'Instagram'
    },
    { 
      icon: MessageCircle, 
      href: portfolio?.whatsapp_number ? `https://wa.me/${portfolio.whatsapp_number}` : null,
      label: 'WhatsApp'
    },
  ].filter(link => link.href);

  return (
    <div className="relative h-[70vh] min-h-[500px] md:h-[80vh] overflow-hidden">
      {/* Background Image with Parallax */}
      {portfolio?.banner_image && (
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={portfolio.banner_image}
            alt={portfolio.display_name || portfolio.business_name || 'Portfolio banner'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.3), ${themeColor}dd)`,
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Logo */}
          {portfolio?.logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden ring-4 ring-white/20 backdrop-blur-sm">
                <Image
                  src={portfolio.logo}
                  alt={portfolio.display_name || portfolio.business_name || 'Logo'}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </motion.div>
          )}

          {/* Display Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg"
            style={{ fontFamily: portfolioTheme?.fontFamily || 'inherit' }}
          >
            {portfolio?.display_name || portfolio?.business_name || 'Portfolio'}
          </motion.h1>

          {/* Tagline */}
          {portfolio?.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md"
            >
              {portfolio.tagline}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{
                backgroundColor: themeColor,
                color: accentColor,
              }}
            >
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                View Products
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            {/* Social Links */}
            {/* {socialLinks.map(({ icon: Icon, href, label }) => (
              <Button
                key={label}
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full w-14 h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              </Button>
            ))} */}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}


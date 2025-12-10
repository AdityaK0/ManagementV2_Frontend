'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, X, ShoppingBag, Mail } from 'lucide-react';
import { useTheme } from '@/context/themeContext';
import Link from 'next/link';

export function StickyCTA({ portfolio }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { portfolioTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 300px
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!portfolio || isDismissed) return null;

  const themeColor = portfolioTheme?.themeColor || '#000000';
  const accentColor = portfolioTheme?.accentColor || '#ffffff';

  const actions = [
    {
      label: 'Products',
      icon: ShoppingBag,
      href: '/products',
      isLink: true,
    },
    ...(portfolio.whatsapp_number
      ? [
          {
            label: 'WhatsApp',
            icon: MessageCircle,
            href: `https://wa.me/${portfolio.whatsapp_number}`,
            isLink: false,
          },
        ]
      : []),
    ...(portfolio.contact_phone
      ? [
          {
            label: 'Call',
            icon: Phone,
            href: `tel:${portfolio.contact_phone}`,
            isLink: false,
          },
        ]
      : []),
    {
      label: 'Contact',
      icon: Mail,
      href: '/contact',
      isLink: true,
    },
  ].slice(0, 3); // Show max 3 actions

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-white border-t shadow-2xl p-3 safe-area-inset-bottom">
            <div className="flex items-center justify-between gap-2">
              {actions.map((action, index) => {
                const Icon = action.icon;
                const content = (
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                );

                return (
                  <Button
                    key={index}
                    asChild
                    size="sm"
                    variant={index === 0 ? 'default' : 'outline'}
                    className="flex-1 rounded-xl h-auto py-2"
                    style={
                      index === 0
                        ? {
                            backgroundColor: themeColor,
                            color: accentColor,
                          }
                        : {
                            borderColor: themeColor,
                            color: themeColor,
                          }
                    }
                  >
                    {action.isLink ? (
                      <Link href={action.href} className="flex flex-col items-center gap-1">
                        {content}
                      </Link>
                    ) : (
                      <a
                        href={action.href}
                        target={action.href.startsWith('http') ? '_blank' : undefined}
                        rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex flex-col items-center gap-1"
                      >
                        {content}
                      </a>
                    )}
                  </Button>
                );
              })}

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => setIsDismissed(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


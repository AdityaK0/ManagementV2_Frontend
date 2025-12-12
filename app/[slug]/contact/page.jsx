

'use client';

import { usePortfolioContext } from '@/context/portfolioContext';
import { useTheme } from '@/context/themeContext';
import { EmptyState } from '@/components/shared/loading-states';
import { ContactForm } from '@/components/shared/contact-form';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const { portfolio, slug } = usePortfolioContext();
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

  // 🏠 Safely get address info
  const address = Array.isArray(portfolio.address) && portfolio.address.length > 0
    ? portfolio.address[0]
    : null;

  const formattedAddress = address
    ? `${address.street_address || ''}, ${address.city || ''}, ${address.state || ''}, ${address.postal_code || ''}, ${address.country || ''}`
    : null;

  // Build Google Maps URL
  const googleMapsUrl = formattedAddress
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(formattedAddress)}`
    : null;

  // 📞 Contact info - only show if available
  const contactInfo = [
    { icon: Phone, label: "Phone", value: portfolio.contact_phone, link: portfolio.contact_phone ? `tel:${portfolio.contact_phone}` : null },
    { icon: Mail, label: "Email", value: portfolio.contact_email, link: portfolio.contact_email ? `mailto:${portfolio.contact_email}` : null },
    { icon: MapPin, label: "Address", value: formattedAddress, link: null },
    { icon: MessageCircle, label: "WhatsApp", value: portfolio.whatsapp_number, link: portfolio.whatsapp_number ? `https://wa.me/${portfolio.whatsapp_number}` : null },
  ].filter(info => info.value); // Auto-hide empty contact info

  // 🌐 Social Links with hover animations
  const socialLinks = [
    { icon: Facebook, href: portfolio.social_links?.facebook, label: "Facebook", color: '#1877F2' },
    { icon: Twitter, href: portfolio.social_links?.twitter, label: "Twitter", color: '#1DA1F2' },
    { icon: Instagram, href: portfolio.social_links?.instagram, label: "Instagram", color: '#E4405F' },
    { icon: Linkedin, href: portfolio.social_links?.linkedin, label: "LinkedIn", color: '#0077B5' },
    { icon: Globe, href: portfolio.website, label: "Website", color: themeColor },
  ].filter(link => link.href);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: portfolioTheme?.backgroundColor || '#ffffff' }}>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            {...fadeUp}
          >
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: themeColor, fontFamily: portfolioTheme?.fontFamily || 'inherit' }}
            >
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to work with us? Get in touch!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <motion.div 
              className="space-y-8"
              {...fadeUp}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: themeColor }}>
                Get in Touch
              </h2>
              
              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, link }) => {
                  const content = link ? (
                    <a
                      href={link}
                      target={link.startsWith('http') ? '_blank' : undefined}
                      rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="hover:underline transition-colors"
                      style={{ color: link ? themeColor : undefined }}
                    >
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  );

                  return (
                    <motion.div
                      key={label}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                        style={{ backgroundColor: `${themeColor}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: themeColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">{label}</h3>
                        <p className="text-base text-gray-900">{content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Links with hover animations */}
              {socialLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                    Follow Us
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map(({ icon: Icon, href, label, color }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-all",
                          "hover:shadow-lg"
                        )}
                        style={{ backgroundColor: `${color}15` }}
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5" style={{ color: color }} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Map Preview */}
              {formattedAddress && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>
                    Find Us
                  </h3>
                  <div className="rounded-xl overflow-hidden shadow-lg aspect-video">
                    {googleMapsUrl && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={googleMapsUrl}
                        title="Location Map"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <div className="text-center p-4">
                          <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">{formattedAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.4 }}
              className="lg:sticky lg:top-8 lg:self-start"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: themeColor }}>
                  Send us a Message
                </h2>
                <ContactForm slug={slug} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

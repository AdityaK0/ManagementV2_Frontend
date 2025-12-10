'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer({ vendor, slug, portfolio }) {
  const currentYear = new Date().getFullYear();
  
  // Use portfolio data if available, fallback to vendor
  const displayData = portfolio || vendor;
  
  const socialLinks = [
    { icon: Facebook, href: displayData?.social_links?.facebook },
    { icon: Twitter, href: displayData?.social_links?.twitter },
    { icon: Instagram, href: displayData?.social_links?.instagram },
    { icon: Linkedin, href: displayData?.social_links?.linkedin },
  ].filter(link => link.href);

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {displayData?.display_name || displayData?.business_name || displayData?.name || 'Portfolio'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {displayData?.tagline || displayData?.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>

              <div className="grid grid-cols-2 gap-2">
                <Link href={`/`} className="text-sm hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href={`/products`} className="text-sm hover:text-primary transition-colors">
                  Products
                </Link>
                <Link href={`/collections`} className="text-sm hover:text-primary transition-colors">
                  Collections
                </Link>
                <Link href={`/about`} className="text-sm hover:text-primary transition-colors">
                  About
                </Link>
                <Link href={`/testimonials`} className="text-sm hover:text-primary transition-colors">
                  Testimonials
                </Link>
                <Link href={`/contact`} className="text-sm hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>


            {/*  SLUG HAS NOW BECAME THE PART OF THE SUBDOMAIN SO NO NEED TO DEPEND ON THE SLUG AFTER DOMAIN NAME */}
            {/* <div className="grid grid-cols-2 gap-2">
              <Link href={`/${slug}`} className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link href={`/${slug}/products`} className="text-sm hover:text-primary transition-colors">
                Products
              </Link>
              <Link href={`/${slug}/collections`} className="text-sm hover:text-primary transition-colors">
                Collections
              </Link>
              <Link href={`/${slug}/about`} className="text-sm hover:text-primary transition-colors">
                About
              </Link>
              <Link href={`/${slug}/testimonials`} className="text-sm hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link href={`/${slug}/contact`} className="text-sm hover:text-primary transition-colors">
                Contact
              </Link>
            </div> */}
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} {displayData?.display_name || displayData?.business_name || displayData?.name || 'Portfolio'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
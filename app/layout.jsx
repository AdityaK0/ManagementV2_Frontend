


import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/themeContext";
import QueryProvider from "@/components/QueryProvider"; // ✅ use the wrapper
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Vendor Portfolio",
    template: "%s | Vendor Portfolio",
  },
  description: "Discover amazing products from our vendors. Browse portfolios, collections, and shop from trusted vendors.",
  keywords: ["portfolio", "products", "vendor", "ecommerce", "shopping"],
  authors: [{ name: "Vendor Portfolio" }],
  creator: "Vendor Portfolio",
  publisher: "Vendor Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vendor Portfolio",
    title: "Vendor Portfolio",
    description: "Discover amazing products from our vendors",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendor Portfolio",
    description: "Discover amazing products from our vendors",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/themeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar({ vendor, slug, portfolio }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleDarkMode, portfolioTheme } = useTheme();

  const displayData = portfolio || vendor;

  const links = [
    { href: `/`, label: 'Home' },
    { href: `/products`, label: 'Products' },
    { href: `/collections`, label: 'Collections' },
    { href: `/about`, label: 'About' },
    { href: `/testimonials`, label: 'Testimonials' },
    { href: `/contact`, label: 'Contact' },
  ];

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between px-4 h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {displayData?.logo && (
              <Image
                src={displayData.logo}
                width={35}
                height={35}
                alt="Logo"
                className="rounded-full object-cover"
              />
            )}
            <span
              className="text-lg font-semibold"
              style={{ color: portfolioTheme?.themeColor }}
            >
              {displayData?.display_name || displayData?.business_name}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                // className="text-sm font-medium hover:text-primary transition"
                                className="text-sm font-medium hover:text-primary transition-colors relative group"
                
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              icon={isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu size={26} />
            </Button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sliding Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-background shadow-xl z-[60] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <span className="text-lg font-semibold">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-4 py-3 rounded-lg text-base hover:bg-accent transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* Footer */}
              <div className="border-t px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark Mode</span>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                    icon={isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useTheme } from '@/context/themeContext';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { Menu, X, Sun, Moon } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export function Navbar({ vendor, slug, portfolio }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const { isDarkMode, toggleDarkMode, portfolioTheme } = useTheme();
  
//   // Use portfolio data if available, fallback to vendor
//   const displayData = portfolio || vendor;


//   const links = [
//     { href: `/`, label: 'Home' },
//     { href: `/products`, label: 'Products' },
//     { href: `/collections`, label: 'Collections' },
//     { href: `/about`, label: 'About' },
//     { href: `/testimonials`, label: 'Testimonials' },
//     { href: `/contact`, label: 'Contact' },
//   ];

//   return (
//     <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             {displayData?.logo && (
//               <Image
//                 src={displayData.logo}
//                 alt={displayData.display_name || displayData.business_name || displayData.name || 'Logo'}
//                 width={32}
//                 height={32}
//                 className="rounded-full"
//               />
//             )}
//             <span 
//               className="font-semibold text-lg"
//               style={{ color: portfolioTheme?.themeColor }}
//             >
//               {displayData?.display_name || displayData?.business_name || displayData?.name || 'Portfolio'}
//             </span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="text-sm font-medium hover:text-primary transition-colors"
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <Switch
//               checked={isDarkMode}
//               onCheckedChange={toggleDarkMode}
//               icon={isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
//             />
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsOpen(!isOpen)}
//               className="relative"
//             >
//               {isOpen ? <X /> : <Menu />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden border-t"
//           >
//             <div className="container mx-auto px-4 py-4 space-y-4">
//               {links.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="block text-sm font-medium hover:text-primary transition-colors"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm">Dark Mode</span>
//                 <Switch
//                   checked={isDarkMode}
//                   onCheckedChange={toggleDarkMode}
//                   icon={isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }


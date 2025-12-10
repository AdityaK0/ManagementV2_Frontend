'use client';

import { useTheme } from '@/context/themeContext';
import { cn } from '@/lib/utils';

export function LayoutContainer({ children, className }) {
  const { layoutStyle } = useTheme();
  
  const layoutClasses = {
    modern: 'max-w-7xl mx-auto',
    classic: 'max-w-5xl mx-auto',
    minimal: 'max-w-6xl mx-auto',
    masonry: 'max-w-7xl mx-auto',
  };

  return (
    <div className={cn(layoutClasses[layoutStyle] || layoutClasses.modern, className)}>
      {children}
    </div>
  );
}

export function ProductGrid({ children, className }) {
  const { layoutStyle } = useTheme();
  
  // Responsive grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
  const gridClasses = {
    modern: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5',
    classic: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4',
    minimal: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4',
    masonry: 'columns-2 sm:columns-3 md:columns-4 gap-2 sm:gap-3 md:gap-4 space-y-2 sm:space-y-3 md:space-y-4',
  };

  if (layoutStyle === 'masonry') {
    return (
      <div className={cn(gridClasses.masonry, className)}>
        {Array.isArray(children) 
          ? children.map((child, index) => (
              <div key={index} className="break-inside-avoid mb-2 sm:mb-3 md:mb-4">
                {child}
              </div>
            ))
          : <div className="break-inside-avoid mb-2 sm:mb-3 md:mb-4">{children}</div>
        }
      </div>
    );
  }

  return (
    <div className={cn(gridClasses[layoutStyle] || gridClasses.modern, className)}>
      {children}
    </div>
  );
}

export function SectionContainer({ children, variant = 'default', className }) {
  const { layoutStyle, portfolioTheme } = useTheme();
  
  const variantClasses = {
    default: 'py-12 md:py-16 lg:py-20',
    hero: 'py-8 md:py-12 lg:py-16',
    compact: 'py-6 md:py-8',
  };

  const styleClasses = {
    modern: 'px-4 sm:px-6 lg:px-8',
    classic: 'px-4 sm:px-6',
    minimal: 'px-4 sm:px-6 lg:px-8',
    masonry: 'px-4 sm:px-6 lg:px-8',
  };

  const backgroundStyle = portfolioTheme?.backgroundColor 
    ? { backgroundColor: portfolioTheme.backgroundColor }
    : {};

  return (
    <section 
      className={cn(
        variantClasses[variant],
        styleClasses[layoutStyle] || styleClasses.modern,
        className
      )}
      style={backgroundStyle}
    >
      {children}
    </section>
  );
}


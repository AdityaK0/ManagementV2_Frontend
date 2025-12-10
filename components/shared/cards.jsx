'use client';

import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion,AnimatePresence } from 'framer-motion';
import { setProductCache } from '@/lib/productCache';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// import { PRODUCT_ENCODE } from '@/lib/productEncoder';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductCard({ product, slug, showStockStatus = true }) {
  const {
    name,
    images = [],
    price,
    category_name,
    is_in_stock,
    is_low_stock,
    vendor_name,
  } = product;
  const router = useRouter();

  const [current, setCurrent] = useState(0);

  const hasImages = images && images.length > 0;
  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleClick = () => {
    // Store product in memory
    setProductCache(product.id, product);

    // Navigate without encoding data
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer block group"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        <Card className="overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl bg-white h-full flex flex-col">
          {/* --- Image / Carousel --- */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
            {hasImages ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={images[current]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    {images && images[current] ? (
                      <Image
                        src={images[current]}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 w-1.5 rounded-full transition-all ${
                            idx === current ? 'bg-white w-4' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-xs">
                No Image
              </div>
            )}

            {/* Stock badge overlay - only show if showStockStatus is true */}
            {showStockStatus && (
              <div className="absolute top-2 left-2 z-10">
                <Badge
                  variant={
                    is_in_stock ? (is_low_stock ? 'secondary' : 'default') : 'destructive'
                  }
                  className="text-xs px-2 py-0.5 font-medium shadow-sm"
                >
                  {is_in_stock ? (is_low_stock ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                </Badge>
              </div>
            )}
          </div>

          {/* --- Product Info --- */}
          <CardContent className="p-3 sm:p-4 space-y-1.5 flex-1 flex flex-col">
            {name && (
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight text-gray-900">
                {name}
              </h3>
            )}

            {category_name && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {category_name}
              </p>
            )}

            {vendor_name && (
              <p className="text-xs text-gray-400 mt-auto pt-1 line-clamp-1">
                {vendor_name}
              </p>
            )}
          </CardContent>

          {/* --- Price --- */}
          {price && (
            <CardFooter className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                ₹{typeof price === 'number' ? price.toLocaleString('en-IN') : price}
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}



export function CollectionCard({ collection }) {
  const { name, cover_image_url, product_count } = collection;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-[16/9]">
            {/* <Image
              src={cover_image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            /> */}

              {cover_image_url  ? (
              <Image
                src={cover_image_url}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                <span>No Image Available</span>
              </div>
            )}



          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {product_count} {product_count === 1 ? 'Product' : 'Products'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialCard({ testimonial }) {
  const { name, image, rating, message } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <Image
                src={image}
                alt={name}
                fill
                className="rounded-full object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h4 className="font-semibold">{name}</h4>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}




// export function ProductCard({ product }) {
//   const { name, images, price, category, in_stock } = product;
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ scale: 1.02 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Card className="overflow-hidden">
//         <CardHeader className="p-0">
//           <div className="relative aspect-square">
//             {images && images.length > 0 ? (
//               <Image
//                 src={images[0]}
//                 alt={name}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               />
//             ) : (
//               <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
//                 <span>No Image Available</span>
//               </div>
//             )}
//           </div>

//         </CardHeader>
//         <CardContent className="p-4">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-semibold">{name}</h3>
//               <p className="text-sm text-muted-foreground">{category}</p>
//             </div>
//             <Badge variant={in_stock ? 'default' : 'secondary'}>
//               {in_stock ? 'In Stock' : 'Out of Stock'}
//             </Badge>
//           </div>
//         </CardContent>
//         <CardFooter className="p-4 pt-0">
//           <p className="text-lg font-bold">${price}</p>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }

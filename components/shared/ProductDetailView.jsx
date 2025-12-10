// components/shared/ProductDetailView.jsx
'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  Calendar,
  MessageCircle,
  Store,
  CheckCircle2,
  AlertCircle,
  Heart,
  ShoppingCart,
  Share2,
  ZoomIn,
  X,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { usePortfolioContext } from '@/context/portfolioContext';

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function ProductDetailView({ product }) {
  const { portfolio } = usePortfolioContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);


  if (!product) return <div>Loading...</div>;

  const {
    id,
    name,
    description,
    price,
    stock_quantity,
    vendor_name,
    category_name,
    category,
    meta_title,
    meta_description,
    images = [],
    is_in_stock,
    is_featured,
    created_at,
    is_active = true,
    gender,
    vendor_id,
    sizes
  } = product;

  // Filter valid images
  const validImages = images.filter((img) => img && img.trim() !== '');
  const hasImages = validImages.length > 0;
  const hasMultipleImages = validImages.length > 1;
  const displayCategory = category_name || category || '';
  const isLowStock = stock_quantity <= 5 && stock_quantity > 0;
  const formattedPrice = price
    ? `₹${parseFloat(price).toLocaleString('en-IN')}`
    : '';

  // Size options (you can make this dynamic later)
  const availableSizes = Array.isArray(sizes) ? sizes : [];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    setSelectedThumbnail((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
    setSelectedThumbnail(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  }, [validImages.length]);

  const selectImage = useCallback((index) => {
    setCurrentImageIndex(index);
    setSelectedThumbnail(index);
  }, []);

  const handleContact = (type) => {
    if (type === 'phone' && portfolio?.business_phone) {
      window.location.href = `tel:${portfolio.business_phone}`;
    } else if (type === 'whatsapp' && portfolio?.whatsapp_number) {
      const sizeText = selectedSize ? `\nSize: ${selectedSize}` : '';
      const msg = `Hi! I'm interested in ${name}.${sizeText}\nCan you share more details?\n\nLink: ${window.location.href}`;
      window.open(
        `https://wa.me/${portfolio.whatsapp_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${name} - ${formattedPrice}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShowShareDrawer(false);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Add your wishlist logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* --- Image Gallery Section --- */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200 group">
              {hasImages ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={validImages[currentImageIndex]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 cursor-zoom-in"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Image
                        src={validImages[currentImageIndex]}
                        alt={name || 'Product image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Zoom Button */}
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute bottom-4 right-4 bg-white/95 hover:bg-white rounded-full p-2.5 shadow-lg hover:scale-110 transition-transform z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Navigation Buttons */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-2.5 sm:p-3 shadow-xl hover:scale-110 transition-transform z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-2.5 sm:p-3 shadow-xl hover:scale-110 transition-transform z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                        {currentImageIndex + 1}/{validImages.length}
                      </div>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {is_featured && is_active && (
                      <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        <span className="text-sm font-semibold">Featured</span>
                      </div>
                    )}
                    {!is_active && (
                      <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Inactive</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedThumbnail === idx
                        ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${name} - Image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 20vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- Product Details Section --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Product Name & Meta */}
            <div className="space-y-3">
              {name && (
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {name}
                </h1>
              )}

              {/* Category & Vendor */}
              <div className="flex flex-wrap items-center gap-3">
                {/* {displayCategory && (
                  <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">{displayCategory}</span>
                  </div>
                )} */}
                {vendor_name && (
                  <div className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <span className="text-sm font-medium">{vendor_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Section */}
            {price && (
              <div className="flex items-baseline gap-3">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {formattedPrice}
                </p>
                {is_featured && is_active && (
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                )}
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>



            {/* Specifications */}
            {(displayCategory || gender) && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-gray-900">Specifications</h3>
                <div className="space-y-2">
                  {displayCategory && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900">{displayCategory}</span>
                    </div>
                  )}
                  {gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gender</span>
                      <span className="font-medium text-gray-900">{gender}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Store Branding Section */}
            {vendor_name && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Sold by</p>
                      <p className="font-semibold text-gray-900">{vendor_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-purple-300 hover:bg-purple-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit Store
                  </Button>
                </div>
              </div>
            )}



<AnimatePresence>
  {showSizePopup && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={() => setShowSizePopup(false)}
      />

      {/* Centered Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        // className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        //            bg-white w-11/12 max-w-md rounded-2xl p-6 z-50 shadow-xl"

        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           bg-white w-11/12 max-w-md rounded-2xl p-6 z-[9999] shadow-xl"

      >
        <h3 className="text-xl font-bold text-center mb-4">Select Size</h3>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 rounded-xl text-lg border-2 font-semibold ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full rounded-xl h-12 font-semibold bg-green-600 hover:bg-green-700"
          onClick={() => {
            if (availableSizes.length > 0 && !selectedSize) {
                setShowSizePopup(true);
                return;
            }
            handleContact("whatsapp");
          }}
        >
          Continue to WhatsApp
        </Button>
      </motion.div>
    </>
  )}
</AnimatePresence>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                className="w-full rounded-xl h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (availableSizes.length > 0) {
                    setShowSizePopup(true);
                  } else {
                    handleContact('whatsapp');
                  }
          }}

                >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order via WhatsApp
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-12 border-2"
                  onClick={toggleWishlist}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  Wishlist
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-12 border-2"
                  onClick={() => setShowShareDrawer(true)}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>




            
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {created_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    <span className="font-medium">Listed:</span>{' '}
                    {formatDate(created_at)}
                  </span>
                </div>
              )}
            </div>
            
          </motion.div>
        </div>
      </div>

      <div className="lg:hidden flex gap-3 mt-4">
  <Button
    variant="outline"
    size="lg"
    className="flex-1 rounded-xl h-12 border-2"
    onClick={toggleWishlist}
  >
    <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
    Wishlist
  </Button>

  <Button
    variant="outline"
    size="lg"
    className="flex-1 rounded-xl h-12 border-2"
    onClick={() => setShowShareDrawer(true)}
  >
    <Share2 className="w-5 h-5 mr-2" />
    Share
  </Button>
</div>


      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-600">Price</p>
            <p className="text-xl font-bold text-gray-900">{formattedPrice}</p>
          </div>
          <Button
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold shadow-lg bg-green-600 hover:bg-green-700"
            // onClick={() => handleContact('whatsapp')}
              onClick={() => {
                if (availableSizes.length > 0 && !selectedSize) {
                    setShowSizePopup(true);
                    return;
                }
                handleContact("whatsapp");
          }}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Order via WhatsApp
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl h-12 px-4 border-2"
            onClick={toggleWishlist}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={validImages[currentImageIndex]}
                alt={name || 'Product image'}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {validImages.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Drawer */}

      <AnimatePresence>
  {showShareDrawer && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={() => setShowShareDrawer(false)}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   bg-white w-11/12 max-w-md rounded-2xl p-6 z-50 shadow-xl"
      >
        <h3 className="text-xl font-bold text-center mb-6">Share Product</h3>

        <div className="space-y-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-green-600" />
            <span className="font-medium text-gray-900">WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare('facebook')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Share2 className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-900">Facebook</span>
          </button>

          <button
            onClick={() => handleShare('copy')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-6 h-6 text-green-600" />
                <span className="text-green-600 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 text-gray-600" />
                <span className="text-gray-900 font-medium">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>




    </div>
  );
}



// // components/shared/ProductDetailView.jsx
// 'use client';
// import { useState, useCallback } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Package,
//   Star,
//   Calendar,
//   MessageCircle,
//   Store,
//   CheckCircle2,
//   AlertCircle,
//   Heart,
//   ShoppingCart,
//   Share2,
// } from 'lucide-react';
// import { usePortfolioContext } from '@/context/portfolioContext';

// // Helper Functions
// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//   });
// };

// export default function ProductDetailView({ product }) {
//   const { portfolio } = usePortfolioContext();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [selectedThumbnail, setSelectedThumbnail] = useState(0);

//   if (!product) return <div>Loading...</div>;

//   const {
//     id,
//     name,
//     description,
//     price,
//     stock_quantity,
//     vendor_name,
//     category_name,
//     category,
//     meta_title,
//     meta_description,
//     images = [],
//     is_in_stock,
//     is_featured,
//     created_at,
//     is_active = true,
//   } = product;

//   // Filter valid images
//   const validImages = images.filter((img) => img && img.trim() !== '');
//   const hasImages = validImages.length > 0;
//   const hasMultipleImages = validImages.length > 1;
//   const displayCategory = category_name || category || '';
//   const isLowStock = stock_quantity <= 5 && stock_quantity > 0;
//   const formattedPrice = price
//     ? `₹${parseFloat(price).toLocaleString('en-IN')}`
//     : '';

//   const nextImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
//     setSelectedThumbnail((prev) => (prev + 1) % validImages.length);
//   }, [validImages.length]);

//   const prevImage = useCallback(() => {
//     setCurrentImageIndex(
//       (prev) => (prev - 1 + validImages.length) % validImages.length
//     );
//     setSelectedThumbnail(
//       (prev) => (prev - 1 + validImages.length) % validImages.length
//     );
//   }, [validImages.length]);

//   const selectImage = useCallback((index) => {
//     setCurrentImageIndex(index);
//     setSelectedThumbnail(index);
//   }, []);
//   const handleContact = (type) => {
//     if (type === 'phone' && portfolio?.business_phone) {
//       window.location.href = `tel:${portfolio.business_phone}`;
  
//     } else if (type === 'whatsapp' && portfolio?.whatsapp_number) {
  
//       const msg = `Hi! I'm interested in ${name}. 
//         Can you share more details?
        
        
//         Link: ${window.location.href}`;
        
//             window.open(
//                 `https://wa.me/${portfolio.whatsapp_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`,
//                 '_blank'
//             );
//             }           
//   };
  
  

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
//           {/* --- Image Gallery Section --- */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200 group">
//               {hasImages ? (
//                 <>
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={validImages[currentImageIndex]}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="absolute inset-0"
//                     >
//                       <Image
//                         src={validImages[currentImageIndex]}
//                         alt={name || 'Product image'}
//                         fill
//                         className="object-cover"
//                         sizes="(max-width: 1024px) 100vw, 50vw"
//                         priority
//                       />
//                     </motion.div>
//                   </AnimatePresence>

//                   {/* Navigation Buttons */}
//                   {hasMultipleImages && (
//                     <>
//                       <button
//                         onClick={prevImage}
//                         className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-2.5 sm:p-3 shadow-xl hover:scale-110 transition-transform z-10"
//                         aria-label="Previous image"
//                       >
//                         <ChevronLeft className="w-5 h-5 text-gray-700" />
//                       </button>
//                       <button
//                         onClick={nextImage}
//                         className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-2.5 sm:p-3 shadow-xl hover:scale-110 transition-transform z-10"
//                         aria-label="Next image"
//                       >
//                         <ChevronRight className="w-5 h-5 text-gray-700" />
//                       </button>

//                       {/* Image Counter */}
//                       <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
//                         {currentImageIndex + 1}/{validImages.length}
//                       </div>
//                     </>
//                   )}

//                   {/* Badges */}
//                   <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
//                     {is_featured && is_active && (
//                       <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
//                         <Star className="w-4 h-4 fill-white" />
//                         <span className="text-sm font-semibold">Featured</span>
//                       </div>
//                     )}
//                     {!is_active && (
//                       <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
//                         <AlertCircle className="w-4 h-4" />
//                         <span className="text-sm font-semibold">Inactive</span>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
//                   <Package className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}
//             </div>

//             {/* Thumbnail Gallery */}
//             {hasMultipleImages && (
//               <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
//                 {validImages.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => selectImage(idx)}
//                     className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedThumbnail === idx
//                         ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
//                         : 'border-gray-200 hover:border-gray-400'
//                     }`}
//                   >
//                     <Image
//                       src={img}
//                       alt={`${name} - Image ${idx + 1}`}
//                       fill
//                       className="object-cover"
//                       sizes="(max-width: 640px) 25vw, 20vw"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* --- Product Details Section --- */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="space-y-6"
//           >
//             {/* Product Name & Meta */}
//             <div className="space-y-3">
//               {name && (
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                   {name}
//                 </h1>
//               )}

//               {/* Category & Vendor */}
//               <div className="flex flex-wrap items-center gap-3">
//                 {displayCategory && (
//                   <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
//                     <Package className="w-4 h-4" />
//                     <span className="text-sm font-medium">{displayCategory}</span>
//                   </div>
//                 )}
//                 {vendor_name && (
//                   <div className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
//                     <Store className="w-4 h-4" />
//                     <span className="text-sm font-medium">{vendor_name}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Price Section */}
//             {price && (
//               <div className="flex items-baseline gap-3">
//                 <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
//                   {formattedPrice}
//                 </p>
//                 {is_featured && is_active && (
//                   <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
//                 )}
//               </div>
//             )}

//             {/* Stock Status */}
// {/*            <div className="flex items-center gap-3">
//               <div
//                 className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
//                   !is_in_stock || stock_quantity === 0
//                     ? 'bg-red-50 text-red-700'
//                     : isLowStock
//                     ? 'bg-amber-50 text-amber-700'
//                     : 'bg-emerald-50 text-emerald-700'
//                 }`}
//               >
//                 {!is_in_stock || stock_quantity === 0 ? (
//                   <>
//                     <AlertCircle className="w-5 h-5" />
//                     <span>Out of Stock</span>
//                   </>
//                 ) : isLowStock ? (
//                   <>
//                     <AlertCircle className="w-5 h-5" />
//                     <span>Low Stock: {stock_quantity} available</span>
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle2 className="w-5 h-5" />
//                     <span>In Stock: {stock_quantity} available</span>
//                   </>
//                 )}
//               </div>
//             </div> */}

//             {/* Description */}
//             {description && (
//               <div className="space-y-2">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Description
//                 </h2>
//                 <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
//                   {description}
//                 </p>
//               </div>
//             )}

//             {/* Product Info Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
//               {created_at && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Calendar className="w-4 h-4 text-gray-400" />
//                   <span>
//                     <span className="font-medium">Created:</span>{' '}
//                     {formatDate(created_at)}
//                   </span>
//                 </div>
//               )}
//               {meta_title && (
//                 <div className="text-sm text-gray-600">
//                   <span className="font-medium">Meta Title:</span>{' '}
//                   <span>{meta_title}</span>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <Button
//                 size="lg"
//                 className="flex-1 rounded-xl h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
//                 onClick={() => handleContact('whatsapp')}
//               >
//                 <MessageCircle className="w-5 h-5 mr-2" />
//                 WhatsApp Us
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="flex-1 sm:flex-initial rounded-xl h-12 px-6 border-2"
//               >
//                 <Heart className="w-5 h-5 mr-2" />
//                 Wishlist
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="flex-1 sm:flex-initial rounded-xl h-12 px-6 border-2"
//               >
//                 <Share2 className="w-5 h-5 mr-2" />
//                 Share
//               </Button>
//             </div>


//             {/* Additional Info */}
//             {/* {meta_description && (
//               <div className="pt-4 border-t border-gray-200">
//                 <p className="text-xs text-gray-500 leading-relaxed">
//                   {meta_description}
//                 </p>
//               </div>
//             )} */}
//           </motion.div>


          
//         </div>

        
//       </div>
//     </div>
//   );
// }

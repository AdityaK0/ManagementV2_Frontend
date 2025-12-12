export const runtime = 'edge';
'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/api-hooks';
import { usePortfolioContext } from '@/context/portfolioContext';
import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
import { ProductCard } from '@/components/shared/cards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/shared/Pagination';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const { slug, portfolio } = usePortfolioContext();

  // Simplified state - single source of truth
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    min_price: '',
    max_price: ''
  });
  
  const [tempFilters, setTempFilters] = useState({
    search: '',
    min_price: '',
    max_price: ''
  });
  
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  // Single API call with all params - much simpler!
  const { data, isLoading, isFetching } = useProducts(slug, {
    page,
    search: appliedFilters.search,
    min_price: appliedFilters.min_price,
    max_price: appliedFilters.max_price,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const handleApplyFilters = (e) => {
    e?.preventDefault();
    setAppliedFilters(tempFilters);
  };

  const handleClearFilters = () => {
    const cleared = { search: '', min_price: '', max_price: '' };
    setTempFilters(cleared);
    setAppliedFilters(cleared);
  };

  const handleInputChange = (field, value) => {
    setTempFilters(prev => ({ ...prev, [field]: value }));
  };

  const removeFilter = (field) => {
    const updated = { ...appliedFilters, [field]: '' };
    setAppliedFilters(updated);
    setTempFilters(updated);
  };

  const hasActiveFilters = appliedFilters.search || appliedFilters.min_price || appliedFilters.max_price;
  const hasUnappliedChanges = JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);
  const activeFilterCount = [appliedFilters.search, appliedFilters.min_price, appliedFilters.max_price]
    .filter(Boolean).length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && !showFilters && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, description, or SKU..."
                    value={tempFilters.search}
                    onChange={(e) => handleInputChange('search', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <Input
                  type="number"
                  placeholder="₹ 0"
                  value={tempFilters.min_price}
                  onChange={(e) => handleInputChange('min_price', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <Input
                  type="number"
                  placeholder="₹ 10000"
                  value={tempFilters.max_price}
                  onChange={(e) => handleInputChange('max_price', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <Button 
                  onClick={handleApplyFilters}
                  className="flex-1"
                  disabled={!hasUnappliedChanges}
                >
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {appliedFilters.search && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                Search: "{appliedFilters.search}"
                <button
                  onClick={() => removeFilter('search')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.min_price && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                Min: ₹{appliedFilters.min_price}
                <button
                  onClick={() => removeFilter('min_price')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.max_price && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                Max: ₹{appliedFilters.max_price}
                <button
                  onClick={() => removeFilter('max_price')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isFetching && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

  {/* Products Grid: responsive grid (2 cols mobile, 3 tablet, 4 desktop) */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {!data?.results?.length ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <EmptyState
              title="No Products Found"
              description={hasActiveFilters 
                ? "Try adjusting your filters to see more results." 
                : "No products available at the moment."}
              className="text-center max-w-md"
            />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {data.results.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard 
                  product={product} 
                  showStockStatus={portfolio?.show_stock_status !== false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {data?.results?.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={data?.total_pages || 1}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}


// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useProducts, useProductsFilter } from '@/hooks/api-hooks';
// // import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
// // import { ProductCard } from '@/components/shared/cards';
// // import { Input } from '@/components/ui/input';
// // import { Button } from '@/components/ui/button';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import Pagination from '@/components/shared/Pagination';
// // import { use } from 'react';

// // export default function ProductsPage({ params }) {
// //   const { slug } = use(params);

// //   // 🧠 UI States
// //   const [page, setPage] = useState(1);
// //   const [search, setSearch] = useState('');
// //   const [filters, setFilters] = useState({ min_price: '', max_price: '' });
// //   const [category, setCategory] = useState('');
// //   const [mode, setMode] = useState('default'); // 'default' | 'filter'

// //   // 🧩 API Hooks
// //   const productsQuery = useProducts(slug, { page, search, category },{ enabled: mode === 'default' });
// //   const filterQuery = useProductsFilter(slug, { page, ...filters },{ enabled: mode === 'filter' });

// //   // Pick which query to show
// //   const activeQuery = mode === 'filter' ? filterQuery : productsQuery;
// //   const { data, isLoading, isFetching } = activeQuery;

// //   // ✅ Reset page when switching mode or params
// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, category, filters.min_price, filters.max_price, mode]);


// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, category, mode]);

// //   // 🔍 Search handler
// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     const q = e.target.search.value.trim();
// //     setSearch(q);
// //     setMode('default'); // search handled by same /products endpoint
// //   };

// //   // 🎛 Filter handler
// //   const handleFilterSubmit = (e) => {
// //     e.preventDefault();
// //     if (!filters.min_price && !filters.max_price) {
// //       setMode('default');
// //     } else {
// //       setMode('filter');
// //     }
// //   };

// //   const handleFilterChange = (e) => {
// //     const { name, value } = e.target;
// //     setFilters((prev) => ({ ...prev, [name]: value }));
// //   };

// //   if (isLoading || isFetching) return <LoadingSpinner />;



// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       {/* 🔍 Search Form */}
// //       <div className="mb-8 space-y-6">
// //         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
// //           <Input
// //             name="search"
// //             placeholder="Search products..."
// //             defaultValue={search}
// //             className="sm:max-w-sm flex-1"
// //           />
// //           <Button type="submit" className="w-full sm:w-auto">
// //             Search
// //           </Button>
// //         </form>

// //         {/* 🎛 Filters */}
// //         <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium text-secondary-700 mb-1">
// //               Min Price
// //             </label>
// //             <Input
// //               type="number"
// //               name="min_price"
// //               value={filters.min_price}
// //               onChange={handleFilterChange}
// //               placeholder="1000"
// //               className="w-full"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-secondary-700 mb-1">
// //               Max Price
// //             </label>
// //             <Input
// //               type="number"
// //               name="max_price"
// //               value={filters.max_price}
// //               onChange={handleFilterChange}
// //               placeholder="5000"
// //               className="w-full"
// //             />
// //           </div>

// //           <div className="flex items-end">
// //             <Button type="submit" className="w-full sm:w-auto">
// //               Apply Filters
// //             </Button>
// //           </div>
// //         </form>
// //       </div>

// //       {/* 🧱 Products Grid */}


// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
// //   {!data?.results?.length ? (
// //     <div className="col-span-full flex flex-col items-center justify-center py-20">
// //       <EmptyState
// //         title="No Products Found"
// //         description="Try adjusting your search or filters."
// //         className="text-center max-w-md"
// //       />
// //     </div>
// //   ) : (
// //     <AnimatePresence mode="popLayout">
// //       {data.results.map((product) => (
// //         <motion.div
// //           key={product.id}
// //           layout
// //           initial={{ opacity: 0, scale: 0.9 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           exit={{ opacity: 0, scale: 0.9 }}
// //           transition={{ duration: 0.2 }}
// //         >
// //           <ProductCard product={product} />
// //         </motion.div>
// //       ))}
// //     </AnimatePresence>
// //   )}
// // </div>


// //       {/* 🔁 Pagination — always calls the correct query based on current mode */}
// //       <Pagination
// //         currentPage={page}
// //         totalPages={data.total_pages}
// //         onPageChange={(newPage) => setPage(newPage)}
// //       />
// //     </div>
// //   );
// // }

// 'use client';
// import { useState, useEffect } from 'react';
// import { useProducts, useProductsFilter } from '@/hooks/api-hooks';
// import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
// import { ProductCard } from '@/components/shared/cards';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { motion, AnimatePresence } from 'framer-motion';
// import Pagination from '@/components/shared/Pagination';
// import { use } from 'react';

// export default function ProductsPage({ params }) {
//   const { slug } = use(params);

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [filters, setFilters] = useState({ min_price: '', max_price: '' });
//   const [tempFilters, setTempFilters] = useState({ min_price: '', max_price: '' });

//   const [category, setCategory] = useState('');
//   const [mode, setMode] = useState('default'); // 'default' | 'filter'

//   // 🔥 Enable only one query at a time
//   const productsQuery = useProducts(
//     slug,
//     { page, search, category },
//     { enabled: mode === 'default' }
//   );

//   const filterQuery = useProductsFilter(
//     slug,
//     { page, ...filters },
//     { enabled: mode === 'filter' }
//   );

//   const activeQuery = mode === 'filter' ? filterQuery : productsQuery;
//   const { data, isLoading, isFetching } = activeQuery;

//   useEffect(() => {
//     setPage(1);
//   }, [search, category, mode,filters.min_price, filters.max_price]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const q = e.target.search.value.trim();
//     setSearch(q);
//     setMode('default');
//     setPage(1);
//   };

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setFilters(tempFilters);
//     const hasFilters = tempFilters.min_price || tempFilters.max_price;
//     setMode(hasFilters ? 'filter' : 'default');
//     setPage(1);
//   };

//   // const handleFilterChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFilters((prev) => ({ ...prev, [name]: value }));
//   // };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setTempFilters((prev) => ({ ...prev, [name]: value }));
//   };


//   if (isLoading || isFetching) return <LoadingSpinner />;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* 🔍 Search */}
//       <div className="mb-8 space-y-6">
//         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//           <Input
//             name="search"
//             placeholder="Search products..."
//             defaultValue={search}
//             className="sm:max-w-sm flex-1"
//           />
//           <Button type="submit" className="w-full sm:w-auto">
//             Search
//           </Button>
//         </form>

//         {/* 🎛 Filters */}
//         <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Min Price</label>
//             <Input
//               type="number"
//               name="min_price"
//               value={tempFilters.min_price}
//               onChange={handleFilterChange}
//               placeholder="1000"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Max Price</label>
//             <Input
//               type="number"
//               name="max_price"
//               value={tempFilters.max_price}
//               onChange={handleFilterChange}
//               placeholder="5000"
//             />
//           </div>

//           <div className="flex items-end">
//             <Button type="submit" className="w-full sm:w-auto">
//               Apply Filters
//             </Button>
//           </div>
//         </form>
//       </div>

//       {/* 🧱 Products */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
//         {!data?.results?.length ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-20">
//             <EmptyState
//               title="No Products Found"
//               description="Try adjusting your search or filters."
//               className="text-center max-w-md"
//             />
//           </div>
//         ) : (
//           <AnimatePresence mode="popLayout">
//             {data.results.map((product) => (
//               <motion.div
//                 key={product.id}
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ProductCard product={product} />
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* 🔁 Pagination */}
//       <Pagination
//         currentPage={page}
//         totalPages={data?.total_pages || 1}
//         onPageChange={(newPage) => setPage(newPage)}
//       />
//     </div>
//   );
// }

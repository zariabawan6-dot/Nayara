import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  X,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { supabase } from "../api/supabase";
import { getOptimizedImageUrl } from "../lib/imageUtils";

const ITEMS_PER_PAGE = 14;

const FilterSection = ({ title, options, selected, onSelect }) => {
  return (
    <div className="space-y-3 font-body">
      <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-widest">
        {title}
      </h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <button
              onClick={() => onSelect(option)}
              className={`text-sm flex items-center gap-3 transition-colors ${
                selected === option
                  ? "text-[#111827] font-semibold"
                  : "text-gray-500 hover:text-[#D4AF37]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                  selected === option
                    ? "bg-[#111827] border-[#111827] text-white"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                {selected === option && <span className="text-[10px]">✓</span>}
              </span>
              {option}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCollection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fabric: [],
    collection: [],
    category: [],
    priceRange: ["Under 3000", "3000 - 6000", "6000 - 10000", "Above 10000"],
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(file_path)")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        if (error) throw error;

        const normalizedProducts = data.map((item) => {
          const mappedUrls = item.product_images?.map(img => getOptimizedImageUrl(img.file_path)) || [];
          return {
            ...item,
            images_urls: mappedUrls,
            image: mappedUrls.length > 0 ? mappedUrls[0] : "",
          };
        });

        setProducts(normalizedProducts);

        const uniqueCategories = [
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ].sort();

        const uniqueFabrics = [
          ...new Set(data.map((item) => item.fabric).filter(Boolean)),
        ].sort();

        const dbCollections = [
          ...new Set(data.map((item) => item.collection).filter(Boolean)),
        ].sort();

        setFilters((prev) => ({
          ...prev,
          category: uniqueCategories,
          fabric: uniqueFabrics,
          collection: dbCollections,
        }));
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Unable to load products. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const activeCategory = searchParams.get("category");
  const activeFabric = searchParams.get("fabric");
  const activeCollection = searchParams.get("collection");
  const activePrice = searchParams.get("priceRange");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "latest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (key !== "page") newParams.set("page", "1");
    if (newParams.get(key) === value && key !== "page") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => setSearchParams(new URLSearchParams());

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(lowerQ)) ||
          (p.category && p.category.toLowerCase().includes(lowerQ))
      );
    }

    if (activeFabric) {
      result = result.filter((p) => p.fabric === activeFabric);
    }

    if (activeCollection) {
      result = result.filter((p) => p.collection === activeCollection);
    }

    if (activeCategory) result = result.filter((p) => p.category === activeCategory);

    if (activePrice) {
      if (activePrice === "Under 3000") result = result.filter((p) => p.discount_price < 3000);
      else if (activePrice === "3000 - 6000") result = result.filter((p) => p.discount_price >= 3000 && p.discount_price <= 6000);
      else if (activePrice === "6000 - 10000") result = result.filter((p) => p.discount_price > 6000 && p.discount_price <= 10000);
      else if (activePrice === "Above 10000") result = result.filter((p) => p.discount_price > 10000);
    }

    if (sortBy === "price_low") result.sort((a, b) => a.discount_price - b.discount_price);
    else if (sortBy === "price_high") result.sort((a, b) => b.discount_price - a.discount_price);
    else result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return result;
  }, [products, activeCategory, activeFabric, activeCollection, activePrice, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (safeCurrentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const activeFiltersCount = [activeCategory, activeFabric, activeCollection, activePrice].filter(Boolean).length;

  return (
    <section className="bg-[#FAF8F3] min-h-screen pt-10 pb-20 font-body text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* --- HEADER SECTION --- */}
        <div className="mb-8 pb-6 border-b border-[#E5E7EB]">
          <div className="mb-6">
            <p className="text-[#D4AF37] uppercase tracking-widest text-[10px] sm:text-xs font-semibold mb-1">
              Discover
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-4xl md:text-5xl font-display text-[#111827]">
                {activeFabric ? activeFabric : activeCollection ? activeCollection : "Shop All"}
              </h1>
              <p className="text-gray-400 text-xs font-body uppercase tracking-widest">
                {!isLoading && `${filteredProducts.length} products`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-sm text-sm w-full focus:outline-none focus:border-[#D4AF37] transition-colors"
                value={searchQuery}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#E5E7EB] rounded-sm text-sm w-44 cursor-pointer focus:outline-none focus:border-[#D4AF37] text-gray-700"
                value={sortBy}
                onChange={(e) => updateFilter("sort", e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center gap-2 bg-[#111827] text-white py-2.5 px-5 rounded-sm text-xs uppercase tracking-widest font-semibold"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={13} /> Filters
              {activeFiltersCount > 0 && (
                <span className="bg-[#D4AF37] text-[#111827] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* --- ACTIVE FILTERS TAGS --- */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Active:</span>
            {[
              { label: activeCategory, key: "category" },
              { label: activeFabric, key: "fabric" },
              { label: activeCollection, key: "collection" },
              { label: activePrice, key: "priceRange" },
            ].map(
              (filter) =>
                filter.label && (
                  <button
                    key={filter.label}
                    onClick={() => updateFilter(filter.key, filter.label)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111827] text-white rounded-sm text-[10px] uppercase tracking-widest font-medium hover:bg-black transition-colors"
                  >
                    {filter.label} <X size={10} />
                  </button>
                )
            )}
            <button
              onClick={clearAllFilters}
              className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] font-semibold transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* --- MAIN LAYOUT: Sidebar + Grid --- */}
        <div className="flex gap-10 lg:gap-14 items-start">

          {/* SIDEBAR (Desktop) */}
          <aside className="hidden md:block w-48 shrink-0 sticky top-24 self-start space-y-8">
            {filters.fabric.length > 0 && (
              <>
                <FilterSection
                  title="Fabric"
                  options={filters.fabric}
                  selected={activeFabric}
                  onSelect={(val) => updateFilter("fabric", val)}
                />
                <div className="h-px bg-[#E5E7EB] w-full" />
              </>
            )}
            {filters.collection.length > 0 && (
              <>
                <FilterSection
                  title="Collection"
                  options={filters.collection}
                  selected={activeCollection}
                  onSelect={(val) => updateFilter("collection", val)}
                />
                <div className="h-px bg-[#E5E7EB] w-full" />
              </>
            )}
            {filters.category.length > 0 && (
              <>
                <FilterSection
                  title="Category"
                  options={filters.category}
                  selected={activeCategory}
                  onSelect={(val) => updateFilter("category", val)}
                />
                <div className="h-px bg-[#E5E7EB] w-full" />
              </>
            )}
            <FilterSection
              title="Price"
              options={filters.priceRange}
              selected={activePrice}
              onSelect={(val) => updateFilter("priceRange", val)}
            />
          </aside>

          {/* PRODUCT GRID */}
          <main className="flex-1 min-w-0">

            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64 text-[#D4AF37]">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-sm font-medium tracking-widest uppercase text-[#111827]">
                  Loading collection...
                </p>
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="flex items-center justify-center p-6 bg-red-50 text-red-600 rounded-sm border border-red-100">
                <AlertCircle className="mr-2" size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-sm border border-[#E5E7EB]">
                <p className="text-gray-500 text-base font-body mb-6">
                  No products match your criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-[#111827] border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors font-semibold uppercase tracking-widest text-xs"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Grid */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center items-center gap-2">
                    <button
                      onClick={() => updateFilter("page", safeCurrentPage - 1)}
                      disabled={safeCurrentPage === 1}
                      className={`p-2 rounded-sm border transition-all ${
                        safeCurrentPage === 1
                          ? "text-gray-300 border-transparent cursor-not-allowed"
                          : "text-[#111827] border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white"
                      }`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1 mx-2">
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === "..." ? (
                            <span className="px-2 text-gray-400 text-sm">...</span>
                          ) : (
                            <button
                              onClick={() => updateFilter("page", page)}
                              className={`w-9 h-9 flex items-center justify-center rounded-sm text-xs font-semibold transition-all ${
                                safeCurrentPage === page
                                  ? "bg-[#111827] text-white"
                                  : "text-gray-600 bg-white border border-transparent hover:border-[#D4AF37] hover:text-[#D4AF37]"
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={() => updateFilter("page", safeCurrentPage + 1)}
                      disabled={safeCurrentPage === totalPages}
                      className={`p-2 rounded-sm border transition-all ${
                        safeCurrentPage === totalPages
                          ? "text-gray-300 border-transparent cursor-not-allowed"
                          : "text-[#111827] border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-[85%] max-w-sm bg-white ml-auto h-full shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] bg-[#FAF8F3]">
              <h2 className="font-display text-xl text-[#111827] uppercase tracking-widest">Filters</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-8 space-y-10 flex-1">
              {filters.fabric.length > 0 && (
                <FilterSection
                  title="Fabric"
                  options={filters.fabric}
                  selected={activeFabric}
                  onSelect={(val) => { updateFilter("fabric", val); setIsMobileFilterOpen(false); }}
                />
              )}
              {filters.collection.length > 0 && (
                <FilterSection
                  title="Collection"
                  options={filters.collection}
                  selected={activeCollection}
                  onSelect={(val) => { updateFilter("collection", val); setIsMobileFilterOpen(false); }}
                />
              )}
              {filters.category.length > 0 && (
                <FilterSection
                  title="Category"
                  options={filters.category}
                  selected={activeCategory}
                  onSelect={(val) => { updateFilter("category", val); setIsMobileFilterOpen(false); }}
                />
              )}
              <FilterSection
                title="Price"
                options={filters.priceRange}
                selected={activePrice}
                onSelect={(val) => { updateFilter("priceRange", val); setIsMobileFilterOpen(false); }}
              />
            </div>

            <div className="sticky bottom-0 p-6 bg-white border-t border-[#E5E7EB]">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-colors"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCollection;






// import React, { useState, useEffect, useMemo } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//   X,
//   Search,
//   SlidersHorizontal,
//   ArrowUpDown,
//   Loader2,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import ProductCard from "../components/ProductCard";
// import { supabase } from "../api/supabase";
// import { getOptimizedImageUrl } from "../lib/imageUtils";

// const ITEMS_PER_PAGE = 9;

// const FilterSection = ({ title, options, selected, onSelect }) => {
//   return (
//     <div className="space-y-3 font-body">
//       <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-widest">
//         {title}
//       </h3>
//       <div className="space-y-2">
//         {options.map((option) => (
//           <div key={option} className="flex items-center">
//             <button
//               onClick={() => onSelect(option)}
//               className={`text-sm flex items-center gap-3 transition-colors ${
//                 selected === option
//                   ? "text-[#111827] font-semibold"
//                   : "text-gray-500 hover:text-[#D4AF37]"
//               }`}
//             >
//               <span
//                 className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
//                   selected === option
//                     ? "bg-[#111827] border-[#111827] text-white"
//                     : "border-[#E5E7EB] bg-white"
//                 }`}
//               >
//                 {selected === option && <span className="text-[10px]">✓</span>}
//               </span>
//               {option}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ProductCollection = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // const [filters, setFilters] = useState({
//   //   collection: [],
//   //   category: [],
//   //   priceRange: ["Under 3000", "3000 - 6000", "6000 - 10000", "Above 10000"],
//   // });
//   const [filters, setFilters] = useState({
//   collection: ["New Arrivals", "Summer Classics", "Winter Luxury"],
//   category: [],
//   priceRange: ["Under 3000", "3000 - 6000", "6000 - 10000", "Above 10000"],
// });

//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         setIsLoading(true);
//         const { data, error } = await supabase
//           .from("products")
//           .select("*, product_images(file_path)")
//           .eq("is_published", true)   //added 
//           .order("created_at", { ascending: false });
//         if (error) throw error;

//         const normalizedProducts = data.map((item) => {
//           const mappedUrls = item.product_images?.map(img => getOptimizedImageUrl(img.file_path)) || [];
//           return {
//             ...item,
//             images_urls: mappedUrls,
//             image: mappedUrls.length > 0 ? mappedUrls[0] : "",
//           };
//         });

//         setProducts(normalizedProducts);

//         const uniqueCategories = [
//           ...new Set(data.map((item) => item.category).filter(Boolean)),
//         ].sort();

//         const dbCollections = [
//           ...new Set(
//             data.map((item) => item.collection).filter((c) => c && c !== "New Arrivals")
//           ),
//         ].sort();

//         setFilters((prev) => ({
//           ...prev,
//           category: uniqueCategories,
//           collection: ["New Arrivals", ...dbCollections],
//         }));
//       } catch (err) {
//         console.error("Error fetching inventory:", err);
//         setError("Unable to load products. Please check your connection.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInventory();
//   }, []);

//   const activeCategory = searchParams.get("category");
//   const activeCollection = searchParams.get("collection");
//   const activePrice = searchParams.get("priceRange");
//   const searchQuery = searchParams.get("search") || "";
//   const sortBy = searchParams.get("sort") || "latest";
//   const currentPage = parseInt(searchParams.get("page") || "1", 10);

//   const updateFilter = (key, value) => {
//     const newParams = new URLSearchParams(searchParams);
//     if (key !== "page") newParams.set("page", "1");
//     if (newParams.get(key) === value && key !== "page") {
//       newParams.delete(key);
//     } else {
//       newParams.set(key, value);
//     }
//     setSearchParams(newParams);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const clearAllFilters = () => setSearchParams(new URLSearchParams());

//   const filteredProducts = useMemo(() => {
//     let result = [...products];

//     if (searchQuery) {
//       const lowerQ = searchQuery.toLowerCase();
//       result = result.filter(
//         (p) =>
//           (p.name && p.name.toLowerCase().includes(lowerQ)) ||
//           (p.category && p.category.toLowerCase().includes(lowerQ))
//       );
//     }

//     if (activeCollection) {
//       if (activeCollection === "New Arrivals") {
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//         result = result.filter((p) => new Date(p.created_at) >= thirtyDaysAgo);
//       } else {
//         result = result.filter((p) => p.collection === activeCollection);
//       }
//     }

//     if (activeCategory) result = result.filter((p) => p.category === activeCategory);

//     if (activePrice) {
//       if (activePrice === "Under 3000") result = result.filter((p) => p.discount_price < 3000);
//       else if (activePrice === "3000 - 6000") result = result.filter((p) => p.discount_price >= 3000 && p.discount_price <= 6000);
//       else if (activePrice === "6000 - 10000") result = result.filter((p) => p.discount_price > 6000 && p.discount_price <= 10000);
//       else if (activePrice === "Above 10000") result = result.filter((p) => p.discount_price > 10000);
//     }

//     if (sortBy === "price_low") result.sort((a, b) => a.discount_price - b.discount_price);
//     else if (sortBy === "price_high") result.sort((a, b) => b.discount_price - a.discount_price);
//     else result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//     return result;
//   }, [products, activeCategory, activeCollection, activePrice, searchQuery, sortBy]);

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//   const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

//   const paginatedProducts = useMemo(() => {
//     const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
//     return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredProducts, safeCurrentPage]);

//   const getPageNumbers = () => {
//     const pages = [];
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (safeCurrentPage <= 3) {
//         pages.push(1, 2, 3, 4, "...", totalPages);
//       } else if (safeCurrentPage >= totalPages - 2) {
//         pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages);
//       }
//     }
//     return pages;
//   };

//   const activeFiltersCount = [activeCategory, activeCollection, activePrice].filter(Boolean).length;

//   return (
//     <section className="bg-[#FAF8F3] min-h-screen pt-10 pb-20 font-body text-[#111827]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

//         {/* --- HEADER SECTION --- */}
//         <div className="mb-8 pb-6 border-b border-[#E5E7EB]">
//           {/* Title row */}
//           <div className="mb-6">
//             <p className="text-[#D4AF37] uppercase tracking-widest text-[10px] sm:text-xs font-semibold mb-1">
//               Discover
//             </p>
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//               <h1 className="text-4xl md:text-5xl font-display text-[#111827]">
//                 {activeCollection === "New Arrivals" ? "New Arrivals" : "Shop All"}
//               </h1>
//               <p className="text-gray-400 text-xs font-body uppercase tracking-widest">
//                 {!isLoading && `${filteredProducts.length} products`}
//               </p>
//             </div>
//           </div>

//           {/* Search + Sort + Filter row — all on one line, aligned left with content */}
//           <div className="flex flex-wrap items-center gap-3">
//             {/* Search Bar */}
//             <div className="relative flex-1 min-w-[180px] max-w-xs">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-sm text-sm w-full focus:outline-none focus:border-[#D4AF37] transition-colors"
//                 value={searchQuery}
//                 onChange={(e) => updateFilter("search", e.target.value)}
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             </div>

//             {/* Sort Dropdown */}
//             <div className="relative">
//               <select
//                 className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#E5E7EB] rounded-sm text-sm w-44 cursor-pointer focus:outline-none focus:border-[#D4AF37] text-gray-700"
//                 value={sortBy}
//                 onChange={(e) => updateFilter("sort", e.target.value)}
//               >
//                 <option value="latest">Latest</option>
//                 <option value="price_low">Price: Low to High</option>
//                 <option value="price_high">Price: High to Low</option>
//               </select>
//               <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//             </div>

//             {/* Mobile Filter Button */}
//             <button
//               className="md:hidden flex items-center gap-2 bg-[#111827] text-white py-2.5 px-5 rounded-sm text-xs uppercase tracking-widest font-semibold"
//               onClick={() => setIsMobileFilterOpen(true)}
//             >
//               <SlidersHorizontal size={13} /> Filters
//               {activeFiltersCount > 0 && (
//                 <span className="bg-[#D4AF37] text-[#111827] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {activeFiltersCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* --- ACTIVE FILTERS TAGS --- */}
//         {activeFiltersCount > 0 && (
//           <div className="flex flex-wrap items-center gap-2 mb-6">
//             <span className="text-[10px] text-gray-400 uppercase tracking-widest">Active:</span>
//             {[
//               { label: activeCategory, key: "category" },
//               { label: activeCollection, key: "collection" },
//               { label: activePrice, key: "priceRange" },
//             ].map(
//               (filter) =>
//                 filter.label && (
//                   <button
//                     key={filter.label}
//                     onClick={() => updateFilter(filter.key, filter.label)}
//                     className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111827] text-white rounded-sm text-[10px] uppercase tracking-widest font-medium hover:bg-black transition-colors"
//                   >
//                     {filter.label} <X size={10} />
//                   </button>
//                 )
//             )}
//             <button
//               onClick={clearAllFilters}
//               className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] font-semibold transition-colors"
//             >
//               Clear all
//             </button>
//           </div>
//         )}

//         {/* --- MAIN LAYOUT: Sidebar + Grid --- */}
//         <div className="flex gap-10 lg:gap-14 items-start">

//           {/* SIDEBAR (Desktop) */}
//           <aside className="hidden md:block w-48 shrink-0 sticky top-24 self-start space-y-8">
//             {filters.collection.length > 0 && (
//               <>
//                 <FilterSection
//                   title="Collections"
//                   options={filters.collection}
//                   selected={activeCollection}
//                   onSelect={(val) => updateFilter("collection", val)}
//                 />
//                 <div className="h-px bg-[#E5E7EB] w-full" />
//               </>
//             )}
//             {filters.category.length > 0 && (
//               <>
//                 <FilterSection
//                   title="Category"
//                   options={filters.category}
//                   selected={activeCategory}
//                   onSelect={(val) => updateFilter("category", val)}
//                 />
//                 <div className="h-px bg-[#E5E7EB] w-full" />
//               </>
//             )}
//             <FilterSection
//               title="Price"
//               options={filters.priceRange}
//               selected={activePrice}
//               onSelect={(val) => updateFilter("priceRange", val)}
//             />
//           </aside>

//           {/* PRODUCT GRID */}
//           <main className="flex-1 min-w-0">

//             {/* Loading */}
//             {isLoading && (
//               <div className="flex flex-col items-center justify-center h-64 text-[#D4AF37]">
//                 <Loader2 className="animate-spin mb-4" size={32} />
//                 <p className="text-sm font-medium tracking-widest uppercase text-[#111827]">
//                   Loading collection...
//                 </p>
//               </div>
//             )}

//             {/* Error */}
//             {!isLoading && error && (
//               <div className="flex items-center justify-center p-6 bg-red-50 text-red-600 rounded-sm border border-red-100">
//                 <AlertCircle className="mr-2" size={20} />
//                 <span className="text-sm font-medium">{error}</span>
//               </div>
//             )}

//             {/* Empty */}
//             {!isLoading && !error && filteredProducts.length === 0 && (
//               <div className="text-center py-20 bg-white rounded-sm border border-[#E5E7EB]">
//                 <p className="text-gray-500 text-base font-body mb-6">
//                   {activeCollection === "New Arrivals"
//                     ? "No new items added in the last 30 days."
//                     : "No products match your criteria."}
//                 </p>
//                 <button
//                   onClick={clearAllFilters}
//                   className="text-[#111827] border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors font-semibold uppercase tracking-widest text-xs"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             )}

//             {/* Grid */}
//             {!isLoading && !error && filteredProducts.length > 0 && (
//               <>
//                 <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
//                   {paginatedProducts.map((product) => (
//                     <ProductCard key={product.id} product={product} />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="mt-16 flex justify-center items-center gap-2">
//                     <button
//                       onClick={() => updateFilter("page", safeCurrentPage - 1)}
//                       disabled={safeCurrentPage === 1}
//                       className={`p-2 rounded-sm border transition-all ${
//                         safeCurrentPage === 1
//                           ? "text-gray-300 border-transparent cursor-not-allowed"
//                           : "text-[#111827] border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white"
//                       }`}
//                     >
//                       <ChevronLeft size={18} />
//                     </button>

//                     <div className="flex items-center gap-1 mx-2">
//                       {getPageNumbers().map((page, index) => (
//                         <React.Fragment key={index}>
//                           {page === "..." ? (
//                             <span className="px-2 text-gray-400 text-sm">...</span>
//                           ) : (
//                             <button
//                               onClick={() => updateFilter("page", page)}
//                               className={`w-9 h-9 flex items-center justify-center rounded-sm text-xs font-semibold transition-all ${
//                                 safeCurrentPage === page
//                                   ? "bg-[#111827] text-white"
//                                   : "text-gray-600 bg-white border border-transparent hover:border-[#D4AF37] hover:text-[#D4AF37]"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           )}
//                         </React.Fragment>
//                       ))}
//                     </div>

//                     <button
//                       onClick={() => updateFilter("page", safeCurrentPage + 1)}
//                       disabled={safeCurrentPage === totalPages}
//                       className={`p-2 rounded-sm border transition-all ${
//                         safeCurrentPage === totalPages
//                           ? "text-gray-300 border-transparent cursor-not-allowed"
//                           : "text-[#111827] border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white"
//                       }`}
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </main>
//         </div>
//       </div>

//       {/* MOBILE FILTER DRAWER */}
//       {isMobileFilterOpen && (
//         <div className="fixed inset-0 z-50 flex md:hidden">
//           <div
//             className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm"
//             onClick={() => setIsMobileFilterOpen(false)}
//           />
//           <div className="relative w-[85%] max-w-sm bg-white ml-auto h-full shadow-2xl overflow-y-auto flex flex-col">
//             <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] bg-[#FAF8F3]">
//               <h2 className="font-display text-xl text-[#111827] uppercase tracking-widest">Filters</h2>
//               <button
//                 onClick={() => setIsMobileFilterOpen(false)}
//                 className="p-2 text-gray-400 hover:text-[#111827] transition-colors"
//               >
//                 <X size={22} strokeWidth={1.5} />
//               </button>
//             </div>

//             <div className="p-8 space-y-10 flex-1">
//               {filters.collection.length > 0 && (
//                 <FilterSection
//                   title="Collections"
//                   options={filters.collection}
//                   selected={activeCollection}
//                   onSelect={(val) => { updateFilter("collection", val); setIsMobileFilterOpen(false); }}
//                 />
//               )}
//               {filters.category.length > 0 && (
//                 <FilterSection
//                   title="Category"
//                   options={filters.category}
//                   selected={activeCategory}
//                   onSelect={(val) => { updateFilter("category", val); setIsMobileFilterOpen(false); }}
//                 />
//               )}
//               <FilterSection
//                 title="Price"
//                 options={filters.priceRange}
//                 selected={activePrice}
//                 onSelect={(val) => { updateFilter("priceRange", val); setIsMobileFilterOpen(false); }}
//               />
//             </div>

//             <div className="sticky bottom-0 p-6 bg-white border-t border-[#E5E7EB]">
//               <button
//                 onClick={() => setIsMobileFilterOpen(false)}
//                 className="w-full bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-colors"
//               >
//                 View {filteredProducts.length} Results
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default ProductCollection;
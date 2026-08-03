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

const ITEMS_PER_PAGE = 9;

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

// --- MAIN COMPONENT ---

const ProductCollection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Filters State
  const [filters, setFilters] = useState({
    collection: [],
    category: [],
    priceRange: ["Under 3000", "3000 - 6000", "6000 - 10000", "Above 10000"],
  });

  // --- 1. FETCH DATA & EXTRACT FILTERS ---
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(file_path)")
          .order("created_at", { ascending: false });
        if (error) throw error;

        // A. Normalize Data
        const normalizedProducts = data.map((item) => {
          const mappedUrls = item.product_images?.map(img => supabase.storage.from("products").getPublicUrl(img.file_path).data.publicUrl) || [];
          return {
            ...item,
            // price: item.original_price,
            images_urls: mappedUrls,
            image: mappedUrls.length > 0 ? mappedUrls[0] : "",
          };
        });

        setProducts(normalizedProducts);

        // B. Extract Unique Filter Options
        const uniqueCategories = [
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ].sort();

        const dbCollections = [
          ...new Set(
            data
              .map((item) => item.collection)
              .filter((c) => c && c !== "New Arrivals")
          ),
        ].sort();

        const finalCollections = ["New Arrivals", ...dbCollections];

        setFilters((prev) => ({
          ...prev,
          category: uniqueCategories,
          collection: finalCollections,
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

  // --- URL PARAMS HANDLERS ---
  const activeCategory = searchParams.get("category");
  const activeCollection = searchParams.get("collection");
  const activePrice = searchParams.get("priceRange");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "latest";
  
  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    // If we are changing filters/search/sort, reset to page 1
    if (key !== "page") {
      newParams.set("page", "1");
    }

    if (newParams.get(key) === value && key !== "page") {
      // Toggle off logic (except for page)
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // --- 2. FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(lowerQ)) ||
          (p.category && p.category.toLowerCase().includes(lowerQ))
      );
    }

    // 2. Collection Filter
    if (activeCollection) {
      if (activeCollection === "New Arrivals") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter((p) => {
          const createdDate = new Date(p.created_at);
          return createdDate >= thirtyDaysAgo;
        });
      } else {
        result = result.filter((p) => p.collection === activeCollection);
      }
    }

    // 3. Category Filter
    if (activeCategory)
      result = result.filter((p) => p.category === activeCategory);

    // 4. Price Range Logic
    // 4. Price Range Logic (based on discounted price customers actually pay)
    if (activePrice) {
      if (activePrice === "Under 3000")
        result = result.filter((p) => p.discount_price < 3000);
      else if (activePrice === "3000 - 6000")
        result = result.filter((p) => p.discount_price >= 3000 && p.discount_price <= 6000);
      else if (activePrice === "6000 - 10000")
        result = result.filter((p) => p.discount_price > 6000 && p.discount_price <= 10000);
      else if (activePrice === "Above 10000")
        result = result.filter((p) => p.discount_price > 10000);
    }

    // 5. Sorting Logic
    if (sortBy === "price_low") result.sort((a, b) => a.discount_price - b.discount_price);
    else if (sortBy === "price_high") result.sort((a, b) => b.discount_price - a.discount_price);
    else if (sortBy === "latest")
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return result;
  }, [
    products,
    activeCategory,
    activeCollection,
    activePrice,
    searchQuery,
    sortBy,
  ]);

  // --- 3. PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  // Ensure current page is valid (handle cases where filtering reduces pages)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  // Helper to generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    // Show max 5 page buttons for cleaner UI
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

  const activeFiltersCount = [
    activeCategory,
    activeCollection,
    activePrice,
  ].filter(Boolean).length;

  return (
    <>
      <section className="bg-[#FAF8F3] min-h-screen pt-12 pb-20 font-body text-[#111827]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[#D4AF37] uppercase tracking-widest text-[10px] sm:text-xs font-semibold mb-2">
                Discover
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#111827] mb-2">
                {activeCollection === "New Arrivals"
                  ? "New Arrivals"
                  : "Shop All"}
              </h1>
              <p className="text-gray-500 text-sm font-body h-5">
                {!isLoading && `${filteredProducts.length} Products Found`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative group w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-sm text-sm w-full focus:outline-none focus:border-[#D4AF37] transition-colors shadow-sm"
                  value={searchQuery}
                  onChange={(e) => updateFilter("search", e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  className="appearance-none pl-4 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-sm text-sm w-full sm:w-48 cursor-pointer focus:outline-none focus:border-[#D4AF37] shadow-sm text-gray-700"
                  value={sortBy}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Mobile Filter Button */}
              <button
                className="w-full sm:w-auto md:hidden flex items-center justify-center gap-2 bg-[#111827] text-white py-3 px-6 rounded-sm text-xs uppercase tracking-widest font-semibold shadow-sm"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>

          {/* --- ACTIVE FILTERS TAGS --- */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-in">
              <span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Filters:</span>
              {[
                { label: activeCategory, key: "category" },
                { label: activeCollection, key: "collection" },
                { label: activePrice, key: "priceRange" },
              ].map(
                (filter) =>
                  filter.label && (
                    <button
                      key={filter.label}
                      onClick={() => updateFilter(filter.key, filter.label)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] text-white rounded-sm text-[10px] uppercase tracking-widest font-medium hover:bg-black transition-colors shadow-sm"
                    >
                      {filter.label} <X size={12} />
                    </button>
                  )
              )}
              <button
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] ml-2 font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          <div className="flex gap-12 lg:gap-16">
            {/* --- SIDEBAR (Desktop) --- */}
            <aside className="hidden md:block w-56 shrink-0 space-y-10 sticky top-24 self-start h-fit max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
              {filters.collection.length > 0 && (
                <>
                  <FilterSection
                    title="Collections"
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

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1">
              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-[#D4AF37]">
                  <Loader2
                    className="animate-spin mb-4"
                    size={32}
                  />
                  <p className="text-sm font-medium tracking-widest uppercase text-[#111827]">Loading collection...</p>
                </div>
              )}

              {/* Error State */}
              {!isLoading && error && (
                <div className="flex items-center justify-center p-6 bg-red-50 text-red-600 rounded-sm border border-red-100">
                  <AlertCircle className="mr-2" size={20} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-sm border border-[#E5E7EB] shadow-sm">
                  <p className="text-gray-500 text-base font-body mb-6">
                    {activeCollection === "New Arrivals"
                      ? "No new items added in the last 30 days."
                      : "No products match your criteria."}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="text-[#111827] border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors font-semibold uppercase tracking-widest text-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {!isLoading && !error && filteredProducts.length > 0 && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* --- PAGINATION CONTROLS --- */}
                  {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-2">
                      <button
                        onClick={() => updateFilter("page", safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        className={`p-2 rounded-sm border transition-all ${
                          safeCurrentPage === 1
                            ? "text-gray-300 border-transparent cursor-not-allowed"
                            : "text-[#111827] border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white shadow-sm"
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
                                className={`w-10 h-10 flex items-center justify-center rounded-sm text-xs font-semibold transition-all ${
                                  safeCurrentPage === page
                                    ? "bg-[#111827] text-white shadow-sm"
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
                            : "text-[#111827] border-[#E5E7EB] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white shadow-sm"
                        }`}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                  {/* End Pagination */}
                </>
              )}
            </main>
          </div>
        </div>

        {/* --- MOBILE FILTER DRAWER --- */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-[85%] max-w-sm bg-white ml-auto h-full shadow-2xl overflow-y-auto flex flex-col animate-slide-in-right">
              <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] bg-[#FAF8F3]">
                <h2 className="font-display text-2xl text-[#111827] uppercase tracking-widest">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#111827] transition-colors"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-8 space-y-10 flex-1 bg-white">
                {filters.collection.length > 0 && (
                  <FilterSection
                    title="Collections"
                    options={filters.collection}
                    selected={activeCollection}
                    onSelect={(val) => updateFilter("collection", val)}
                  />
                )}
                {filters.category.length > 0 && (
                  <FilterSection
                    title="Category"
                    options={filters.category}
                    selected={activeCategory}
                    onSelect={(val) => updateFilter("category", val)}
                  />
                )}
                <FilterSection
                  title="Price"
                  options={filters.priceRange}
                  selected={activePrice}
                  onSelect={(val) => updateFilter("priceRange", val)}
                />
              </div>

              <div className="sticky bottom-0 p-6 bg-white border-t border-[#E5E7EB]">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-md"
                >
                  View Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductCollection;
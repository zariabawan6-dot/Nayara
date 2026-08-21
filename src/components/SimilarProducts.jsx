import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { supabase } from "../api/supabase";
import { getOptimizedImageUrl } from "../lib/imageUtils";

const formatPKR = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const SimilarProductsSection = ({ currentProductId, collection }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      // If there is no collection defined, we can't fetch similar items
      if (!collection) return;

      setLoading(true);

      try {
        const { data, error } = await supabase
  .from("products")
  .select(
    "id, name, price, discount_price, category, collection, product_images(file_path)",
  )
  .neq("id", currentProductId)
  .neq("category", "") 
  .order("created_at", { ascending: false })
  .limit(4);

        if (error) throw error;

        if (data) {
          const formattedData = data.map((item) => ({
            ...item,
            images_urls:
  item.product_images?.map(
    (img) => getOptimizedImageUrl(img.file_path)
  ) || [],
          }));
          setProducts(formattedData);
        }
      } catch (err) {
        console.error("Error fetching similar products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProductId, collection]);

  // --- Handlers ---
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`Added ${product.name} to cart`);
    // Add dispatch or context logic here
  };

  // Don't render section if loading is done and no products found
  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full mt-8 py-16 px-4 md:px-8 bg-white font-body border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-[#111827] font-medium tracking-tight mb-2">
              More from {collection}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-light">
              Complete the look with these curated picks.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-[#111827] text-xs font-semibold uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
            View Collection <ArrowRight size={16} />
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-[3/4] rounded-sm mb-4"></div>
                <div className="h-4 bg-gray-100 w-3/4 mb-2 rounded"></div>
                <div className="h-4 bg-gray-100 w-1/4 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => {
              const hasDiscount = product.price > product.discount_price;

              const displayImage =
                product.images_urls && product.images_urls.length > 0
                  ? product.images_urls[0]
                  : "/placeholder-image.jpg";

              return (
                <div
                  key={product.id}
                  onClick={() => (window.location.href = `/shop/${product.id}`)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-gray-50 mb-4 border border-[#E5E7EB]">
                    <img loading="lazy"
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {/* Since everything is same collection, we show Category as the badge now */}
                      <span className="bg-white/95 backdrop-blur-sm text-[#111827] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm">
                        {product.category}
                      </span>
                      {hasDiscount && (
                        <span className="bg-[#D4AF37] text-[#111827] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm w-fit">
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Desktop Add to Cart */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-white text-[#111827] font-semibold py-3 rounded-sm shadow-md hover:bg-[#111827] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <ShoppingBag size={16} /> Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-display font-semibold text-[#111827] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm">
                      <span className={`font-semibold text-[#111827]`}>
                        {formatPKR(product.discount_price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-xs decoration-gray-400">
                          {formatPKR(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Mobile Text Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="md:hidden text-left text-[10px] uppercase tracking-widest font-bold text-[#111827] underline underline-offset-4 mt-1 active:text-[#D4AF37]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile View More Button */}
        <div className="mt-8 md:hidden flex justify-center">
          <button className="flex items-center gap-2 text-[#111827] text-[10px] font-semibold uppercase tracking-widest border border-[#111827] px-6 py-3 rounded-sm hover:bg-[#111827] hover:text-white transition-colors">
            View Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default SimilarProductsSection;

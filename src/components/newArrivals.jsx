import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { getOptimizedImageUrl } from "../lib/imageUtils";

// --- Utility: Format Currency ---
const formatPKR = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Utility: Check if "New" (within last 30 days) ---
const isNewArrival = (dateString) => {
  const productDate = new Date(dateString);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return productDate > thirtyDaysAgo;
};

const NewArrivalsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Fetch products, sorted by newest first, limit to 8 items
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(file_path)")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;

        const formattedData = data.map((item) => ({
          ...item,
          // images_urls: item.product_images?.map(img => supabase.storage.from("products").getPublicUrl(img.file_path).data.publicUrl) || []
          images_urls: item.product_images?.map(img => getOptimizedImageUrl(img.file_path)) || []
        }));

        setProducts(formattedData || []);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleNavigate = (id) => {
    window.location.href = `/shop/${id}`;
  };

  return (
    <section className="py-20 px-6 sm:px-12 bg-white w-full font-body">

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37] mb-3 block">
            Latest Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-[#111827] mb-4">
            Fresh In for the Season
          </h2>
          <p className="text-lg font-body text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Discover the artistry of our newest ensembles, designed with
            unparalleled craftsmanship and timeless elegance.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Loading State (Skeleton Grid) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-full h-[300px] sm:h-[350px] bg-gray-100 mb-4 rounded-sm"></div>
                <div className="h-4 w-3/4 bg-gray-100 mb-2 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {products.map((product) => {
              const displayImage =
                product.images_urls?.[0] ||
                "https://via.placeholder.com/400x600?text=No+Image";
              const isNew = isNewArrival(product.created_at);

              return (
                <div
                  key={product.id}
                  className="group flex flex-col items-center text-center relative overflow-hidden rounded-sm bg-white pb-4
                             transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Product Image Wrapper - Clickable */}
                  <div
                    onClick={() => handleNavigate(product.id)}
                    className="relative w-full h-[300px] sm:h-[350px] overflow-hidden mb-4 bg-gray-50 cursor-pointer border border-[#E5E7EB]"
                  >
                    <img loading="lazy"
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />

                    {/* Desktop Overlay Action Buttons (Hidden on mobile) */}
                    <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click
                            handleNavigate(product.id);
                          }}
                          className="p-3 bg-white/95 rounded-full text-[#111827] hover:bg-[#111827] hover:text-white transition-all duration-300 shadow-md transform hover:scale-110"
                        >
                          <Eye size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* New Tag (Dynamic) */}
                    {isNew && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-[10px] font-semibold uppercase tracking-widest text-[#111827] rounded-sm shadow-sm">
                        New
                      </span>
                    )}
                  </div>

                  {/* Product Details - Clickable */}
                  <div
                    onClick={() => handleNavigate(product.id)}
                    className="cursor-pointer w-full px-3"
                  >
                    <h3 className="font-display text-lg md:text-xl text-[#111827] mb-1 leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-body text-xs text-gray-500 mb-2 uppercase tracking-widest">
                      {product.category || "Collection"}
                    </p>

                    {/* Price Section */}
                    <div className="flex justify-center gap-2 items-baseline mb-3">
                      <p className="font-body text-sm font-semibold text-[#111827]">
                        {formatPKR(product.discount_price)}
                      </p>
                      {product.price > product.discount_price && (
                        <p className="font-body text-xs text-gray-400 line-through decoration-gray-400">
                          {formatPKR(product.price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Only: View Product Button */}
                  <button
                    onClick={() => handleNavigate(product.id)}
                    className="md:hidden w-[90%] py-2 border border-[#E5E7EB] text-gray-600 text-[10px] uppercase tracking-widest font-semibold hover:bg-gray-50 hover:text-[#111827] transition-colors rounded-sm"
                  >
                    View Product
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() =>
              (window.location.href = "/shop?collection=New+Arrivals")
            }
            className="inline-flex items-center gap-2 px-10 py-4 bg-transparent border border-[#111827] text-[#111827] font-semibold uppercase text-xs tracking-widest hover:bg-[#111827] hover:text-white transition-all duration-300 ease-in-out rounded-sm"
          >
            View All New Arrivals
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;

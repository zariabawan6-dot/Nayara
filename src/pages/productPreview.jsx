import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Instagram,
  Facebook,
  Package,
  Layers,
  X,
  ZoomIn,
} from "lucide-react";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { supabase } from "../api/supabase";
import SimilarProductsSection from "../components/SimilarProducts";
import ProductReviews from "../components/ProductReviews";
import { useCart } from "../context/cartContext";
import { useToast } from "../context/ToastContext";
import { fbTrack } from "../lib/fbPixel";
import { getOptimizedImageUrl } from "../lib/imageUtils";

const formatPKR = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ProductPreview = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Add this state near the top with other useState calls
  const [showCartFloat, setShowCartFloat] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(file_path)")
          .eq("id", id)
          .single();

        if (error) throw error;

       const mappedUrls =
  data.product_images?.map(
    (img) => getOptimizedImageUrl(img.file_path)
  ) || [];
        data.images_urls = mappedUrls;

        setProduct(data);
        if (data?.images_urls?.length > 0) {
          setSelectedImage(data.images_urls[0]);
        }

        fbTrack("ViewContent", {
          content_ids: [data.id],
          content_name: data.name,
          content_type: "product",
          value: data.discount_price || data.price,
          currency: "PKR",
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("We couldn't find the product you're looking for.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsZoomOpen(false);
    };
    if (isZoomOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isZoomOpen]);

  // ?? ADD HERE
  useEffect(() => {
    const randomViewers = Math.floor(Math.random() * (35 - 8 + 1)) + 8;
    setViewers(randomViewers);

    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return Math.min(Math.max(newVal, 5), 40);
      });
    }, Math.random() * 4000 + 8000);

    return () => clearInterval(interval);
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} I found!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // const handleAddToCart = () => {
  //   if (product.is_out_of_stock) return;

  //   const hasSizes = product.sizes && product.sizes.length > 0;
  //   if (hasSizes && !selectedSize) {
  //     setSizeError(true);
  //     return;
  //   }

  //   addToCart(product, selectedSize);
  //   addToast(
  //     `${product.name}${selectedSize ? " - " + selectedSize : ""}`,
  //     "success",
  //   );
  // };

  // Update handleAddToCart — replace the existing function
const handleAddToCart = () => {
  if (product.is_out_of_stock) return;

  const hasSizes = product.sizes && product.sizes.length > 0;
  if (hasSizes && !selectedSize) {
    setSizeError(true);
    return;
  }

  addToCart(product, selectedSize);
  addToast(
    `${product.name}${selectedSize ? " - " + selectedSize : ""}`,
    "success",
  );

  // Show floating button
  setShowCartFloat(true);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-8 font-body">
        <div className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8 animate-pulse border border-[#E5E7EB]">
          <div className="bg-gray-100 aspect-[4/5] rounded-sm"></div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="h-4 bg-gray-100 w-1/4 rounded"></div>
            <div className="h-10 bg-gray-100 w-3/4 rounded"></div>
            <div className="h-8 bg-gray-100 w-1/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4 font-body">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-[#D4AF37]" />
          <h2 className="text-xl text-[#111827] font-display">
            {error || "Product not found"}
          </h2>
          <a href="/shop" className="text-[#111827] text-sm uppercase tracking-widest font-semibold border-b border-[#111827] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
            Return to Shop
          </a>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.price > product.discount_price
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100,
        )
      : 0;

  const descriptionImage =
    product.images_urls.length > 1
      ? product.images_urls[1]
      : product.images_urls[0];

  const hasSizes = product.sizes && product.sizes.length > 0;
  const outOfStock = product.is_out_of_stock;

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-body pb-16">
      <div className="flex items-center justify-center p-4 md:px-8 pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 border border-[#E5E7EB]"
        >
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden group border border-[#E5E7EB]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0.8, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setIsZoomOpen(true)}
                  className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-in-out cursor-zoom-in ${
                    outOfStock ? "grayscale opacity-70" : ""
                  }`}
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 z-10 bg-white/90 hover:bg-white text-[#111827] p-2.5 rounded-full shadow-md transition-colors"
                aria-label="Zoom image"
              >
                <ZoomIn size={18} />
              </button>

              {discountPercentage > 0 && !outOfStock && (
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#111827] text-[10px] font-bold px-3 py-1.5 rounded-sm tracking-widest uppercase shadow-sm">
                  -{discountPercentage}% OFF
                </div>
              )}

              {outOfStock && (
                <div className="absolute top-4 left-4 bg-[#111827] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm tracking-widest uppercase shadow-sm">
                  Out of Stock
                </div>
              )}
            </div>

            {product.images_urls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.images_urls.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative flex-shrink-0 w-20 h-24 rounded-sm overflow-hidden border transition-all duration-300 ${
                      selectedImage === img
                        ? "border-[#111827] ring-1 ring-[#111827]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img loading="lazy"
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-50 text-[#111827] border border-[#E5E7EB] text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest flex items-center gap-2">
                  <Package size={12} className="text-[#D4AF37]" />
                  {product.category}
                </span>
                <span className="bg-[#111827] text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest flex items-center gap-2">
                  <Layers size={12} className="text-[#D4AF37]" />
                  {product.collection}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display text-[#111827] font-semibold leading-tight mb-3">
                {product.name}
              </h1>

              {outOfStock ? (
                <div className="flex items-center gap-2 text-xs text-red-600 font-semibold uppercase tracking-widest">
                  <AlertCircle size={14} />
                  <span>Currently Out of Stock</span>
                </div>
              ) : (
               <div className="flex flex-col gap-2">
  <div className="flex items-center gap-2 text-xs text-green-600 font-semibold uppercase tracking-widest">
    <CheckCircle2 size={14} />
    <span>In Stock & Ready to Ship</span>
  </div>
  <div className="flex items-center gap-2 text-xs text-red-500 font-semibold uppercase tracking-widest">
    <Clock size={14} />
    <span>⚡ Limited Stock ? Order Now!</span>
  </div>

</div>
              )}
            </div>

          <div className="mb-8 border-b border-[#E5E7EB] pb-8">
  <div className="flex items-baseline gap-4 mb-3">
    <span className="text-3xl font-semibold text-[#111827]">
      {formatPKR(product.discount_price)}
    </span>
    {product.price > product.discount_price && (
      <span className="text-lg text-gray-400 line-through decoration-gray-400">
        {formatPKR(product.price)}
      </span>
    )}
  </div>
  <div className="flex items-center gap-2 text-xs text-orange-500 font-semibold uppercase tracking-widest animate-pulse">
    <span>👁 {viewers} people viewing this right now</span>
  </div>
</div>

            {hasSizes && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Select Size
                  </h3>
                  {sizeError && (
                    <span className="text-[10px] text-red-500 font-semibold uppercase tracking-widest">
                      Please select a size
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-6 py-3 rounded-sm text-sm font-semibold border transition-colors ${
                        selectedSize === size
                          ? "bg-[#111827] text-white border-[#111827]"
                          : sizeError
                            ? "bg-white text-gray-500 border-red-300"
                            : "bg-white text-gray-500 border-[#E5E7EB] hover:border-[#D4AF37]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
              </div>
            )}

            <div
              onClick={() => {
                window.location.href = "/storepolicies";
              }}
              className="group block mb-8 cursor-pointer"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-[#E5E7EB] group-hover:border-[#D4AF37] transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-white p-2.5 rounded-sm shadow-sm text-[#111827] border border-[#E5E7EB]">
                    <ShieldCheck
                      size={20}
                      strokeWidth={1.5}
                      className="text-[#D4AF37]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <button className="text-xs font-bold uppercase tracking-widest text-[#111827] group-hover:text-[#D4AF37] transition-colors text-left">
                      Delivery & Exchange Policy
                    </button>
                    <button className="text-xs text-gray-500 mt-1 text-left">
                      Open parcel allowed - 5-Day Returns
                    </button>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-[#111827] group-hover:translate-x-1 transition-all duration-300 relative z-10"
                />
              </div>
            </div>

            <div className="mb-8">
              

                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
  Have questions?
</h3>
<a 
  href="https://wa.me/923166071102" 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-green-600 font-bold text-sm mb-3 block hover:underline"
>
   WhatsApp: 0316-6071102
</a>
             
              <div className="flex items-center gap-4">
                <a href="https://wa.me/923166071102" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors duration-300 hover:scale-110 transform">
                  <FaSquareWhatsapp size={28} />
                </a>
                <a href="https://www.instagram.com/nayara_zone.pk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors duration-300 hover:scale-110 transform">
                  <Instagram size={28} />
                </a>
                <a href="https://www.facebook.com/nayarazone" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform">
                  <Facebook size={28} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs mb-8 italic">
              <Clock size={14} />
              <span>Listed on {formatDate(product.created_at)}</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  whileHover={!outOfStock ? { scale: 1.02 } : {}}
                  whileTap={!outOfStock ? { scale: 0.98 } : {}}
                  className={`flex-1 py-4 rounded-sm font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-md transition-colors border ${
                    outOfStock
                      ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-[#111827] hover:bg-black text-white border-[#111827]"
                  }`}
                >
                  <ShoppingBag size={18} />
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`px-6 rounded-sm border transition-colors flex items-center justify-center shadow-sm ${
                    isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-500"
                      : "bg-white border-[#E5E7EB] text-gray-500 hover:border-[#111827] hover:text-[#111827]"
                  }`}
                >
                  <Heart
                    size={22}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </motion.button>
              </div>


              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-500 hover:text-[#D4AF37] transition-colors py-3 group"
              >
                <Share2
                  size={14}
                  className="group-hover:-translate-y-0.5 transition-transform"
                />
                Share this product
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-3xl font-display text-[#111827] mb-8 relative inline-block font-semibold">
                Details & Description
                <span className="absolute left-0 -bottom-2 w-12 h-[2px] bg-[#D4AF37]"></span>
              </h3>

              <div className="space-y-4 text-gray-600 text-sm mb-8 font-body">
                <div className="flex items-center gap-4">
                  <span className="w-24 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Category
                  </span>
                  <span className="px-3 py-1 bg-gray-50 border border-[#E5E7EB] rounded-sm text-xs font-medium text-[#111827] uppercase tracking-wider">
                    {product.category || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Collection
                  </span>
                  <span className="px-3 py-1 bg-gray-50 border border-[#E5E7EB] rounded-sm text-xs font-medium text-[#111827] uppercase tracking-wider">
                    {product.collection || "N/A"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-base leading-loose font-body whitespace-pre-line">
                {product.description || "No product description available."}
              </p>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative p-2 bg-white border border-[#E5E7EB] shadow-md rounded-sm">
                <img loading="lazy"
                  src={descriptionImage}
                  alt="Detail View"
                  className="w-full max-w-sm rounded-sm object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      <SimilarProductsSection
        currentProductId={product.id}
        collection={product.collection}
      />

      {/* Floating View Cart Button */}
<AnimatePresence>
  {showCartFloat && (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90]"
    >
      <Link
        to="/cart"
        className="flex items-center gap-3 bg-[#111827] text-white pl-5 pr-6 py-3.5 rounded-sm shadow-2xl border border-[#D4AF37]/40 hover:bg-black transition-colors group"
      >
        <div className="relative">
          <ShoppingBag size={20} className="text-[#D4AF37]" />
          <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#111827] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            ✓
          </span>
        </div>
        <span className="text-sm font-semibold uppercase tracking-widest">
          View Cart
        </span>
        <ChevronRight
          size={15}
          className="text-[#D4AF37] group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    </motion.div>
  )}
</AnimatePresence>

      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-10 overflow-y-auto cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors"
              aria-label="Close zoom"
            >
              <X size={22} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              src={selectedImage}
              alt={product.name}
              className="max-w-full md:max-w-[90vw] w-auto h-auto object-contain rounded-sm shadow-2xl cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPreview;

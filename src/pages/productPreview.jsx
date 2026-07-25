// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ShoppingBag,
//   Heart,
//   Share2,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   ShieldCheck,
//   ChevronRight,
//   Instagram,
//   Facebook,
//   Package,
//   Layers,
// } from "lucide-react";
// // Ensure you have react-icons installed: npm install react-icons
// import { FaSquareWhatsapp } from "react-icons/fa6";
// import { AiFillTikTok } from "react-icons/ai";
// import { supabase } from "../api/supabase";
// import SimilarProductsSection from "../components/SimilarProducts";
// import { useCart } from "../context/cartContext";
// import { useToast } from "../context/ToastContext";

// // Utility: Currency Formatter
// const formatPKR = (amount) => {
//   return new Intl.NumberFormat("en-PK", {
//     style: "currency",
//     currency: "PKR",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// // Utility: Date Formatter
// const formatDate = (timestamp) => {
//   if (!timestamp) return "";
//   return new Date(timestamp).toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// };

// const ProductPreview = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { addToCart } = useCart();
//   const { addToast } = useToast();

//   // UI States
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const { data, error } = await supabase
//           .from("products")
//           .select("*, product_images(file_path)")
//           .eq("id", id)
//           .single();

//         if (error) throw error;

//         const mappedUrls =
//           data.product_images?.map(
//             (img) =>
//               supabase.storage.from("products").getPublicUrl(img.file_path).data
//                 .publicUrl,
//           ) || [];
//         data.images_urls = mappedUrls;

//         setProduct(data);
//         if (data?.images_urls?.length > 0) {
//           setSelectedImage(data.images_urls[0]);
//         }
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError("We couldn't find the product you're looking for.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const handleShare = async () => {
//     if (navigator.share && product) {
//       try {
//         await navigator.share({
//           title: product.name,
//           text: `Check out this ${product.name} I found!`,
//           url: window.location.href,
//         });
//       } catch (err) {
//         console.log("Error sharing", err);
//       }
//     } else {
//       // Fallback: Copy to clipboard
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied to clipboard!");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-8 font-body">
//         <div className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8 animate-pulse border border-[#E5E7EB]">
//           <div className="bg-gray-100 aspect-[4/5] rounded-sm"></div>
//           <div className="flex flex-col justify-center space-y-4">
//             <div className="h-4 bg-gray-100 w-1/4 rounded"></div>
//             <div className="h-10 bg-gray-100 w-3/4 rounded"></div>
//             <div className="h-8 bg-gray-100 w-1/3 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4 font-body">
//         <div className="text-center space-y-4">
//           <AlertCircle size={48} className="mx-auto text-[#D4AF37]" />
//           <h2 className="text-xl text-[#111827] font-display">
//             {error || "Product not found"}
//           </h2>
//           <a
//             href="/shop"
//             className="text-[#111827] text-sm uppercase tracking-widest font-semibold border-b border-[#111827] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
//           >
//             Return to Shop
//           </a>
//         </div>
//       </div>
//     );
//   }

//   const discountPercentage =
//     product.price > product.discount_price
//       ? Math.round(
//           ((product.price - product.discount_price) / product.price) * 100,
//         )
//       : 0;

//   // Safe logic for description image (use second image, or fallback to first)
//   const descriptionImage =
//     product.images_urls.length > 1
//       ? product.images_urls[1]
//       : product.images_urls[0];

//   return (
//     <div className="min-h-screen bg-[#FAF8F3] font-body pb-16">
//       <div className="flex items-center justify-center p-4 md:px-8 pt-8 md:pt-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 border border-[#E5E7EB]"
//         >
//           {/* LEFT COLUMN: Image Gallery */}
//           <div className="p-6 md:p-8 flex flex-col gap-6">
//             <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden group border border-[#E5E7EB]">
//               <AnimatePresence mode="wait">
//                 <motion.img
//                   key={selectedImage}
//                   src={selectedImage}
//                   alt={product.name}
//                   initial={{ opacity: 0.8, scale: 1.05 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-in-out cursor-zoom-in"
//                 />
//               </AnimatePresence>

//               {discountPercentage > 0 && (
//                 <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#111827] text-[10px] font-bold px-3 py-1.5 rounded-sm tracking-widest uppercase shadow-sm">
//                   -{discountPercentage}% OFF
//                 </div>
//               )}
//             </div>

//             {/* Thumbnail Strip */}
//             {product.images_urls.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
//                 {product.images_urls.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(img)}
//                     className={`relative flex-shrink-0 w-20 h-24 rounded-sm overflow-hidden border transition-all duration-300 ${
//                       selectedImage === img
//                         ? "border-[#111827] ring-1 ring-[#111827]"
//                         : "border-transparent opacity-60 hover:opacity-100"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`View ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT COLUMN: Product Details */}
//           <div className="p-6 md:p-12 flex flex-col justify-center bg-white">
//             <div className="mb-6">
//               <div className="flex flex-wrap gap-2 mb-4">
//                 <span className="bg-gray-50 text-[#111827] border border-[#E5E7EB] text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest flex items-center gap-2">
//                   <Package size={12} className="text-[#D4AF37]" />
//                   {product.category}
//                 </span>
//                 <span className="bg-[#111827] text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest flex items-center gap-2">
//                   <Layers size={12} className="text-[#D4AF37]" />
//                   {product.collection}
//                 </span>
//               </div>

//               <h1 className="text-3xl md:text-4xl font-display text-[#111827] font-semibold leading-tight mb-3">
//                 {product.name}
//               </h1>

//               <div className="flex items-center gap-2 text-xs text-green-600 font-semibold uppercase tracking-widest">
//                 <CheckCircle2 size={14} />
//                 <span>In Stock & Ready to Ship</span>
//               </div>
//             </div>

//             {/* Pricing */}
//             <div className="flex items-baseline gap-4 mb-8 border-b border-[#E5E7EB] pb-8">
//               <span className="text-3xl font-semibold text-[#111827]">
//                 {formatPKR(product.discount_price)}
//               </span>
//               {product.price > product.discount_price && (
//                 <span className="text-lg text-gray-400 line-through decoration-gray-400">
//                   {formatPKR(product.price)}
//                 </span>
//               )}
//             </div>

//             {/* Policy Card - NEW INSERTION */}
//             <div
//               onClick={() => {
//                 window.location.href = "/storepolicies";
//               }}
//               className="group block mb-8 cursor-pointer"
//             >
//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-[#E5E7EB] group-hover:border-[#D4AF37] transition-all duration-300 relative overflow-hidden">
//                 <div className="flex items-center gap-4 relative z-10">
//                   <div className="bg-white p-2.5 rounded-sm shadow-sm text-[#111827] border border-[#E5E7EB]">
//                     <ShieldCheck
//                       size={20}
//                       strokeWidth={1.5}
//                       className="text-[#D4AF37]"
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <button className="text-xs font-bold uppercase tracking-widest text-[#111827] group-hover:text-[#D4AF37] transition-colors text-left">
//                       Delivery & Exchange Policy
//                     </button>
//                     <button className="text-xs text-gray-500 mt-1 text-left">
//                       Open parcel allowed • 5-Day Returns
//                     </button>
//                   </div>
//                 </div>
//                 <ChevronRight
//                   size={18}
//                   className="text-gray-400 group-hover:text-[#111827] group-hover:translate-x-1 transition-all duration-300 relative z-10"
//                 />
//               </div>
//             </div>

//             {/* Contact Section */}
//             <div className="mb-8">
//               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
//                 Have questions?
//               </h3>
//               <div className="flex items-center gap-4">
//                 <a
//                   href="https://wa.me/923247678969"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-green-600 transition-colors duration-300 hover:scale-110 transform"
//                 >
//                   <FaSquareWhatsapp size={28} />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-black transition-colors duration-300 hover:scale-110 transform"
//                 >
//                   <AiFillTikTok size={32} />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-pink-600 transition-colors duration-300 hover:scale-110 transform"
//                 >
//                   <Instagram size={28} />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform"
//                 >
//                   <Facebook size={28} />
//                 </a>
//               </div>
//             </div>

//             {/* Meta Info */}
//             <div className="flex items-center gap-2 text-gray-400 text-xs mb-8 italic">
//               <Clock size={14} />
//               <span>Listed on {formatDate(product.created_at)}</span>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col gap-4">
//               <div className="flex gap-4">
//                 <motion.button
//                   onClick={() => {
//                     addToCart(product);
//                     addToast(
//                       `${product.name} - ${product.color || "Standard"}`,
//                       "success",
//                     );
//                   }}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="flex-1 bg-[#111827] hover:bg-black text-white py-4 rounded-sm font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-md transition-colors border border-[#111827]"
//                 >
//                   <ShoppingBag size={18} />
//                   Add to Cart
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsWishlisted(!isWishlisted)}
//                   className={`px-6 rounded-sm border transition-colors flex items-center justify-center shadow-sm ${
//                     isWishlisted
//                       ? "bg-rose-50 border-rose-200 text-rose-500"
//                       : "bg-white border-[#E5E7EB] text-gray-500 hover:border-[#111827] hover:text-[#111827]"
//                   }`}
//                 >
//                   <Heart
//                     size={22}
//                     fill={isWishlisted ? "currentColor" : "none"}
//                   />
//                 </motion.button>
//               </div>

//               <button
//                 onClick={handleShare}
//                 className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-500 hover:text-[#D4AF37] transition-colors py-3 group"
//               >
//                 <Share2
//                   size={14}
//                   className="group-hover:-translate-y-0.5 transition-transform"
//                 />
//                 Share this product
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Description Section */}
//       <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
//         <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-8 md:p-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
//             {/* Text Content */}
//             <div className="order-2 md:order-1">
//               <h3 className="text-3xl font-display text-[#111827] mb-8 relative inline-block font-semibold">
//                 Details & Description
//                 <span className="absolute left-0 -bottom-2 w-12 h-[2px] bg-[#D4AF37]"></span>
//               </h3>

//               <div className="space-y-4 text-gray-600 text-sm mb-8 font-body">
//                 <div className="flex items-center gap-4">
//                   <span className="w-24 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
//                     Category
//                   </span>
//                   <span className="px-3 py-1 bg-gray-50 border border-[#E5E7EB] rounded-sm text-xs font-medium text-[#111827] uppercase tracking-wider">
//                     {product.category || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <span className="w-24 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
//                     Collection
//                   </span>
//                   <span className="px-3 py-1 bg-gray-50 border border-[#E5E7EB] rounded-sm text-xs font-medium text-[#111827] uppercase tracking-wider">
//                     {product.collection || "N/A"}
//                   </span>
//                 </div>
//               </div>

//               <p className="text-gray-600 text-base leading-loose font-body whitespace-pre-line">
//   {product.description || "No product description available."}
// </p>
//             </div>

//             {/* Secondary Image */}
//             <div className="order-1 md:order-2 flex justify-center md:justify-end">
//               <div className="relative p-2 bg-white border border-[#E5E7EB] shadow-md rounded-sm">
//                 <img
//                   src={descriptionImage}
//                   alt="Detail View"
//                   className="w-full max-w-sm rounded-sm object-cover aspect-[4/5]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <SimilarProductsSection
//         currentProductId={product.id}
//         collection={product.collection}
//       />
//     </div>
//   );
// };

// export default ProductPreview;


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
} from "lucide-react";
// Ensure you have react-icons installed: npm install react-icons
import { FaSquareWhatsapp } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import { supabase } from "../api/supabase";
import SimilarProductsSection from "../components/SimilarProducts";
import { useCart } from "../context/cartContext";
import { useToast } from "../context/ToastContext";
import { fbTrack } from "../lib/fbPixel";

// Utility: Currency Formatter
const formatPKR = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Utility: Date Formatter
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

  // UI States
  const [selectedImage, setSelectedImage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
            (img) =>
              supabase.storage.from("products").getPublicUrl(img.file_path).data
                .publicUrl,
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
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
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
          <a
            href="/shop"
            className="text-[#111827] text-sm uppercase tracking-widest font-semibold border-b border-[#111827] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
          >
            Return to Shop
          </a>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.price > product.discounted_price
      ? Math.round(
          ((product.price - product.discounted_price) / product.price) * 100,
        )
      : 0;

  // Safe logic for description image (use second image, or fallback to first)
  const descriptionImage =
    product.images_urls.length > 1
      ? product.images_urls[1]
      : product.images_urls[0];

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-body pb-16">
      <div className="flex items-center justify-center p-4 md:px-8 pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 border border-[#E5E7EB]"
        >
          {/* LEFT COLUMN: Image Gallery */}
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
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-in-out cursor-zoom-in"
                />
              </AnimatePresence>

              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#111827] text-[10px] font-bold px-3 py-1.5 rounded-sm tracking-widest uppercase shadow-sm">
                  -{discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
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
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Details */}
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

              <div className="flex items-center gap-2 text-xs text-green-600 font-semibold uppercase tracking-widest">
                <CheckCircle2 size={14} />
                <span>In Stock & Ready to Ship</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 mb-8 border-b border-[#E5E7EB] pb-8">
              <span className="text-3xl font-semibold text-[#111827]">
                {formatPKR(product.discount_price)}
              </span>
              {product.price > product.discount_price && (
                <span className="text-lg text-gray-400 line-through decoration-gray-400">
                  {formatPKR(product.price)}
                </span>
              )}
            </div>

            {/* Policy Card - NEW INSERTION */}
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
                      Open parcel allowed • 5-Day Returns
                    </button>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-[#111827] group-hover:translate-x-1 transition-all duration-300 relative z-10"
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Have questions?
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/923247678969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-600 transition-colors duration-300 hover:scale-110 transform"
                >
                  <FaSquareWhatsapp size={28} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-black transition-colors duration-300 hover:scale-110 transform"
                >
                  <AiFillTikTok size={32} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-600 transition-colors duration-300 hover:scale-110 transform"
                >
                  <Instagram size={28} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform"
                >
                  <Facebook size={28} />
                </a>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-8 italic">
              <Clock size={14} />
              <span>Listed on {formatDate(product.created_at)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <motion.button
                  onClick={() => {
                    addToCart(product);
                    addToast(
                      `${product.name} - ${product.color || "Standard"}`,
                      "success",
                    );
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-[#111827] hover:bg-black text-white py-4 rounded-sm font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-md transition-colors border border-[#111827]"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
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

      {/* Description Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text Content */}
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

            {/* Secondary Image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative p-2 bg-white border border-[#E5E7EB] shadow-md rounded-sm">
                <img
                  src={descriptionImage}
                  alt="Detail View"
                  className="w-full max-w-sm rounded-sm object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimilarProductsSection
        currentProductId={product.id}
        collection={product.collection}
      />
    </div>
  );
};

export default ProductPreview;
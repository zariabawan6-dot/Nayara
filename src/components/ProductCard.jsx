import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useToast } from "../context/ToastContext";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const outOfStock = product.is_out_of_stock;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const originalPrice = Number(product.price);
  const salePrice = Number(product.discount_price || product.price);

  const discountPercent =
  salePrice < originalPrice
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    if (outOfStock) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (hasSizes) {
      // Let the Link navigate to the product page so the shopper can pick a size
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, null);
    addToast(`${product.name} - ${product.color || "Standard"}`, "success");
  };

  return (
    <Link
      to={`/shop/${product.id}`}
      onClick={() => (window.location.href = `/shop/${product.id}`)}
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-out border border-[#E5E7EB] font-body"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border-b border-[#E5E7EB]">
        <img loading="lazy"
          src={
            product.images_urls && product.images_urls[0]
              ? product.images_urls[0]
              : ""
          }
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            outOfStock ? "grayscale opacity-60" : ""
          }`}
        />

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <span className="bg-[#111827] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-md rounded-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add / Select Size Overlay */}
        {!outOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/20 to-transparent">
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-[#111827] font-semibold py-3 rounded-sm text-xs uppercase tracking-widest hover:bg-[#111827] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {hasSizes ? "Select Size" : "Add to Bag"}
            </button>
          </div>
        )}

        {/* Discount Badge */}
{!outOfStock && discountPercent > 0 && (
  <span className="absolute top-2 left-2 bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#111827] shadow-sm rounded-full">
    -{discountPercent}% OFF
  </span>
)}

{/* New Arrival Badge */}
{!outOfStock && (product.collection === "New Arrivals" || salePrice === originalPrice) && (
  <span
    className={`absolute ${
      discountPercent > 0 ? "top-12" : "top-3"
    } left-3 bg-[#111827] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm rounded-sm`}
  >
    New
  </span>
)}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          {product.category || "Collection"}
        </p>
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-semibold text-base text-[#111827] truncate group-hover:text-[#D4AF37] transition-colors leading-tight">
            {product.name}
          </h3>
          {!outOfStock && !hasSizes && (
            <button
              onClick={handleAddToCart}
              className="text-gray-400 hover:bg-[#111827] hover:text-white p-1.5 rounded-full transition-colors flex-shrink-0"
            >
              <ShoppingBag size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
  <span className="text-lg font-bold text-[#111827]">
    Rs {new Intl.NumberFormat("en-PK").format(salePrice)}
  </span>

  {discountPercent > 0 && (
    <span className="text-sm text-gray-400 line-through">
      Rs {new Intl.NumberFormat("en-PK").format(originalPrice)}
    </span>
  )}
</div>
      </div>
    </Link>
  );
};

export default ProductCard;

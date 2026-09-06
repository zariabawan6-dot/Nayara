import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Truck,
  Loader2,
  CheckCircle,
  ArrowLeft,
  User,
  Phone,
  Gift,
  Sparkles,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { supabase } from "../api/supabase";
import { REGIONS, CITIES_BY_REGION } from "../data/pakistanLocations";
import { fbTrack } from "../lib/fbPixel";

// ─── Discount tiers ────────────────────────────────────────────────
const TIERS = [
  { min: 1, max: 1, label: "1 Article", discount: 0 },
  { min: 2, max: 2, label: "2 Articles", discount: 10 },
  { min: 3, max: 3, label: "3 Articles", discount: 15 },
  { min: 4, max: 4, label: "4 Articles", discount: 20 },
  { min: 5, max: Infinity, label: "5+ Articles", discount: 25 },
];

const getTierDiscount = (count) => {
  const tier = TIERS.find((t) => count >= t.min && count <= t.max);
  return tier ? tier.discount : 0;
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // UI States
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Deal States
  const [activeDeal, setActiveDeal] = useState(null); // null | "buyMore"
  const [bonusPerk, setBonusPerk] = useState(null); // null | "discount25" | "mysteryBox"

  // Form State
  const [formData, setFormData] = useState({
    fullName: "", phone: "", address: "", city: "", region: "",
  });
  const [errors, setErrors] = useState({});
  const [cityQuery, setCityQuery] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityBoxRef = useRef(null);
  const [checkoutTracked, setCheckoutTracked] = useState(false);

  // ─── Click outside city ─────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target))
        setShowCitySuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const citySuggestions =
    formData.region && cityQuery.trim().length > 0
      ? (CITIES_BY_REGION[formData.region] || []).filter((c) =>
          c.toLowerCase().startsWith(cityQuery.trim().toLowerCase())
        )
      : [];

  // ─── Calculations ───────────────────────────────────────────────
  const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.discount_price * (item.quantity || 1), 0
  );

  // The bonus "% Off" perk always mirrors the Buy More Save More tier for the current
  // article count (2=10%, 3=15%, 4=20%, 5+=25%) — it isn't a flat 25%.
  const tierDiscountForCount = getTierDiscount(itemCount);

  const buyMoreDiscount = activeDeal === "buyMore" ? tierDiscountForCount : 0;
  const bonusDiscount = bonusPerk === "discount25" ? tierDiscountForCount : 0;

  const dealDiscountPct = activeDeal === "buyMore" ? buyMoreDiscount : 0;
  // Mystery Box trades the discount for a physical gift — no % off applies, even if
  // the Buy More deal would otherwise have given one. The "% Off" bonus applies the
  // current tier discount even if the Buy More deal card itself isn't toggled on.
  const effectiveDiscountPct =
    bonusPerk === "mysteryBox"
      ? 0
      : bonusPerk === "discount25"
      ? Math.max(dealDiscountPct, bonusDiscount)
      : dealDiscountPct;

  const discountAmount = Math.round(subtotal * effectiveDiscountPct / 100);
  const afterDiscount = subtotal - discountAmount;
  const deliveryCharges = afterDiscount >= 5000 ? 0 : 300;
  const total = afterDiscount + deliveryCharges;

  const isAbove10k = subtotal >= 10000;
  const formatPrice = (price) => new Intl.NumberFormat("en-PK").format(price);

  // ─── Deal handlers ──────────────────────────────────────────────
  const handleSelectDeal = (deal) => {
    if (activeDeal === deal) {
      setActiveDeal(null);
    } else {
      setActiveDeal(deal);
    }
  };

  const handleBonusPerk = (perk) => {
    setBonusPerk(bonusPerk === perk ? null : perk);
  };

  // ─── Validation ─────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 3) return "Enter your full name.";
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return "Name should only contain letters.";
        return "";
      case "phone": {
        const d = value.replace(/\s|-/g, "");
        if (!d) return "Phone number is required.";
        if (!/^(\+92|0)3\d{9}$/.test(d)) return "Enter a valid Pakistani mobile number (e.g. 0300 1234567).";
        return "";
      }
      case "region":
        if (!value) return "Please select a region.";
        return "";
      case "city":
        if (!value.trim()) return "Please select or enter your city.";
        return "";
      case "address":
        if (!value.trim()) return "Complete address is required.";
        if (value.trim().length < 10) return "Please enter a more complete address.";
        return "";
      default: return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    if (!checkoutTracked && cart.length > 0) {
      fbTrack("InitiateCheckout", {
        content_ids: cart.map((i) => i.id),
        contents: cart.map((i) => ({ id: i.id, quantity: i.quantity || 1 })),
        value: total, currency: "PKR", num_items: cart.length, content_type: "product",
      });
      setCheckoutTracked(true);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData((prev) => ({ ...prev, region, city: "" }));
    setCityQuery("");
    setErrors((prev) => ({ ...prev, region: validateField("region", region), city: "" }));
  };

  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCityQuery(value);
    setFormData((prev) => ({ ...prev, city: value }));
    setShowCitySuggestions(true);
    setErrors((prev) => ({ ...prev, city: validateField("city", value) }));
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city }));
    setCityQuery(city);
    setShowCitySuggestions(false);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const inputBase = "w-full border rounded-sm px-4 py-4 text-sm text-[#111827] focus:outline-none transition-colors bg-gray-50 focus:bg-white";
  const inputOk = "border-[#E5E7EB] focus:border-[#D4AF37]";
  const inputErr = "border-red-400 focus:border-red-500";

  // ─── Submit ─────────────────────────────────────────────────────
  const handleCheckout = async () => {
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      phone: validateField("phone", formData.phone),
      region: validateField("region", formData.region),
      city: validateField("city", formData.city),
      address: validateField("address", formData.address),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((m) => m)) {
      alert("Please correct the highlighted fields before placing your order.");
      return;
    }
    setLoading(true);
    try {
      const orderPayload = {
        cus_name: formData.fullName,
        total_amount: total,
        region: formData.region,
        city: formData.city,
        phone: formData.phone,
        address: formData.address,
        status: "Pending",
        payment_method: "COD",
        deal_type: activeDeal || "none",
        bonus_perk: bonusPerk || "none",
        discount_applied: effectiveDiscountPct,
        mystery_box: bonusPerk === "mysteryBox",
      };

      const { data, error } = await supabase.from("orders").insert([orderPayload]).select();
      if (error) throw error;

      const newOrderId = data && data.length > 0 ? data[0].id : null;
      if (newOrderId) {
        const orderItemsPayload = cart.map((item) => ({
          order_id: newOrderId,
          product_id: item.id,
          quantity: item.quantity || 1,
          price_at_time: item.discount_price || item.price,
          size: item.size || "Standard",
          color: item.color || "As Shown",
        }));
        const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
        if (itemsError) console.error("Failed to insert order items:", itemsError);
      }

      fbTrack("Purchase", {
        content_ids: cart.map((i) => i.id),
        contents: cart.map((i) => ({ id: i.id, quantity: i.quantity || 1 })),
        value: total, currency: "PKR", num_items: cart.length, content_type: "product",
      });

      setOrderId(newOrderId || "PENDING");
      setOrderSuccess(true);
      clearCart();
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Success View ────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="bg-[#D4AF37]/10 p-6 rounded-full shadow-sm mb-6 text-[#D4AF37]">
          <CheckCircle size={64} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-display text-[#111827] mb-3">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-2 max-w-md font-body text-sm">
          Thank you, <span className="font-semibold text-[#111827]">{formData.fullName}</span>. Your order is being processed.
        </p>
        {bonusPerk === "mysteryBox" && (
          <div className="mt-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm px-6 py-3 text-sm text-[#111827] font-semibold flex items-center gap-2">
            <Gift size={16} className="text-[#D4AF37]" /> Your Mystery Box will arrive with your order 🎁
          </div>
        )}
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-sm shadow-sm mb-8 mt-4 text-sm text-gray-500">
          <p>Order Reference: <span className="font-mono text-[#111827] font-bold">#{orderId}</span></p>
          <p className="mt-1">We will contact you on WhatsApp at {formData.phone} within 24 hours to confirm your order. 🛍️</p>
        </div>
        <button
          onClick={() => navigate("/collections")}
          className="bg-[#111827] text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-black transition-colors shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ─── Empty Cart ──────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="bg-white p-6 rounded-full shadow-sm border border-[#E5E7EB] mb-6 text-[#D4AF37]">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-display text-[#111827] mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md font-body text-sm">
          It seems you haven't discovered our latest seasonal classics yet.
        </p>
        <button
          onClick={() => (window.location.href = "/shop")}
          className="bg-[#111827] text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-black transition-colors shadow-md"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // ─── Main Cart View ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-12 pb-24 font-body">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#111827] mb-8 transition-colors text-xs font-semibold uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </button>

        <div className="mb-12 text-center md:text-left border-b border-[#E5E7EB] pb-6">
          <h1 className="text-3xl md:text-4xl font-display text-[#111827]">Shopping Bag</h1>
          <p className="text-gray-500 mt-2 text-[10px] uppercase tracking-widest font-semibold">
            <span className="text-[#111827]">{cart.length} items</span> ready for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">

            {/* Cart Items */}
            <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] overflow-hidden p-6 md:p-10 space-y-8">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                  <Link to={`/shop/${item.id}`} className="w-full sm:w-32 h-40 shrink-0 bg-gray-50 rounded-sm overflow-hidden group border border-[#E5E7EB]">
                    <img loading="lazy" src={item.images_urls[0]} alt={item.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-display font-semibold text-[#111827] leading-tight">{item.name}</h3>
                        <p className="font-semibold text-[#111827] whitespace-nowrap">PKR {formatPrice(item.discount_price * (item.quantity || 1))}</p>
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mt-2">
                        Size: {item.size || "Standard"} | Color: {item.color || "As Shown"}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <div className="flex items-center border border-[#E5E7EB] rounded-sm bg-white">
                        <button onClick={() => updateQuantity(item.id, item.size, (item.quantity || 1) - 1)} className="p-2 hover:bg-gray-50 text-gray-500 transition-colors" disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-[#111827] select-none">{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, (item.quantity || 1) + 1)} className="p-2 hover:bg-gray-50 text-gray-500 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-gray-400 hover:text-red-600 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── DEALS SECTION ─────────────────────────────────── */}
            <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB] pb-5">
                <div className="bg-[#D4AF37]/10 p-2.5 rounded-full text-[#D4AF37]">
                  <Tag size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-display text-[#111827]">Choose Your Deal</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Buy more, save more</p>
                </div>
              </div>

              {/* Deal: Buy More Save More */}

              <p className="text-center text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
  👇 Click below to unlock your deal!
</p>
              <button
                onClick={() => handleSelectDeal("buyMore")}
                className={`w-full text-left p-5 rounded-sm border-2 transition-all duration-200 relative overflow-hidden ${
                  activeDeal === "buyMore"
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-[#E5E7EB] hover:border-[#D4AF37]/50 bg-white"
                }`}
              >
                {activeDeal === "buyMore" && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                    Active
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag size={18} className="text-[#D4AF37]" />
                  <span className="text-sm font-bold text-[#111827] uppercase tracking-wide">Buy More, Save More</span>
                </div>
                <div className="space-y-1.5">
                  {TIERS.map((tier) => {
                    const isActive = activeDeal === "buyMore" && itemCount >= tier.min && itemCount <= tier.max;
                    return (
                      <div key={tier.label} className={`flex justify-between text-xs rounded-sm px-2 py-1 ${isActive ? "bg-[#D4AF37] text-white font-bold" : "text-gray-500"}`}>
                        <span>{tier.label}</span>
                        <span>{tier.discount === 0 ? "Regular Price" : `${tier.discount}% OFF`}</span>
                      </div>
                    );
                  })}
                </div>
                {activeDeal === "buyMore" && buyMoreDiscount > 0 && (
                  <p className="mt-3 text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                    You're saving {buyMoreDiscount}% on this order!
                  </p>
                )}
              </button>
            </div>

            {/* ─── 10,000+ BONUS PERK ────────────────────────────── */}
            {isAbove10k && (
              <>
    <p className="text-center text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
      👇 Click below to unlock your deal!
    </p>
              <div className="bg-white rounded-sm shadow-sm border-2 border-[#D4AF37]/40 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#f0cc6a]" />
                <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB] pb-5">
                  <div className="bg-[#D4AF37]/15 p-2.5 rounded-full text-[#D4AF37]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display text-[#111827]">You've Unlocked a Bonus Perk! 🎉</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Order above PKR 10,000 · Pick one</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* 25% OFF */}
                  <button
                    onClick={() => handleBonusPerk("discount25")}
                    className={`text-left p-5 rounded-sm border-2 transition-all duration-200 relative ${
                      bonusPerk === "discount25"
                        ? "border-[#D4AF37] bg-[#D4AF37]/8"
                        : "border-[#E5E7EB] hover:border-[#D4AF37]/50"
                    }`}
                  >
                    {bonusPerk === "discount25" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                    <div className="text-3xl font-display font-bold text-[#D4AF37] mb-1">{tierDiscountForCount}%</div>
                    <div className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-1">Off Your Order</div>
                    <p className="text-xs text-gray-500">Based on your {itemCount} article{itemCount === 1 ? "" : "s"} — add more to unlock a higher discount.</p>
                    {bonusPerk === "discount25" && (
                      <p className="mt-2 text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                        Saving PKR {formatPrice(Math.round(subtotal * tierDiscountForCount / 100))}!
                      </p>
                    )}
                  </button>

                  {/* Mystery Box */}
                  <button
                    onClick={() => handleBonusPerk("mysteryBox")}
                    className={`text-left p-5 rounded-sm border-2 transition-all duration-200 relative ${
                      bonusPerk === "mysteryBox"
                        ? "border-[#111827] bg-[#111827]/5"
                        : "border-[#E5E7EB] hover:border-[#111827]/30"
                    }`}
                  >
                    {bonusPerk === "mysteryBox" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#111827] rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                    <div className="text-3xl mb-1">🎁</div>
                    <div className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-1">Mystery Box</div>
                    <p className="text-xs text-gray-500">A surprise gift curated by Nayara, delivered with your order.</p>
                    {bonusPerk === "mysteryBox" && (
                      <p className="mt-2 text-[11px] font-bold text-[#111827] uppercase tracking-widest">
                        Added to your order! 🎉
                      </p>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-semibold">
                  Free delivery included with both options
                </p>
              </div>
              </>
            )}

            {/* Shipping Form */}
            <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-6 md:p-10">
              <div className="flex items-center gap-4 mb-10 border-b border-[#E5E7EB] pb-6">
                <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-display text-[#111827]">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Full Name</label>
                  <div className="relative">
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g. Anam Khan" className={`${inputBase} pl-12 ${errors.fullName ? inputErr : inputOk}`} />
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-2">{errors.fullName}</p>}
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Phone Number</label>
                  <div className="relative">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} placeholder="0300 1234567" className={`${inputBase} pl-12 ${errors.phone ? inputErr : inputOk}`} />
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone}</p>}
                </div>

              

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Region / Province</label>
                  <select name="region" value={formData.region} onChange={handleRegionChange} onBlur={handleBlur} className={`${inputBase} ${errors.region ? inputErr : inputOk}`}>
                    <option value="">Select Region / Province</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.region && <p className="text-red-500 text-xs mt-2">{errors.region}</p>}
                </div>

                <div className="col-span-2 md:col-span-1 relative" ref={cityBoxRef}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">City</label>
                  <input type="text" name="city" value={cityQuery} onChange={handleCityInputChange} onFocus={() => setShowCitySuggestions(true)} onBlur={handleBlur} disabled={!formData.region} placeholder={formData.region ? "Start typing your city..." : "Select a region first"} className={`${inputBase} ${errors.city ? inputErr : inputOk} disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`} />
                  {errors.city && <p className="text-red-500 text-xs mt-2">{errors.city}</p>}
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full bg-white border border-[#E5E7EB] rounded-sm shadow-lg max-h-48 overflow-y-auto">
                      {citySuggestions.map((c) => (
                        <li key={c}>
                          <button type="button" onClick={() => handleCitySelect(c)} className="w-full text-left px-4 py-2.5 text-sm text-[#111827] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors">{c}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Complete Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur} rows="3" placeholder="House No, Street, Area, Nearest Landmark..." className={`${inputBase} resize-none ${errors.address ? inputErr : inputOk}`}></textarea>
                  {errors.address && <p className="text-red-500 text-xs mt-2">{errors.address}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-sm shadow-md border border-[#E5E7EB] p-8 md:p-10 sticky top-24">
              <h2 className="text-2xl font-display text-[#111827] mb-8 border-b border-[#E5E7EB] pb-6">Order Summary</h2>

              <div className="space-y-4 text-sm text-gray-600 font-body">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-[#111827]">PKR {formatPrice(subtotal)}</span>
                </div>

                {/* Active deal line */}
                {effectiveDiscountPct > 0 && (
                  <div className="flex justify-between items-center text-[#D4AF37]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Tag size={13} />
                      {bonusPerk === "discount25" ? `Bonus ${effectiveDiscountPct}% Off` : `Buy More Deal (${buyMoreDiscount}%)`}
                    </span>
                    <span className="font-bold">− PKR {formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Mystery box */}
                {bonusPerk === "mysteryBox" && (
                  <div className="flex justify-between items-center text-[#111827]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Gift size={13} /> Mystery Box
                    </span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery</span>
                  {deliveryCharges === 0 ? (
                    <span className="text-[#111827] font-bold text-[10px] bg-[#D4AF37] px-2 py-1 rounded-sm uppercase tracking-widest">FREE</span>
                  ) : (
                    <span className="font-semibold text-[#111827]">PKR {formatPrice(deliveryCharges)}</span>
                  )}
                </div>

                {/* Free shipping progress */}
                {deliveryCharges > 0 && (
                  <div className="pt-1">
                    <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      <span className="flex items-center gap-1"><Truck size={11} /> Free at PKR 5,000</span>
                      <span className="text-[#111827]">PKR {formatPrice(5000 - afterDiscount)} away</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" style={{ width: `${Math.min((afterDiscount / 5000) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}

                {deliveryCharges === 0 && (
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-green-600 uppercase tracking-widest">
                    <Truck size={13} /> Free shipping unlocked! 🎉
                  </div>
                )}
              </div>

              <div className="border-t border-[#E5E7EB] my-6"></div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-[#111827] font-display text-xl">Total</span>
                <div className="text-right">
                  {effectiveDiscountPct > 0 && (
                    <p className="text-xs text-gray-400 line-through mb-0.5">PKR {formatPrice(subtotal + deliveryCharges)}</p>
                  )}
                  <span className="text-3xl font-display font-semibold text-[#111827]">
                    <span className="text-sm font-body font-normal text-gray-500 mr-2">PKR</span>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Payment Method</label>
                <div className="flex items-center gap-4 p-4 border border-[#111827] bg-[#FAF8F3] rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#111827]"></div>
                  <div className="bg-white p-3 rounded-sm shadow-sm border border-[#E5E7EB] ml-1">
                    <Truck size={24} className="text-[#111827]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] text-sm uppercase tracking-wider">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pay in cash upon receipt</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full group bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-md flex items-center justify-center gap-3 border border-[#111827] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Processing...</>
                ) : (
                  <>Confirm Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-semibold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;



// import React, { useState, useRef, useEffect } from "react";
// import {
//   Trash2,
//   Minus,
//   Plus,
//   ArrowRight,
//   ShoppingBag,
//   ShieldCheck,
//   MapPin,
//   Truck,
//   Mail,
//   Loader2,
//   CheckCircle,
//   ArrowLeft,
//   User,
//   Phone,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom"; // IMPORT useNavigate
// import { useCart } from "../context/cartContext";
// import { supabase } from "../api/supabase";
// import { REGIONS, CITIES_BY_REGION } from "../data/pakistanLocations";
// import { fbTrack } from "../lib/fbPixel";

// const CartPage = () => {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
//   const navigate = useNavigate();

//   // UI States
//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [orderId, setOrderId] = useState(null);

//   // Form State
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     address: "",
//     city: "",
//     region: "",
//   });

//   // Validation State
//   const [errors, setErrors] = useState({});

//   // City Autocomplete State
//   const [cityQuery, setCityQuery] = useState("");
//   const [showCitySuggestions, setShowCitySuggestions] = useState(false);
//   const cityBoxRef = useRef(null);

//   const [checkoutTracked, setCheckoutTracked] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (cityBoxRef.current && !cityBoxRef.current.contains(e.target)) {
//         setShowCitySuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const citySuggestions =
//     formData.region && cityQuery.trim().length > 0
//       ? (CITIES_BY_REGION[formData.region] || []).filter((c) =>
//           c.toLowerCase().startsWith(cityQuery.trim().toLowerCase()),
//         )
//       : [];

//   const validateField = (name, value) => {
//     switch (name) {
//       case "fullName":
//         if (!value.trim()) return "Full name is required.";
//         if (value.trim().length < 3) return "Enter your full name.";
//         if (!/^[a-zA-Z\s.'-]+$/.test(value.trim()))
//           return "Name should only contain letters.";
//         return "";
//       case "phone": {
//         const digitsOnly = value.replace(/\s|-/g, "");
//         if (!digitsOnly) return "Phone number is required.";
//         if (!/^(\+92|0)3\d{9}$/.test(digitsOnly))
//           return "Enter a valid Pakistani mobile number (e.g. 0300 1234567).";
//         return "";
//       }
//       case "email": {
//         if (!value.trim()) return "Email address is required.";
//         if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim()))
//           return "Enter a valid email address.";
//         return "";
//       }
//       case "region":
//         if (!value) return "Please select a region.";
//         return "";
//       case "city":
//         if (!value.trim()) return "Please select or enter your city.";
//         return "";
//       case "address":
//         if (!value.trim()) return "Complete address is required.";
//         if (value.trim().length < 10)
//           return "Please enter a more complete address.";
//         return "";
//       default:
//         return "";
//     }
//   };


//   const handleInputChange = (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({ ...prev, [name]: value }));
//   setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));

//   if (!checkoutTracked && cart.length > 0) {
//     fbTrack("InitiateCheckout", {
//       content_ids: cart.map((item) => item.id),
//       contents: cart.map((item) => ({
//         id: item.id,
//         quantity: item.quantity || 1,
//       })),
//       value: total,
//       currency: "PKR",
//       num_items: cart.length,
//       content_type: "product",
//     });
//     setCheckoutTracked(true);
//   }
// };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const handleRegionChange = (e) => {
//     const region = e.target.value;
//     setFormData((prev) => ({ ...prev, region, city: "" }));
//     setCityQuery("");
//     setErrors((prev) => ({
//       ...prev,
//       region: validateField("region", region),
//       city: "",
//     }));
//   };

//   const handleCityInputChange = (e) => {
//     const value = e.target.value;
//     setCityQuery(value);
//     setFormData((prev) => ({ ...prev, city: value }));
//     setShowCitySuggestions(true);
//     setErrors((prev) => ({ ...prev, city: validateField("city", value) }));
//   };

//   const handleCitySelect = (city) => {
//     setFormData((prev) => ({ ...prev, city }));
//     setCityQuery(city);
//     setShowCitySuggestions(false);
//     setErrors((prev) => ({ ...prev, city: "" }));
//   };

//   const inputBase =
//     "w-full border rounded-sm px-4 py-4 text-sm text-[#111827] focus:outline-none transition-colors bg-gray-50 focus:bg-white";
//   const inputOk = "border-[#E5E7EB] focus:border-[#D4AF37]";
//   const inputErr = "border-red-400 focus:border-red-500";

//   // --- CALCULATIONS ---
//   const subtotal = cart.reduce(
//     (acc, item) => acc + item.discount_price * (item.quantity || 1),
//     0,
//   );

//   console.log(subtotal);

//   const deliveryCharges = subtotal >= 5000 ? 0 : 300;
//   const total = subtotal + deliveryCharges;

//   const formatPrice = (price) => new Intl.NumberFormat("en-PK").format(price);


//   // --- SUBMIT ORDER ---
//   const handleCheckout = async () => {
//     const newErrors = {
//       fullName: validateField("fullName", formData.fullName),
//       phone: validateField("phone", formData.phone),
//       email: validateField("email", formData.email),
//       region: validateField("region", formData.region),
//       city: validateField("city", formData.city),
//       address: validateField("address", formData.address),
//     };
//     setErrors(newErrors);

//     const hasErrors = Object.values(newErrors).some((msg) => msg);
//     if (hasErrors) {
//       alert("Please correct the highlighted fields before placing your order.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 2. Prepare Payload
//       const orderPayload = {
//         cus_name: formData.fullName,
//         total_amount: total,
//         region: formData.region,
//         city: formData.city,
//         phone: formData.phone,
//         mail: formData.email,
//         address: formData.address,
//         status: "Pending",
//         payment_method: "COD",
//       };

//       // 3. Insert into Supabase
//       const { data, error } = await supabase
//         .from("orders")
//         .insert([orderPayload])
//         .select();

//       if (error) throw error;

//       // 4. Success Handling (Safe check)
//       const newOrderId = data && data.length > 0 ? data[0].id : null;

//       if (newOrderId) {
//         // Insert into order_items
//         const orderItemsPayload = cart.map((item) => ({
//           order_id: newOrderId,
//           product_id: item.id,
//           quantity: item.quantity || 1,
//           price_at_time: item.discount_price || item.price,
//           size: item.size || "Standard",
//           color: item.color || "As Shown",
//         }));

//         console.log(orderItemsPayload);

//         const { error: itemsError } = await supabase
//           .from("order_items")
//           .insert(orderItemsPayload);

//         if (itemsError) {
//           console.error("Failed to insert order items:", itemsError);
//           // Assuming order was still placed, we might alert or log, but let's proceed
//         }
//       }

//       fbTrack("Purchase", {
//         content_ids: cart.map((item) => item.id),
//         contents: cart.map((item) => ({
//           id: item.id,
//           quantity: item.quantity || 1,
//         })),
//         value: total,
//         currency: "PKR",
//         num_items: cart.length,
//         content_type: "product",
//       });

//       setOrderId(newOrderId || "PENDING");
//       setOrderSuccess(true);
//       clearCart();
//       window.scrollTo(0, 0);
//     } catch (error) {
//       console.error("Checkout Error:", error);
//       alert("Something went wrong placing your order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- SUCCESS VIEW ---
//   if (orderSuccess) {
//     return (
//       <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center font-body">
//         <div className="bg-[#D4AF37]/10 p-6 rounded-full shadow-sm mb-6 text-[#D4AF37] animate-in zoom-in duration-300">
//           <CheckCircle size={64} strokeWidth={1.5} />
//         </div>
//         <h2 className="text-4xl font-display text-[#111827] mb-3">
//           Order Placed Successfully!
//         </h2>
//         <p className="text-gray-500 mb-2 max-w-md font-body text-sm">
//           Thank you,{" "}
//           <span className="font-semibold text-[#111827]">
//             {formData.fullName}
//           </span>
//           . Your order is being processed.
//         </p>
//         <div className="bg-white border border-[#E5E7EB] p-4 rounded-sm shadow-sm mb-8 mt-4 text-sm text-gray-500">
//           <p>
//             Order Reference:{" "}
//             <span className="font-mono text-[#111827] font-bold">
//               #{orderId}
//             </span>
//           </p>
//           <p className="mt-1">
//             We will contact you on WhatsApp at {formData.phone} within 24 hours to confirm your order. 🛍️
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/collections")}
//           className="bg-[#111827] text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-black transition-colors shadow-md border border-[#111827]"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   // --- EMPTY CART VIEW ---
//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center font-body">
//         <div className="bg-white p-6 rounded-full shadow-sm border border-[#E5E7EB] mb-6 text-[#D4AF37]">
//           <ShoppingBag size={48} strokeWidth={1} />
//         </div>
//         <h2 className="text-3xl font-display text-[#111827] mb-3">
//           Your Cart is Empty
//         </h2>
//         <p className="text-gray-500 mb-8 max-w-md font-body text-sm">
//           It seems you haven't discovered our latest seasonal classics yet.
//         </p>
//         <button
//           onClick={() => (window.location.href = "/shop")}
//           className="bg-[#111827] text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-black transition-colors shadow-md border border-[#111827]"
//         >
//           Start Shopping
//         </button>
//       </div>
//     );
//   }

//   // --- MAIN CART VIEW ---
//   return (
//     <div className="min-h-screen bg-[#FAF8F3] pt-12 pb-24 font-body">
//       <div className="max-w-7xl mx-auto px-6 sm:px-12">
//         {/* Back Link */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-500 hover:text-[#111827] mb-8 transition-colors text-xs font-semibold uppercase tracking-widest"
//         >
//           <ArrowLeft size={16} className="mr-2" /> Back to Shop
//         </button>

//         <div className="mb-12 text-center md:text-left border-b border-[#E5E7EB] pb-6">
//           <h1 className="text-3xl md:text-4xl font-display text-[#111827]">
//             Shopping Bag
//           </h1>
//           <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-semibold text-[10px]">
//             <span className="text-[#111827]">{cart.length} items</span> ready
//             for checkout
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
//           {/* LEFT COLUMN: Items & Form */}
//           <div className="lg:col-span-7 xl:col-span-8 space-y-12">
//             {/* 1. Cart Items List */}
//             <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] overflow-hidden p-6 md:p-10 space-y-8">
//               {cart.map((item) => (
//   <div
//     key={`${item.id}-${item.size}`}
//                   className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-[#E5E7EB] last:border-0 last:pb-0"
//                 >
//                   <Link
//                     to={`/shop/${item.id}`}
//                     className="w-full sm:w-32 h-40 shrink-0 bg-gray-50 rounded-sm overflow-hidden group border border-[#E5E7EB]"
//                   >
//                     <img loading="lazy"
//                       src={item.images_urls[0]}
//                       alt={item.name}
//                       className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
//                     />
//                   </Link>

//                   <div className="flex-1 flex flex-col justify-between">
//                     <div>
//                       <div className="flex justify-between items-start gap-4">
//                         <h3 className="text-lg font-display font-semibold text-[#111827] leading-tight">
//                           {item.name}
//                         </h3>
//                         <p className="font-semibold text-[#111827] whitespace-nowrap">
//                           PKR{" "}
//                           {formatPrice(
//                             item.discount_price * (item.quantity || 1),
//                           )}
//                         </p>
//                       </div>
//                       <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mt-2">
//                         Size: {item.size || "Standard"} | Color:{" "}
//                         {item.color || "As Shown"}
//                       </p>
//                     </div>

//                     <div className="flex justify-between items-end mt-6">
//                       <div className="flex items-center border border-[#E5E7EB] rounded-sm bg-white">
//                         <button
//   onClick={() =>
//     updateQuantity(item.id, item.size, (item.quantity || 1) - 1)
//   }
//                           className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
//                           disabled={item.quantity <= 1}
//                         >
//                           <Minus size={14} />
//                         </button>
//                         <span className="w-10 text-center text-sm font-semibold text-[#111827] select-none">
//                           {item.quantity || 1}
//                         </span>
//                         <button
//   onClick={() =>
//     updateQuantity(item.id, item.size, (item.quantity || 1) + 1)
//   }
//                           className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
//                         >
//                           <Plus size={14} />
//                         </button>
//                       </div>
//                       <button
//                         onClick={() => removeFromCart(item.id, item.size)}
//                         className="text-gray-400 hover:text-red-600 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors"
//                       >
//                         <Trash2 size={12} /> Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* 2. Customer Details Form */}
//             <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-6 md:p-10 relative">
//               {/* Decorative Header */}
//               <div className="flex items-center gap-4 mb-10 border-b border-[#E5E7EB] pb-6">
//                 <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
//                   <MapPin size={24} />
//                 </div>
//                 <h2 className="text-2xl font-display text-[#111827]">
//                   Shipping Information
//                 </h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Full Name */}
//                 <div className="col-span-2 md:col-span-1">
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                       onBlur={handleBlur}
//                       placeholder="e.g. Anam Khan"
//                       className={`${inputBase} pl-12 ${errors.fullName ? inputErr : inputOk}`}
//                     />
//                     <User
//                       size={18}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                   </div>
//                   {errors.fullName && (
//                     <p className="text-red-500 text-xs mt-2">{errors.fullName}</p>
//                   )}
//                 </div>

//                 {/* Phone */}
//                 <div className="col-span-2 md:col-span-1">
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       onBlur={handleBlur}
//                       placeholder="0300 1234567"
//                       className={`${inputBase} pl-12 ${errors.phone ? inputErr : inputOk}`}
//                     />
//                     <Phone
//                       size={18}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                   </div>
//                   {errors.phone && (
//                     <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="col-span-2">
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       onBlur={handleBlur}
//                       placeholder="email@example.com"
//                       className={`${inputBase} pl-12 ${errors.email ? inputErr : inputOk}`}
//                     />
//                     <Mail
//                       size={18}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-2">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Region/Province */}
//                 <div className="col-span-2 md:col-span-1">
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
//                     Region / Province
//                   </label>
//                   <select
//                     name="region"
//                     value={formData.region}
//                     onChange={handleRegionChange}
//                     onBlur={handleBlur}
//                     className={`${inputBase} ${errors.region ? inputErr : inputOk}`}
//                   >
//                     <option value="">Select Region / Province</option>
//                     {REGIONS.map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.region && (
//                     <p className="text-red-500 text-xs mt-2">{errors.region}</p>
//                   )}
//                 </div>

//                 {/* City */}
//                 <div className="col-span-2 md:col-span-1 relative" ref={cityBoxRef}>
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={cityQuery}
//                     onChange={handleCityInputChange}
//                     onFocus={() => setShowCitySuggestions(true)}
//                     onBlur={handleBlur}
//                     disabled={!formData.region}
//                     placeholder={
//                       formData.region
//                         ? "Start typing your city..."
//                         : "Select a region first"
//                     }
//                     className={`${inputBase} ${errors.city ? inputErr : inputOk} disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`}
//                   />
//                   {errors.city && (
//                     <p className="text-red-500 text-xs mt-2">{errors.city}</p>
//                   )}
//                   {showCitySuggestions && citySuggestions.length > 0 && (
//                     <ul className="absolute z-20 mt-1 w-full bg-white border border-[#E5E7EB] rounded-sm shadow-lg max-h-48 overflow-y-auto">
//                       {citySuggestions.map((c) => (
//                         <li key={c}>
//                           <button
//                             type="button"
//                             onClick={() => handleCitySelect(c)}
//                             className="w-full text-left px-4 py-2.5 text-sm text-[#111827] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
//                           >
//                             {c}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 {/* Address */}
//                 <div className="col-span-2">
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
//                     Complete Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     onBlur={handleBlur}
//                     rows="3"
//                     placeholder="House No, Street, Area, Nearest Landmark..."
//                     className={`${inputBase} resize-none ${errors.address ? inputErr : inputOk}`}
//                   ></textarea>
//                   {errors.address && (
//                     <p className="text-red-500 text-xs mt-2">{errors.address}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Summary & COD Confirmation */}
//           <div className="lg:col-span-5 xl:col-span-4">
//             <div className="bg-white rounded-sm shadow-md border border-[#E5E7EB] p-8 md:p-10 sticky top-24">
//               <h2 className="text-2xl font-display text-[#111827] mb-8 border-b border-[#E5E7EB] pb-6">
//                 Order Summary
//               </h2>

//               <div className="space-y-6 text-sm text-gray-600 font-body">
//   <div className="flex justify-between items-center">
//     <span>Subtotal</span>
//     <span className="font-semibold text-[#111827]">
//       PKR {formatPrice(subtotal)}
//     </span>
//   </div>
//   <div className="flex justify-between items-center">
//     <span>Delivery Charges</span>
//     {deliveryCharges === 0 ? (
//       <span className="text-[#111827] font-bold text-[10px] bg-[#D4AF37] px-2 py-1 rounded-sm uppercase tracking-widest">
//         FREE
//       </span>
//     ) : (
//       <span className="font-semibold text-[#111827]">
//         PKR {formatPrice(deliveryCharges)}
//       </span>
//     )}
//   </div>

//   {/* ✅ FREE SHIPPING PROGRESS BAR */}
//   <div className="pt-2">
//     {deliveryCharges === 0 ? (
//       <div className="flex items-center gap-2 text-[11px] font-semibold text-green-600 uppercase tracking-widest">
//         <Truck size={13} />
//         <span>You've unlocked free shipping! 🎉</span>
//       </div>
//     ) : (
//       <div>
//         <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
//           <span className="flex items-center gap-1">
//             <Truck size={11} /> Free shipping at PKR 5,000
//           </span>
//           <span className="text-[#111827]">
//             PKR {formatPrice(5000 - subtotal)} away
//           </span>
//         </div>
//         <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
//             style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
//           />
//         </div>
//       </div>
//     )}
//   </div>
// </div>

//               <div className="border-t border-[#E5E7EB] my-8"></div>

//               <div className="flex justify-between items-end mb-10">
//                 <span className="text-[#111827] font-display text-xl">
//                   Total
//                 </span>
//                 <span className="text-3xl font-display font-semibold text-[#111827]">
//                   <span className="text-sm font-body font-normal text-gray-500 mr-2">
//                     PKR
//                   </span>
//                   {formatPrice(total)}
//                 </span>
//               </div>

//               {/* PAYMENT METHOD - COD ONLY */}
//               <div className="mb-10">
//                 <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
//                   Payment Method
//                 </label>
//                 <div className="flex items-center gap-4 p-4 border border-[#111827] bg-[#FAF8F3] rounded-sm relative overflow-hidden">
//                   <div className="absolute top-0 left-0 w-1 h-full bg-[#111827]"></div>
//                   <div className="bg-white p-3 rounded-sm shadow-sm border border-[#E5E7EB] ml-1">
//                     <Truck size={24} className="text-[#111827]" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-[#111827] text-sm uppercase tracking-wider">
//                       Cash on Delivery
//                     </p>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       Pay in cash upon receipt
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleCheckout}
//                 disabled={loading}
//                 className="w-full group bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-md flex items-center justify-center gap-3 border border-[#111827] disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" /> Processing...
//                   </>
//                 ) : (
//                   <>
//                     Confirm Order{" "}
//                     <ArrowRight
//                       size={16}
//                       className="group-hover:translate-x-1 transition-transform"
//                     />
//                   </>
//                 )}
//               </button>

//               <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-semibold uppercase tracking-widest">
//                 <ShieldCheck size={14} className="text-[#D4AF37]" />
//                 <span>Secure SSL Encrypted Checkout</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;

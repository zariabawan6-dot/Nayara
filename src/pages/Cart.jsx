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
  Mail,
  Loader2,
  CheckCircle,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // IMPORT useNavigate
import { useCart } from "../context/cartContext";
import { supabase } from "../api/supabase";
import { REGIONS, CITIES_BY_REGION } from "../data/pakistanLocations";
import { fbTrack } from "../lib/fbPixel";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // UI States
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    region: "",
  });

  // Validation State
  const [errors, setErrors] = useState({});

  // City Autocomplete State
  const [cityQuery, setCityQuery] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const citySuggestions =
    formData.region && cityQuery.trim().length > 0
      ? (CITIES_BY_REGION[formData.region] || []).filter((c) =>
          c.toLowerCase().startsWith(cityQuery.trim().toLowerCase()),
        )
      : [];

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 3) return "Enter your full name.";
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim()))
          return "Name should only contain letters.";
        return "";
      case "phone": {
        const digitsOnly = value.replace(/\s|-/g, "");
        if (!digitsOnly) return "Phone number is required.";
        if (!/^(\+92|0)3\d{9}$/.test(digitsOnly))
          return "Enter a valid Pakistani mobile number (e.g. 0300 1234567).";
        return "";
      }
      case "email": {
        if (!value.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim()))
          return "Enter a valid email address.";
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
        if (value.trim().length < 10)
          return "Please enter a more complete address.";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData((prev) => ({ ...prev, region, city: "" }));
    setCityQuery("");
    setErrors((prev) => ({
      ...prev,
      region: validateField("region", region),
      city: "",
    }));
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

  const inputBase =
    "w-full border rounded-sm px-4 py-4 text-sm text-[#111827] focus:outline-none transition-colors bg-gray-50 focus:bg-white";
  const inputOk = "border-[#E5E7EB] focus:border-[#D4AF37]";
  const inputErr = "border-red-400 focus:border-red-500";

  // --- CALCULATIONS ---
  const subtotal = cart.reduce(
    (acc, item) => acc + item.discount_price * (item.quantity || 1),
    0,
  );

  console.log(subtotal);

  const deliveryCharges = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + deliveryCharges;

  const formatPrice = (price) => new Intl.NumberFormat("en-PK").format(price);

  useEffect(() => {
    if (cart.length > 0) {
      fbTrack("InitiateCheckout", {
        content_ids: cart.map((item) => item.id),
        contents: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity || 1,
        })),
        value: total,
        currency: "PKR",
        num_items: cart.length,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- SUBMIT ORDER ---
  const handleCheckout = async () => {
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      region: validateField("region", formData.region),
      city: validateField("city", formData.city),
      address: validateField("address", formData.address),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (hasErrors) {
      alert("Please correct the highlighted fields before placing your order.");
      return;
    }

    setLoading(true);

    try {
      // 2. Prepare Payload
      const orderPayload = {
        cus_name: formData.fullName,
        total_amount: total,
        region: formData.region,
        city: formData.city,
        phone: formData.phone,
        mail: formData.email,
        address: formData.address,
        status: "Pending",
        payment_method: "COD",
      };

      // 3. Insert into Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select();

      if (error) throw error;

      // 4. Success Handling (Safe check)
      const newOrderId = data && data.length > 0 ? data[0].id : null;

      if (newOrderId) {
        // Insert into order_items
        const orderItemsPayload = cart.map((item) => ({
          order_id: newOrderId,
          product_id: item.id,
          quantity: item.quantity || 1,
          price_at_time: item.discount_price || item.price,
          size: item.size || "Standard",
          color: item.color || "As Shown",
        }));

        console.log(orderItemsPayload);

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsPayload);

        if (itemsError) {
          console.error("Failed to insert order items:", itemsError);
          // Assuming order was still placed, we might alert or log, but let's proceed
        }
      }

      fbTrack("Purchase", {
        content_ids: cart.map((item) => item.id),
        contents: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity || 1,
        })),
        value: total,
        currency: "PKR",
        num_items: cart.length,
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

  // --- SUCCESS VIEW ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="bg-[#D4AF37]/10 p-6 rounded-full shadow-sm mb-6 text-[#D4AF37] animate-in zoom-in duration-300">
          <CheckCircle size={64} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-display text-[#111827] mb-3">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-500 mb-2 max-w-md font-body text-sm">
          Thank you,{" "}
          <span className="font-semibold text-[#111827]">
            {formData.fullName}
          </span>
          . Your order is being processed.
        </p>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-sm shadow-sm mb-8 mt-4 text-sm text-gray-500">
          <p>
            Order Reference:{" "}
            <span className="font-mono text-[#111827] font-bold">
              #{orderId}
            </span>
          </p>
          <p className="mt-1">
            We will contact you at {formData.phone} for confirmation.
          </p>
        </div>
        <button
          onClick={() => navigate("/collections")}
          className="bg-[#111827] text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-black transition-colors shadow-md border border-[#111827]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // --- EMPTY CART VIEW ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="bg-white p-6 rounded-full shadow-sm border border-[#E5E7EB] mb-6 text-[#D4AF37]">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-display text-[#111827] mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-md font-body text-sm">
          It seems you haven't discovered our latest seasonal classics yet.
        </p>
        <button
          onClick={() => (window.location.href = "/shop")}
          className="bg-[#111827] text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-black transition-colors shadow-md border border-[#111827]"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // --- MAIN CART VIEW ---
  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-12 pb-24 font-body">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#111827] mb-8 transition-colors text-xs font-semibold uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </button>

        <div className="mb-12 text-center md:text-left border-b border-[#E5E7EB] pb-6">
          <h1 className="text-3xl md:text-4xl font-display text-[#111827]">
            Shopping Bag
          </h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-semibold text-[10px]">
            <span className="text-[#111827]">{cart.length} items</span> ready
            for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT COLUMN: Items & Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            {/* 1. Cart Items List */}
            <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] overflow-hidden p-6 md:p-10 space-y-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-[#E5E7EB] last:border-0 last:pb-0"
                >
                  <Link
                    to={`/shop/${item.id}`}
                    className="w-full sm:w-32 h-40 shrink-0 bg-gray-50 rounded-sm overflow-hidden group border border-[#E5E7EB]"
                  >
                    <img
                      src={item.images_urls[0]}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-display font-semibold text-[#111827] leading-tight">
                          {item.name}
                        </h3>
                        <p className="font-semibold text-[#111827] whitespace-nowrap">
                          PKR{" "}
                          {formatPrice(
                            item.discount_price * (item.quantity || 1),
                          )}
                        </p>
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mt-2">
                        Size: {item.size || "Standard"} | Color:{" "}
                        {item.color || "As Shown"}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-6">
                      <div className="flex items-center border border-[#E5E7EB] rounded-sm bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, (item.quantity || 1) - 1)
                          }
                          className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-[#111827] select-none">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, (item.quantity || 1) + 1)
                          }
                          className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Customer Details Form */}
            <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-6 md:p-10 relative">
              {/* Decorative Header */}
              <div className="flex items-center gap-4 mb-10 border-b border-[#E5E7EB] pb-6">
                <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-display text-[#111827]">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Anam Khan"
                      className={`${inputBase} pl-12 ${errors.fullName ? inputErr : inputOk}`}
                    />
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-2">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="0300 1234567"
                      className={`${inputBase} pl-12 ${errors.phone ? inputErr : inputOk}`}
                    />
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="email@example.com"
                      className={`${inputBase} pl-12 ${errors.email ? inputErr : inputOk}`}
                    />
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Region/Province */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Region / Province
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleRegionChange}
                    onBlur={handleBlur}
                    className={`${inputBase} ${errors.region ? inputErr : inputOk}`}
                  >
                    <option value="">Select Region / Province</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="text-red-500 text-xs mt-2">{errors.region}</p>
                  )}
                </div>

                {/* City */}
                <div className="col-span-2 md:col-span-1 relative" ref={cityBoxRef}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={cityQuery}
                    onChange={handleCityInputChange}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={handleBlur}
                    disabled={!formData.region}
                    placeholder={
                      formData.region
                        ? "Start typing your city..."
                        : "Select a region first"
                    }
                    className={`${inputBase} ${errors.city ? inputErr : inputOk} disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-2">{errors.city}</p>
                  )}
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full bg-white border border-[#E5E7EB] rounded-sm shadow-lg max-h-48 overflow-y-auto">
                      {citySuggestions.map((c) => (
                        <li key={c}>
                          <button
                            type="button"
                            onClick={() => handleCitySelect(c)}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#111827] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
                          >
                            {c}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Address */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Complete Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows="3"
                    placeholder="House No, Street, Area, Nearest Landmark..."
                    className={`${inputBase} resize-none ${errors.address ? inputErr : inputOk}`}
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-2">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & COD Confirmation */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-sm shadow-md border border-[#E5E7EB] p-8 md:p-10 sticky top-24">
              <h2 className="text-2xl font-display text-[#111827] mb-8 border-b border-[#E5E7EB] pb-6">
                Order Summary
              </h2>

              <div className="space-y-6 text-sm text-gray-600 font-body">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111827]">
                    PKR {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  {deliveryCharges === 0 ? (
                    <span className="text-[#111827] font-bold text-[10px] bg-[#D4AF37] px-2 py-1 rounded-sm uppercase tracking-widest">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-[#111827]">
                      PKR {formatPrice(deliveryCharges)}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] my-8"></div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-[#111827] font-display text-xl">
                  Total
                </span>
                <span className="text-3xl font-display font-semibold text-[#111827]">
                  <span className="text-sm font-body font-normal text-gray-500 mr-2">
                    PKR
                  </span>
                  {formatPrice(total)}
                </span>
              </div>

              {/* PAYMENT METHOD - COD ONLY */}
              <div className="mb-10">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
                  Payment Method
                </label>
                <div className="flex items-center gap-4 p-4 border border-[#111827] bg-[#FAF8F3] rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#111827]"></div>
                  <div className="bg-white p-3 rounded-sm shadow-sm border border-[#E5E7EB] ml-1">
                    <Truck size={24} className="text-[#111827]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] text-sm uppercase tracking-wider">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay in cash upon receipt
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full group bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-md flex items-center justify-center gap-3 border border-[#111827] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Confirm Order{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-semibold uppercase tracking-widest">
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
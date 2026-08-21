import React, { useState } from "react";
import { supabase } from "../api/supabase";
import { getOptimizedImageUrl } from "../lib/imageUtils";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
} from "lucide-react";

const statusConfig = {
  Pending: {
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
    label: "Order Pending",
    description: "Your order has been received and is being processed.",
    step: 1,
  },
  Shipped: {
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    label: "Order Shipped",
    description: "Your order is on its way. Expect delivery soon!",
    step: 2,
  },
  Delivered: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
    label: "Order Delivered",
    description: "Your order has been delivered successfully. Enjoy!",
    step: 3,
  },
  Cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    label: "Order Cancelled",
    description: "This order has been cancelled. Contact us if this was an error.",
    step: 0,
  },
};

const steps = [
  { label: "Order Placed", icon: Package },
  { label: "Processing", icon: Clock },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle },
];

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK").format(price);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) {
      setError("Please enter your Order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    try {
      const { data, error: dbError } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, product_images(file_path)))")
        .eq("id", trimmed)
        .single();

      if (dbError || !data) {
        setError("No order found with this ID. Please check and try again.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const config = order ? statusConfig[order.status] || statusConfig.Pending : null;

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">
            Nayara Zone
          </p>
          <h1 className="text-4xl font-display font-bold text-[#111827] mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-500 text-sm font-body">
            Enter your Order ID to get the latest status of your purchase.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="bg-white border border-[#E5E7EB] rounded-sm shadow-sm p-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Order ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 84fb4f-e4a1-42ed-b429-4a9b009533ad"
                className="flex-1 px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm text-[#111827] focus:outline-none focus:border-[#D4AF37] bg-gray-50 focus:bg-white transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  <>
                    <Search size={14} /> Track
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <p className="mt-3 text-xs text-gray-400">
              Your Order ID was sent via WhatsApp or is visible in your order confirmation.Add it withpu hash 
            </p>
          </div>
        </form>

        {/* Order Result */}
        {order && config && (
          <div className="space-y-6 animate-fadeIn">

            {/* Status Card */}
            <div className={`bg-white border rounded-sm shadow-sm overflow-hidden ${config.border}`}>
              <div className={`p-5 flex items-center gap-4 ${config.bg}`}>
                <config.icon className={`w-8 h-8 ${config.color}`} />
                <div className="flex-1">
                  <h2 className="font-display font-semibold text-[#111827] text-lg">
                    {config.label}
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">{config.description}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm ${config.badge}`}>
                  {order.status}
                </span>
              </div>

              {/* Progress Stepper — only for non-cancelled */}
              {order.status !== "Cancelled" && (
                <div className="px-6 py-5 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between relative">
                    {/* Track line */}
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#E5E7EB] z-0" />
                    <div
                      className="absolute left-0 top-4 h-0.5 bg-[#D4AF37] z-0 transition-all duration-500"
                      style={{ width: `${((config.step - 1) / 3) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = index < config.step;
                      const isCurrent = index === config.step - 1;
                      return (
                        <div
                          key={step.label}
                          className="relative z-10 flex flex-col items-center gap-2"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? "bg-[#D4AF37] border-[#D4AF37]"
                                : isCurrent
                                ? "bg-white border-[#D4AF37]"
                                : "bg-white border-[#E5E7EB]"
                            }`}
                          >
                            <StepIcon
                              size={14}
                              className={
                                isCompleted
                                  ? "text-white"
                                  : isCurrent
                                  ? "text-[#D4AF37]"
                                  : "text-gray-300"
                              }
                            />
                          </div>
                          <span
                            className={`text-[9px] uppercase tracking-widest font-bold whitespace-nowrap ${
                              isCompleted || isCurrent
                                ? "text-[#111827]"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="bg-white border border-[#E5E7EB] rounded-sm shadow-sm p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                  Order ID
                </p>
                <p className="text-[#111827] font-mono font-semibold">#{order.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                  Date Placed
                </p>
                <p className="text-[#111827] text-sm">
                  {new Date(order.created_at).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="col-span-2 border-t border-[#E5E7EB] pt-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 flex items-center gap-1">
                  <MapPin size={12} /> Shipping To
                </p>
                <p className="text-sm text-[#111827]">
                  {order.cus_name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {order.address}, {order.city}
                  {order.region ? `, ${order.region}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 flex items-center gap-1">
                  <Phone size={12} /> Phone
                </p>
                <p className="text-sm text-[#111827]">{order.phone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                  Total Amount
                </p>
                <p className="text-[#111827] font-semibold font-display">
                  PKR {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-sm shadow-sm p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-5">
                  Items Ordered
                </h3>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => {
                    const product = item.products || {};
                    const images = product.product_images || [];
                    const imageUrl = images.length > 0 ? getOptimizedImageUrl(images[0].file_path) : null;

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 py-3 border-b border-[#E5E7EB] last:border-0 last:pb-0"
                      >
                        <div className="w-14 h-18 rounded-sm overflow-hidden border border-[#E5E7EB] shrink-0 bg-gray-50">
                          {imageUrl && (
                            <img loading="lazy"
                              src={imageUrl}
                              alt={product.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#111827] text-sm">
                            {product.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Size: {item.size || "Standard"} &nbsp;|&nbsp; Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <p className="font-semibold text-[#111827] text-sm shrink-0">
                          PKR {formatPrice((item.price_at_time || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Help CTA */}
            <div className="text-center text-sm text-gray-500 pb-4">
              Have questions about your order?{" "}
              <a
                href="https://wa.me/923166071102?text=Hi%20Nayara%2C%20I%20have%20a%20question%20about%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                Chat with us on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Empty state after search with no result and no error */}
        {searched && !loading && !order && !error && (
          <div className="text-center text-gray-400 text-sm py-10">
            Enter your Order ID above to track your order.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { useCart } from "../context/cartContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartLength } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", to: "/shop" },
    {
      name: "Unstitched",
      to: "/shop?search=Unstitch",
      isNew: true,
    },
    {
      name: "Stitched",
      to: "/shop?category=Stitched&page=1&collection=Summer+Classics",
    },
    { name: "New Arrivals", to: "/shop?collection=New+Arrivals" },
    { name: "Sarees", to: "/shop?category=Sarees" },
  ];

  return (
    <div className="w-full sticky top-0 z-50 bg-white">
      {/* Premium Top Announcement Bar */}
      {/* Premium Top Announcement Bar */}
<div className="bg-[#111827] text-white text-[9px] sm:text-[11px] font-light tracking-[0.12em] uppercase overflow-hidden h-9 flex items-center">
  <div className="flex whitespace-nowrap animate-marquee">
    <span className="mx-8">
      Free Shipping on orders above{" "}
      <span className="font-medium text-[#D4AF37]">PKR 5,000</span>
    </span>

    <span className="text-gray-400">|</span>

    <span className="mx-8">
      WhatsApp:
      <span className="font-medium text-[#D4AF37] ml-1">
        +92 316 6071102
      </span>
    </span>


    <span className="text-gray-400">|</span>

    <span className="mx-8">
      Free Shipping on orders above{" "}
      <span className="font-medium text-[#D4AF37]">PKR 5,000</span>
    </span>
  </div>
</div>


      {/* Main Luxury Navbar */}
      <nav
        className={`w-full border-b border-[#E5E7EB] transition-all duration-500 ease-out bg-white/95 backdrop-blur-md
          ${isScrolled ? "py-3 shadow-[0_1px_10px_rgba(0,0,0,0.02)]" : "py-6"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Left Side: Brand Logo (Desktop) / Mobile Toggle */}
          <div className="flex items-center lg:flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1.5 text-[#111827] hover:text-[#8B6B1F] transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu size={22} strokeWidth={1.2} />
            </button>

            {/* Desktop Left-Aligned Logo (nudged further left) */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-3 group tracking-[0.25em] transition-transform duration-300 lg:-ml-4 xl:-ml-6"
            >
              <img
                src="/NAYARA.jpeg"
                alt="Nayara"
                className="h-25 w-25 object-contain rounded-full transform group-hover:scale-[1.01] transition-transform"
              />
              <span className="font-serif text-2xl font-bold text-[#111827] tracking-[0.3em] uppercase block transform group-hover:scale-[1.01]">
                Nayara
              </span>
            </Link>
          </div>

          {/* Mobile Center Logo */}
          <Link
            to="/"
            className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-2 tracking-[0.25em]"
          >
            <img
              src="/NAYARA.jpeg"
              alt="Naa"
              className="h-8 w-8 object-contain rounded-full"
            />
            <span className="font-serif text-xl font-bold text-[#111827] tracking-[0.25em] uppercase">
              Nayara
            </span>
          </Link>

          {/* Center Side: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="group relative py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B7280] transition-colors duration-300 hover:text-[#111827]"
              >
                <span>{link.name}</span>
                {/* Subtle Red Badge Ring for New Items */}
                {link.isNew && (
                  <span className="absolute -top-1 -right-2.5 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                )}
                {/* High-End Minimal Indicator Line */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#111827] transition-all duration-300 ease-out group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Side: Secondary Info + Luxury Utility Icons */}
          <div className="flex-1 flex justify-end items-center gap-5 sm:gap-7">
            {/* Info Links hidden on smaller viewports */}
            <Link
              to="/about"
              className="hidden lg:inline-block text-[10px] uppercase tracking-[0.18em] text-[#6B7280] hover:text-[#111827] transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hidden lg:inline-block text-[10px] uppercase tracking-[0.18em] text-[#6B7280] hover:text-[#111827] transition-colors font-medium"
            >
              Contact
            </Link>

            {/* Cart Button with Clean Micro-interactions */}
            <Link
              to="/cart"
              className="group relative p-1 text-[#111827] hover:text-[#8B6B1F] transition-colors duration-300"
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.2}
                className="transform transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[8px] font-medium text-white tracking-normal shadow-sm group-hover:bg-[#8B6B1F] transition-colors">
                {cartLength === 0 ? 0 : cartLength}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-[#111827]/30 backdrop-blur-sm transition-opacity duration-500
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-full max-w-[320px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Mobile Drawer Header */}
          <div className="px-6 py-6 border-b border-[#E5E7EB] flex justify-between items-center bg-[#FAF8F3]">
            <span className="flex items-center gap-2 font-serif text-xl font-bold tracking-[0.2em] text-[#111827] uppercase">
              <img
                src="/NAYARA.jpeg"
                alt="Nayara"
                className="h-8 w-8 object-contain rounded-full"
              />
              Nayara
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <X size={22} strokeWidth={1.2} />
            </button>
          </div>

          {/* Mobile Drawer Links */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  key={link.name}
                  to={link.to}
                  className="px-3 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-[#111827] hover:bg-[#FAF8F3] flex justify-between items-center transition-all duration-200 rounded-sm"
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    {link.isNew && (
                      <span className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white uppercase">
                        New
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    size={14}
                    strokeWidth={1.5}
                    className="text-[#6B7280] opacity-60"
                  />
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-[#E5E7EB] px-3 space-y-4">
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#6B7280] hover:text-[#111827]"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#6B7280] hover:text-[#111827]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductCollection from "./pages/ProductsListingPage";
import CartPage from "./pages/Cart";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutUs";
import ProductPreview from "./pages/productPreview";
import Navbar from "./components/Navbar";
import StorePolicies from "./pages/StorePolicies";
import OrderTracking from "./pages/OrderTracking";
import Footer from "./components/Footer";
import { fbTrack } from "./lib/fbPixel";
import WhatsAppButton from "./components/WhatsAppButton";
import { Link } from "react-router-dom";
import { useCart } from "./context/cartContext";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const location = useLocation();
  const { showCartFloat } = useCart();

  // useEffect(() => {
  //   if (typeof window !== "undefined" && typeof window.fbq === "function") {
  //     window.fbq("track", "PageView");
  //   }
  // }, [location.pathname]);

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}, [location.pathname, location.search]);

  return (
    <>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ProductCollection />} />
            <Route path="/shop/:id" element={<ProductPreview />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/storepolicies" element={<StorePolicies />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
          </Routes>
        </main>
         
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
        <Footer />

        <WhatsAppButton
          phoneNumber="923166071102"
          message="Hello! I'm interested in your suits at Nayara Zone 👗"
        />
      </div>
    </>
  );
}

export default App;






// import React, { useEffect } from "react";
// import { Route, Routes, useLocation } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ProductCollection from "./pages/ProductsListingPage";
// import CartPage from "./pages/Cart";
// import ContactPage from "./pages/ContactPage";
// import AboutPage from "./pages/AboutUs";
// import ProductPreview from "./pages/productPreview";
// import Navbar from "./components/Navbar";
// import StorePolicies from "./pages/StorePolicies";
// import { fbTrack } from "./lib/fbPixel";
// import WhatsAppButton from "./components/WhatsAppButton";
// // import Snowfall from "react-snowfall";

// function App() {
//   const location = useLocation();

//   // Fire a PageView on every in-app route change (SPA navigation
//   // doesn't trigger a full reload, so the Pixel's automatic
//   // PageView on page load only fires once otherwise).
//   useEffect(() => {
//     if (typeof window !== "undefined" && typeof window.fbq === "function") {
//       window.fbq("track", "PageView");
//     }
//   }, [location.pathname]);

//   return (
//     <>
//       {/* Main App Content */}
//       <div className="relative z-10">
//         <Navbar />

//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/shop" element={<ProductCollection />} />
//           <Route path="/shop/:id" element={<ProductPreview />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/storepolicies" element={<StorePolicies />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/about" element={<AboutPage />} />
//         </Routes>

//          <WhatsAppButton
//         phoneNumber="923166071102"
//         message="Hello! I'm interested in your suits at Nayara Zone 👗"
//       />
//       </div>
//     </>
//   );
// }

// export default App;

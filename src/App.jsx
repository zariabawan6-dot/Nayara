// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ProductCollection from "./pages/ProductsListingPage";
// import CartPage from "./pages/Cart";
// import ContactPage from "./pages/ContactPage";
// import AboutPage from "./pages/AboutUs";
// import ProductPreview from "./pages/productPreview";
// import Navbar from "./components/Navbar";
// import StorePolicies from "./pages/StorePolicies";
// // import Snowfall from "react-snowfall";

// function App() {
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
//       </div>
//     </>
//   );
// }

// export default App;

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
import { fbTrack } from "./lib/fbPixel";
// import Snowfall from "react-snowfall";

function App() {
  const location = useLocation();

  // Fire a PageView on every in-app route change (SPA navigation
  // doesn't trigger a full reload, so the Pixel's automatic
  // PageView on page load only fires once otherwise).
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);

  return (
    <>
      {/* Main App Content */}
      <div className="relative z-10">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductCollection />} />
          <Route path="/shop/:id" element={<ProductPreview />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/storepolicies" element={<StorePolicies />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
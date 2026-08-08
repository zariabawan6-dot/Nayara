import React from "react";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/FeaturedCategories.jsx";
import NewArrivalsSection from "../components/newArrivals.jsx";
import TestimonialsSection from "../components/Testimonials.jsx";
import CollectionBanner from "../components/Collectionbanner.jsx";
import OurPromise from "../components/OurPromise.jsx";
import Footer from "../components/Footer.jsx";

// --- Main Page Component ---

const HomePage = () => {
  // Set the main page background color via a wrapper div
  return (
    <div className="min-h-screen bg-white font-body">
      <main>
        <HeroSection />
        <CategorySection />
        <NewArrivalsSection />
        <TestimonialsSection />
        <CollectionBanner />
        <OurPromise />
      </main>
      <Footer />

    </div>
  );
};

export default HomePage;

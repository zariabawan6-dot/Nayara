import React from "react";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/FeaturedCategories.jsx";
import NewArrivalsSection from "../components/newArrivals.jsx";
import TestimonialsSection from "../components/Testimonials.jsx";
import CollectionBanner from "../components/Collectionbanner.jsx";
import OurPromise from "../components/OurPromise.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";

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


       {/* WhatsApp Floating Button */}
      <WhatsAppButton
        phoneNumber="923166071102"
        message="Hello! I'm interested in your suits at Nayara Zone 👗"
      />
    </div>
  );
};

export default HomePage;

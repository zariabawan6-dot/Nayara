import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CollectionBanner = () => {
  const content = {
    title: "The Velvet Royale",
    subtitle: "WINTER LUXURY '26",
    description:
      "An ode to timeless grace. Discover intricate embroideries and rich, deep textures redefining seasonal elegance for the modern Pakistani woman.",
    cta: "Explore Collection",
    // Premium, deep moody velvet/embroidery lookbook visual
    backgroundImage:
      "https://images.unsplash.com/photo-1701755488627-b75547a39988?q=80&w=2099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <section className="relative w-full h-[600px] md:h-[650px] lg:h-[700px] overflow-hidden bg-[#111827] font-body">
      {/* 1. Background Image with Premium Zoom */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[1.5s] ease-out scale-100 group-hover:scale-105"
        style={{
          backgroundImage: `url(${content.backgroundImage})`,
          backgroundPosition: "center 35%",
        }}
        aria-hidden="true"
      />

      {/* 2. Advanced High-End Asymmetrical Overlay */}
      {/* A dark horizontal gradient that clears visibility on the left for the text while keeping the rich textures on the right viewable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 via-[#111827]/50 to-transparent md:block hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent md:hidden" />

      {/* 3. Luxury Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-16 flex items-center">
        <div className="max-w-2xl text-left flex flex-col items-start">
          {/* Subtitle / Collection Tag */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 0.9, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] tracking-[0.25em] text-[10px] md:text-xs font-semibold uppercase mb-3 block"
          >
            {content.subtitle}
          </motion.span>

          {/* Luxury Accent Divider Line */}
          <div className="w-12 h-[1px] bg-[#D4AF37] mb-6" />

          {/* Main Title - Pure High-End Serif Styling */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-wide font-normal mb-6 leading-[1.1]"
          >
            {content.title}
          </motion.h2>

          {/* Editorial Description Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-300 text-xs sm:text-sm md:text-base font-light leading-relaxed tracking-wide max-w-lg mb-10"
          >
            {content.description}
          </motion.p>

          {/* Luxury Interactive CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              to="/shop"
              className="group/btn relative inline-flex items-center justify-center px-10 py-4 border border-white/80 bg-white text-[#111827] font-semibold tracking-[0.2em] text-[10px] md:text-xs uppercase overflow-hidden transition-all duration-300 hover:border-white rounded-none"
            >
              {/* Luxury Sliding Overlay Effect */}
              <span className="absolute inset-0 w-full h-full bg-[#111827] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>

              {/* Button Text */}
              <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">
                {content.cta}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Subtle Edge Shadow Line to cleanly segment sections */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5E7EB]/20 to-transparent" />
    </section>
  );
};

export default CollectionBanner;

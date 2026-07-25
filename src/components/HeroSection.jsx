import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const floatingCardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.6 },
    },
  };

  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden font-sans">
      {/* Main container – flex column on mobile, row on md+ */}
      <div className="flex flex-col-reverse md:flex-row min-h-screen">
        {/* ---------- LEFT SIDE (Text & CTAs) ---------- */}
        <div className="flex-1 flex items-center justify-center bg-[#FAF8F3] px-6 sm:px-12 lg:px-20 py-12 md:py-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D4AF37]/30 text-[#8B6B1F] text-xs tracking-[0.2em] uppercase font-semibold rounded-full shadow-sm">
                <Sparkles size={14} className="text-[#D4AF37]" />
                New Summer Collection 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-[#111827] mb-4"
            >
              Elevate Your Style <br />
              <span className="italic font-light text-[#6B7280]">
                With Timeless
              </span>{" "}
              <span className="relative inline-block">
                Pakistani Fashion
                {/* Gold underline accent */}
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#D4AF37]/60 rounded-full" />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#6B7280] font-light leading-relaxed max-w-md mt-6 mb-8"
            >
              Discover luxury pret, festive collections, and beautifully crafted
              designs made for every occasion.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <button
                onClick={() => navigate("/shop")}
                className="group relative px-8 py-4 bg-[#D4AF37] text-white font-medium uppercase tracking-wider text-sm rounded-sm transition-all duration-300 hover:bg-[#B8962E] hover:shadow-lg hover:shadow-[#D4AF37]/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Collection
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                {/* Shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
              </button>

              <button
                onClick={() => navigate("/shop?collection=New Arrivals")}
                className="group px-8 py-4 bg-transparent border border-[#D4AF37]/40 text-[#111827] font-medium uppercase tracking-wider text-sm rounded-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#FAF8F3]"
              >
                Explore New Arrivals
              </button>
            </motion.div>

            {/* Customer Rating – added as a subtle trust signal */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mt-10 pt-6 border-t border-[#E5E7EB]"
            >
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" stroke="none" />
                ))}
              </div>
              <span className="text-sm text-[#6B7280] font-medium">
                4.8 / 5 ·{" "}
                <span className="font-bold text-[#111827]">2,000+</span> reviews
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- RIGHT SIDE (Image & Floating Elements) ---------- */}
        <div className="flex-1 relative bg-[#FAF8F3] min-h-[50vh] md:min-h-screen">
          {/* Soft background shape */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#8B6B1F]/10 blur-2xl pointer-events-none" />

          {/* Main Image */}
          <img
            src="herosec.png"
            alt="NAYARA Luxury Pret Collection – model in elegant Pakistani attire"
            className="w-full h-full object-cover object-right relative z-10"
          />

          {/* Floating Product Highlight Card */}
          <motion.div
            variants={floatingCardVariants}
            initial="hidden"
            animate="visible"
            className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl p-4 max-w-[220px] border border-white/40"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-[#FAF8F3] flex-shrink-0">
                <img
                  src="herosec.png"
                  alt="Product highlight"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-[#D4AF37]/20 text-[#8B6B1F] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  New
                </span>
                <p className="text-sm font-semibold text-[#111827] mt-0.5">
                  Embroidered Lawn
                </p>
                <p className="text-xs text-[#6B7280]">PKR 8,990</p>
              </div>
            </div>
          </motion.div>

          {/* Collection Badge (top right) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-[#D4AF37]/20"
          >
            <p className="text-xs uppercase tracking-wider text-[#8B6B1F] font-medium">
              Festive Edit
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

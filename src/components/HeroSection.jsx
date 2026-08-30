
// export default HeroSection;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    image: "coverphoto.jpeg",
    badge: "New Summer Collection 2026",
    badgeIcon: true,
    headline: ["Elevate Your Style", "Pakistani Fashion"],
    headlineItalic: "With Timeless",
    description: "Discover luxury pret, festive collections, and beautifully crafted designs made for every occasion.",
    cta: "Shop Collection",
    ctaLink: "/shop",
    secondaryCta: "Explore New Arrivals",
    secondaryLink: "/shop?collection=New Arrivals",
    accentColor: "#D4AF37",
    bgColor: "#FAF8F3",
    cardLabel: "New",
    cardTitle: "Embroidered Lawn",
    cardPrice: "PKR 5,990",
    topBadge: "Festive Edit",
  },
  {
    id: 2,
    image: "banner-summer.png",
    badge: "Limited Time Only",
    badgeIcon: true,
    headline: ["Summer Clearance", "Sale"],
    headlineItalic: "Up to 50% Off",
    description: "Don't miss our biggest sale of the season. Grab your favourite lawn, pret, and festive pieces before they're gone.",
    cta: "Shop Sale",
    ctaLink: "/shop?collection=Sale",
    secondaryCta: "View All Deals",
    secondaryLink: "/shop",
    accentColor: "#D4AF37",
    bgColor: "#FAF8F3",
    cardLabel: "Sale",
    cardTitle: "Lawn Suits",
    cardPrice: "PKR 2,990",
    topBadge: "Clearance",
  },
  {
    id: 3,
    image: "banner-winter.png",
    badge: "Coming Soon",
    badgeIcon: false,
    headline: ["Winter", "Loading..."],
    headlineItalic: "New Season Ahead",
    description: "Cozy textures, rich embroideries, and warm tones — our winter collection is almost here. Get ready to layer up in style.",
    cta: "Shop Winter",
    ctaLink: "/shop?collection=Winter",
    secondaryCta: "Explore Now",
    secondaryLink: "/shop",
    accentColor: "#8B4513",
    bgColor: "#F5F0EB",
    cardLabel: "Coming Soon",
    cardTitle: "Winter Pret",
    cardPrice: "PKR 6,490",
    topBadge: "Winter Edit",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.35 } }),
  };

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden font-sans" style={{ backgroundColor: slide.bgColor }}>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          {/* ── LAYOUT: stacked on mobile, side-by-side on md+ ── */}
          <div className="flex flex-col md:flex-row min-h-screen">

            {/* TEXT SIDE — bottom on mobile, left on desktop */}
            <div
              className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20 py-10 md:py-0 order-2 md:order-1"
              style={{ backgroundColor: slide.bgColor }}
            >
              <div className="w-full max-w-xl">

                {/* Badge */}
                <div className="mb-6">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border text-xs tracking-[0.2em] uppercase font-semibold rounded-full shadow-sm"
                    style={{ borderColor: `${slide.accentColor}40`, color: slide.accentColor }}
                  >
                    {slide.badgeIcon && <Sparkles size={14} style={{ color: slide.accentColor }} />}
                    {slide.badge}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-[#111827] mb-4">
                  {slide.headline[0]} <br />
                  <span className="italic font-light text-[#6B7280]">{slide.headlineItalic}</span>{" "}
                  <span className="relative inline-block">
                    {slide.headline[1]}
                    <span
                      className="absolute -bottom-2 left-0 w-full h-1 rounded-full"
                      style={{ backgroundColor: `${slide.accentColor}60` }}
                    />
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-[#6B7280] font-light leading-relaxed max-w-md mt-6 mb-8">
                  {slide.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <button
                    onClick={() => navigate(slide.ctaLink)}
                    className="group relative px-8 py-4 text-white font-medium uppercase tracking-wider text-sm rounded-sm transition-all duration-300 hover:shadow-lg overflow-hidden"
                    style={{ backgroundColor: slide.accentColor }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
                  </button>
                  <button
                    onClick={() => navigate(slide.secondaryLink)}
                    className="group px-8 py-4 bg-transparent border text-[#111827] font-medium uppercase tracking-wider text-sm rounded-sm transition-all duration-300 hover:bg-white/60"
                    style={{ borderColor: `${slide.accentColor}50` }}
                  >
                    {slide.secondaryCta}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-10 pt-6 border-t border-[#E5E7EB]">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#D4AF37" stroke="none" />
                    ))}
                  </div>
                  <span className="text-sm text-[#6B7280] font-medium">
                    4.8 / 5 · <span className="font-bold text-[#111827]">2,000+</span> reviews
                  </span>
                </div>
              </div>
            </div>

            {/* IMAGE SIDE — top on mobile, right on desktop */}
            <div
              className="flex-1 relative min-h-[55vw] md:min-h-screen order-1 md:order-2"
              style={{ backgroundColor: slide.bgColor }}
            >
              {/* Glow blobs */}
              <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#8B6B1F]/10 blur-2xl pointer-events-none" />

              {/* Main image */}
              <img
                src={slide.image}
                alt={slide.badge}
                className="w-full h-full object-cover object-top relative z-10"
              />

              {/* Floating product card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`absolute ${slide.id === 1 ? 'left-2' : 'right-2'} top-[65%] -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl p-2.5 max-w-[160px] border border-white/40`}
                // className="absolute left-2 top-[65%] -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl p-2.5 max-w-[160px] border border-white/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-[#FAF8F3] flex-shrink-0">
                    <img src={slide.image} alt="Product" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <span
                      className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm"
                      style={{ backgroundColor: `${slide.accentColor}20`, color: slide.accentColor }}
                    >
                      {slide.cardLabel}
                    </span>
                    <p className="text-[11px] font-semibold text-[#111827] mt-0.5">{slide.cardTitle}</p>
                    <p className="text-[10px] text-[#6B7280]">{slide.cardPrice}</p>
                  </div>
                </div>
              </motion.div>

              {/* Top badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-white/40"
              >
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: slide.accentColor }}>
                  {slide.topBadge}
                </p>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-[28%] md:top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm hover:bg-white transition rounded-full p-2 shadow-lg"
      >
        <ChevronLeft size={20} className="text-[#111827]" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-[28%] md:top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm hover:bg-white transition rounded-full p-2 shadow-lg"
      >
        <ChevronRight size={20} className="text-[#111827]" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === current ? slide.accentColor : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
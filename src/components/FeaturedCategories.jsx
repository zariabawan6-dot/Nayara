import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeaturedCategories = () => {
  const categories = [
    {
      id: "unstitched",
      title: "Unstitched",
      description: "Premium embroidered fabrics.",
      // High-end editorial shot with elegant draped textile aesthetics
      image:
        "https://images.unsplash.com/photo-1702974779825-7103511e5471?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/shop?category=Unstitched",
      className: "col-span-12 md:col-span-8",
    },
    {
      id: "stitched",
      title: "Stitched",
      description: "Ready-to-wear luxury.",
      // Clean luxury pret dress shot reflecting ready-to-wear silhouette
      image:
        "https://images.unsplash.com/photo-1733470381571-c3d082e68457?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/shop?category=Stitched",
      className: "col-span-12 md:col-span-4",
    },
    {
      id: "sale",
      title: "Special Sale",
      description: "Up to 50% Off.",
      // Dramatic fashion shoot with a warm, editorial beige/gold sunlit atmosphere
      image:
        "https://images.unsplash.com/photo-1705920821957-5d1a22a1d829?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/shop?collection=Summer+Classics",
      className: "col-span-12 md:col-span-6",
    },
    {
      id: "view-all",
      title: "View All Collections",
      description: "Explore the complete NAYARA range.",
      image: "", // No image for this card, solid background
      link: "/shop",
      className: "col-span-12 md:col-span-6",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-20 bg-[#FAF8F3] font-body">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <p className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-2">
                Curated Edits
              </p>
              <h2 className="text-[#111827] font-serif text-4xl md:text-5xl lg:text-6xl text-left font-bold tracking-tight">
                Shop by Category
              </h2>
            </div>

            <div className="hidden md:block w-32 h-[1px] bg-[#D4AF37] mb-4"></div>

            <Link
              to="/shop"
              className="text-[#111827] font-semibold text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors relative group inline-block w-max"
            >
              Explore All
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              className={`${cat.className} group relative overflow-hidden rounded-sm h-[300px] sm:h-[400px] lg:h-[450px]`}
            >
              <Link to={cat.link} className="block w-full h-full">
                {/* Background (Image or Solid) */}
                {cat.image ? (
                  <>
                    <div className="absolute inset-0 bg-[#111827]/20 group-hover:bg-[#111827]/40 transition-colors duration-500 z-10" />
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-[#FAF8F3] border border-[#E5E7EB] transition-colors duration-500 group-hover:bg-[#111827] flex items-center justify-center p-8 text-[#111827]" />
                )}

                {/* Content Overlay */}
                <div
                  className={`absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8 
                  ${
                    cat.image
                      ? "bg-gradient-to-t from-[#111827]/90 via-[#111827]/30 to-transparent"
                      : ""
                  }`}
                >
                  <h3
                    className={`font-serif text-3xl sm:text-4xl mb-2 transition-colors duration-300 ${
                      cat.image
                        ? "text-white font-medium"
                        : "text-[#111827] group-hover:text-white"
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`font-body text-sm font-light tracking-wide transition-colors duration-300 ${
                      cat.image
                        ? "text-gray-200"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  >
                    {cat.description}
                  </p>

                  {/* Fake Button/Arrow on hover */}
                  <div
                    className={`mt-4 w-10 h-[1px] transition-all duration-300 ${
                      cat.image
                        ? "bg-white group-hover:w-16"
                        : "bg-[#111827] group-hover:bg-[#D4AF37] group-hover:w-16"
                    }`}
                  ></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

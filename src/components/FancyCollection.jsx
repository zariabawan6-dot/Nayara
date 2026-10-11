import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../api/supabase";

// Must match the name you added to COLLECTIONS in AddProduct / EditProduct
const COLLECTION_NAME = "Fancy Collection";

const getImageUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("https://")) return filePath;
  return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
};

const formatPrice = (n) => `PKR ${Number(n).toLocaleString("en-PK")}`;

const FancyCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, fabric, category, price, discount_price, is_out_of_stock, product_images(file_path, is_primary)")
        .eq("collection", COLLECTION_NAME)
        .or("is_published.is.null,is_published.eq.true")
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error) setProducts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    el.scrollBy({ left: dir * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Hide the whole section until at least one product exists
  if (!loading && products.length === 0) return null;

  return (
    <section className="bg-[#111827] py-20 md:py-28 font-body overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="col-span-12 lg:col-span-4"
          >
            <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-4">
              Occasion wear
            </p>
            <h2 className="font-serif text-white text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              The Fancy Collection
            </h2>
            <p className="mt-6 text-gray-300 font-light leading-relaxed max-w-sm">
              Heavy embroidery, zari and handwork for weddings, mehndi and Eid.
              Each piece is made in limited quantities.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                to={`/shop?collection=${encodeURIComponent(COLLECTION_NAME)}`}
                className="px-8 py-4 bg-[#D4AF37] text-[#111827] text-sm font-medium uppercase tracking-wider rounded-sm hover:bg-white transition-colors duration-300"
              >
                Shop Fancy
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => scrollByCard(-1)}
                  aria-label="Previous"
                  className="p-2.5 border border-white/20 text-white rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] transition-colors"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => scrollByCard(1)}
                  aria-label="Next"
                  className="p-2.5 border border-white/20 text-white rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] transition-colors"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="col-span-12 lg:col-span-8 -mr-6 sm:-mr-12 lg:mr-[calc((100vw-80rem)/-2)]">
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pr-6 sm:pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="shrink-0 w-[70%] sm:w-[44%] lg:w-[300px]">
                      <div className="aspect-[3/4] bg-[#1f2937] animate-pulse rounded-sm" />
                    </div>
                  ))
                : products.map((p) => {
                    const imgs = p.product_images || [];
                    const primary = imgs.find((i) => i.is_primary) || imgs[0];
                    const onSale = p.discount_price && p.discount_price < p.price;
                    return (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        data-card
                        className="group snap-start shrink-0 w-[70%] sm:w-[44%] lg:w-[300px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#1f2937]">
                          {primary && (
                            <img
                              src={getImageUrl(primary.file_path)}
                              alt={p.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          )}
                          {p.is_out_of_stock && (
                            <span className="absolute top-3 left-3 bg-[#FAF8F3] text-[#111827] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                              Sold out
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <h3 className="font-serif text-white text-lg leading-snug">{p.name}</h3>
                          <p className="text-gray-400 text-sm font-light mt-1">
                            {[p.category, p.fabric].filter(Boolean).join(" · ")}
                          </p>
                          <p className="text-sm mt-2">
                            <span className="text-[#D4AF37] font-medium">
                              {formatPrice(onSale ? p.discount_price : p.price)}
                            </span>
                            {onSale && (
                              <span className="ml-2 text-gray-500 line-through">
                                {formatPrice(p.price)}
                              </span>
                            )}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FancyCollection;
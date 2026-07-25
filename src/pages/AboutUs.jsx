import React from "react";
import { Star, Heart, Scissors, MapPin } from "lucide-react";
import Footer from "../components/Footer";

const AboutPage = () => {
  // Brand Assets
  const brandImage = "readytowear.jpeg"; // South Asian fashion aesthetic
  const fabricImage = "winter.jpg"; // Texture detail

  const values = [
    {
      id: 1,
      icon: <Scissors size={24} strokeWidth={1.5} />,
      title: "Intricate Craftsmanship",
      text: "Every stitch tells a story. We blend traditional embroidery techniques with modern cuts to create pieces that honor our heritage.",
    },
    {
      id: 2,
      icon: <Star size={24} strokeWidth={1.5} />,
      title: "Premium Fabrics",
      text: "We hand-pick the finest Lawns, Chiffons, and Silks. Our commitment to quality ensures that our clothes feel as good as they look.",
    },
    {
      id: 3,
      icon: <Heart size={24} strokeWidth={1.5} />,
      title: "The Modern Woman",
      text: "Designed for the dynamic lives of Pakistani women—from the boardroom to the wedding hall, we offer elegance for every occasion.",
    },
    {
      id: 4,
      icon: <MapPin size={24} strokeWidth={1.5} />,
      title: "Nationwide Trust",
      text: "From Karachi’s coast to the hills of Islamabad, NAYARA has become a household name for reliability and style.",
    },
  ];

  return (
    <>
      <section className="bg-[#FAF8F3] min-h-screen font-body">
        {/* --- HERO SECTION (Split Layout) --- */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <span className="text-[#D4AF37] font-semibold tracking-[0.2em] text-[10px] uppercase mb-4 block">
                Since 2018
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#111827] mb-8 leading-tight">
                Weaving Tradition <br />
                <span className="italic font-light text-gray-500">
                  into Modern Grace.
                </span>
              </h1>

              <div className="space-y-6 text-gray-500 text-base leading-relaxed font-body">
                <p>
                  Welcome to <strong className="text-[#111827]">NAYARA</strong>,
                  where the timeless beauty of Eastern fashion meets the
                  contemporary needs of the Pakistani woman.
                </p>
                <p>
                  What started as a small boutique in Lahore with a vision to
                  redefine "Accessible Luxury" has now grown into a beloved
                  brand across the nation. We believe that style shouldn't come
                  at the cost of comfort or quality.
                </p>
                <p>
                  Our collections are a celebration of color, culture, and
                  confidence. Whether it's our breezy Summer Lawns or our
                  opulent Festive Edits, every piece is designed to make you
                  feel your best.
                </p>
              </div>

              <div className="mt-12 border-t border-[#E5E7EB] pt-8 inline-block">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                  Creative Director
                </p>
                <p className="font-display text-2xl text-[#111827] italic">
                  Zaryab Awan
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden shadow-xl border border-[#E5E7EB]">
                <img
                  src={brandImage}
                  alt="NAYARA Fashion"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md p-6 rounded-sm shadow-lg max-w-xs hidden md:block border border-[#E5E7EB]">
                  <p className="font-display text-lg text-[#111827] italic leading-relaxed">
                    "Elegance is not about being noticed, it's about being
                    remembered."
                  </p>
                </div>
              </div>
              {/* Decorative Offset Border */}
              <div className="absolute -z-10 top-6 -right-6 w-full h-full border border-[#D4AF37] rounded-sm hidden lg:block"></div>
            </div>
          </div>
        </div>

        {/* --- CORE VALUES GRID --- */}
        <div className="bg-white py-24 border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="text-center mb-16">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37] mb-3 block">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-[#111827] mb-6">
                The NAYARA Standard
              </h2>
              <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((val) => (
                <div
                  key={val.id}
                  className="group p-8 bg-[#FAF8F3] rounded-sm hover:bg-white border border-transparent hover:border-[#E5E7EB] hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center"
                >
                  <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-300">
                    {val.icon}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-[#111827] mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-body">
                    {val.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- VISION / FABRIC SECTION --- */}
        <div className="relative py-32 overflow-hidden bg-[#111827]">
          <div className="absolute inset-0 z-0">
            <img
              src={fabricImage}
              alt="Fabric Texture"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/90 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-[#D4AF37] font-semibold tracking-[0.2em] text-[10px] uppercase mb-4 block">
                The Promise
              </span>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-8 leading-tight">
                Designed for Pakistan, <br />
                Trusted Nationwide.
              </h2>
              <p className="text-gray-300 text-base font-body leading-relaxed mb-10 max-w-xl">
                We understand the climate, the culture, and the expectations of
                our audience. From breathable lawns for the scorching summer to
                rich velvets for the festive winter, NAYARA is committed to
                providing premium fashion that fits your life and your budget.
              </p>
              <button
                onClick={() => (window.location.href = "/collections")}
                className="bg-transparent border border-white text-white px-10 py-4 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-[#111827] transition-colors shadow-sm"
              >
                Explore Collections
              </button>
            </div>

            {/* Stats / Trust Markers */}
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div className="text-center">
                <span className="block text-5xl md:text-6xl font-display text-[#D4AF37] mb-3 drop-shadow-md">
                  50k+
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Happy Customers
                </span>
              </div>
              <div className="text-center">
                <span className="block text-5xl md:text-6xl font-display text-[#D4AF37] mb-3 drop-shadow-md">
                  100%
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Authentic Design
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutPage;

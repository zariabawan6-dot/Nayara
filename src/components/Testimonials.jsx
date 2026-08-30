import React from "react";

const TrustBar = () => {
  const stats = [
    { icon: "🛍️", number: "2,000+", label: "Orders Delivered" },
    { icon: "🔄", number: "5-Day", label: "Easy Returns" },
    { icon: "📦", number: "Open", label: "Parcel Allowed" },
    { icon: "🚚", number: "All PK", label: "Nationwide Delivery" },
    { icon: "💵", number: "COD", label: "Cash on Delivery" },
  ];

  return (
    <section className="bg-[#111827] py-10 px-6 font-body">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 divide-x divide-[#D4AF37]/20">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center px-4 py-6">
            <span className="text-2xl mb-3">{stat.icon}</span>
            <p className="text-[#D4AF37] text-xl font-display font-semibold mb-1">
              {stat.number}
            </p>
            <div className="w-8 h-[1px] bg-[#D4AF37]/30 mb-2" />
            <p className="text-white/50 text-[10px] uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
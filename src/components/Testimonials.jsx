import React from 'react';
import { Quote, Star } from 'lucide-react'; 

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Aisha K.',
      location: 'Lahore, Pakistan',
      quote: "NAYARA has redefined elegance for me. The quality is unparalleled. Their Festive Edit made me feel royally chic!",
      rating: 5,
    },
    {
      id: 2,
      name: 'Zainab F.',
      location: 'Karachi, Pakistan',
      quote: "Every piece from NAYARA feels bespoke. Their attention to detail and fabric choices are simply exquisite. Highly recommend!",
      rating: 5,
    },
    {
      id: 3,
      name: 'Nida R.',
      location: 'Islamabad, Pakistan',
      quote: "The Unstitched collection allowed me to create a unique outfit. The fabric quality and embroidery are stunning, perfect for any occasion.",
      rating: 4,
    },
    {
      id: 4,
      name: 'Sana J.',
      location: 'Faisalabad, Pakistan',
      quote: "From their customer service to the final product, NAYARA exudes professionalism and luxury. My new favourite for Pakistani wear.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#FAF8F3] w-full font-body">

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37] mb-3 block">
            Endorsements
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-[#111827] mb-4">
            Voices of Our Patrons
          </h2>
          <p className="text-lg font-body text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Trusted by discerning women across Pakistan for unparalleled quality and style.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="group flex flex-col p-8 bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden border-t-2 border-transparent hover:border-[#D4AF37]"
            >
              {/* Quote Icon */}
              <Quote size={48} strokeWidth={1} className="absolute top-4 left-4 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/20 transition-colors duration-300" />
              
              {/* Testimonial Text */}
              <p className="font-body text-gray-600 text-sm leading-relaxed mb-6 italic pt-8 flex-1">
                "{testimonial.quote}"
              </p>

              {/* Rating Stars */}
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < testimonial.rating ? '#D4AF37' : 'none'} 
                    stroke={i < testimonial.rating ? '#D4AF37' : '#E5E7EB'} 
                    strokeWidth={1.5} 
                    className="mr-1"
                  />
                ))}
              </div>

              {/* Author Info (No Image, use styled initials avatar) */}
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F3] flex items-center justify-center border border-[#E5E7EB] mr-4 text-[#111827] font-display font-bold">
                    {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-lg text-[#111827] font-semibold leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="font-body text-[10px] uppercase tracking-wider text-gray-400 mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action for More Testimonials */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-10 py-4 bg-transparent border border-[#111827] text-[#111827] font-semibold uppercase text-xs tracking-widest hover:bg-[#111827] hover:text-white transition-all duration-300 ease-in-out rounded-sm">
            Read More Stories
          </button>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
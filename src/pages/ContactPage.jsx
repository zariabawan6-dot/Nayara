import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, Instagram, Facebook } from "lucide-react";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Order Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you! Team NAYARA will contact you shortly.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "Order Inquiry",
        message: "",
      });
    }, 1500);
  };

  return (
    <>
      <section className="min-h-screen bg-[#FAF8F3] py-16 md:py-24 font-body">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* --- HERO HEADER --- */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#D4AF37] font-semibold tracking-[0.2em] text-[10px] uppercase mb-4 block">
              Customer Care
            </span>
            <h1 className="text-4xl md:text-5xl font-display text-[#111827] mb-6">
              We’d Love to Hear from You
            </h1>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 font-body text-base leading-relaxed">
              Whether you have a query about your order, need style advice, or
              simply want to share your feedback, our team in Pakistan is here
              to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* --- LEFT COLUMN: INFO & MAP --- */}
            <div className="lg:col-span-5 space-y-10">
              {/* Contact Details Cards */}
              <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-[#E5E7EB]">
                <h3 className="text-2xl font-display text-[#111827] mb-8">
                  Flagship Studio
                </h3>

                <div className="space-y-8">
                  {/* Location */}
                  <div className="flex items-start gap-4 group">
                    <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#111827] transition-all duration-300">
                      <MapPin size={24} strokeWidth={1.5} />
                    </div>
                    <div className="mt-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#111827] mb-2">
                        Visit Us
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed font-body">
                        Shop 45, Anar Kali Bazar,
                        <br />
                        Anar Kali, FSD, Pakistan.
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#111827] transition-all duration-300">
                      <Phone size={24} strokeWidth={1.5} />
                    </div>
                    <div className="mt-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#111827] mb-2">
                        Contact Us
                      </h4>
                      <p className="text-gray-500 text-sm font-body">
                        +92 300 0000000 <br />
                        <span className="text-[10px] text-gray-400 mt-1 inline-block uppercase tracking-wider font-semibold">
                          (Mon-Sat, 11 AM - 8 PM)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#111827] transition-all duration-300">
                      <Mail size={24} strokeWidth={1.5} />
                    </div>
                    <div className="mt-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#111827] mb-2">
                        Email Us
                      </h4>
                      <p className="text-gray-500 text-sm font-body">
                        care@nayara.pk
                      </p>
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div className="mt-10 pt-8 border-t border-[#E5E7EB] flex gap-6">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#111827] transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#111827] transition-colors"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#111827] transition-colors"
                  >
                    <AiFillTikTok size={24} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#111827] transition-colors"
                  >
                    <IoLogoWhatsapp size={24} />
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative h-64 w-full rounded-sm overflow-hidden shadow-sm border border-[#E5E7EB] bg-gray-50 group">
                {/* This iframe is a standard Google Embed for Lahore - No API key needed for basic embeds */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.400890297021!2d72.66137257584585!3d32.085449273960315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392177a9b78b5969%3A0xc2303187b4f1b304!2sKachari%20Bazar%20Rd%2C%20Sargodha%2C%20Pakistanas!5e0!3m2!1slt!2s!4v1764410204785!5m2!1slt!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-[#D4AF37] transition-colors duration-500"></div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: CONTACT FORM --- */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-[#E5E7EB]">
                <h2 className="text-3xl font-display text-[#111827] mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-500 text-sm mb-10 font-body">
                  Please fill out the form below. We usually respond within 24
                  hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sara Ahmed"
                        className="w-full bg-gray-50 border border-[#E5E7EB] rounded-sm px-4 py-4 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-body"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0300 1234567"
                        className="w-full bg-gray-50 border border-[#E5E7EB] rounded-sm px-4 py-4 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-body"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-gray-50 border border-[#E5E7EB] rounded-sm px-4 py-4 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-body"
                    />
                  </div>

                  {/* Reason Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Reason for Contact
                    </label>
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-[#E5E7EB] rounded-sm px-4 py-4 text-sm text-[#111827] appearance-none focus:outline-none focus:border-[#D4AF37] focus:bg-white cursor-pointer font-body transition-all"
                      >
                        <option>Order Inquiry</option>
                        <option>Product Information</option>
                        <option>Returns & Exchanges</option>
                        <option>Wholesale / Collaboration</option>
                        <option>Other</option>
                      </select>
                      {/* Custom Arrow */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you today?"
                      className="w-full bg-gray-50 border border-[#E5E7EB] rounded-sm px-4 py-4 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all resize-none font-body"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-[#111827] text-white py-4 rounded-sm font-semibold uppercase tracking-widest text-xs hover:bg-black transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-[#111827]"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && (
                      <Send
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* --- FOOTER TAGLINE --- */}
          <div className="mt-20 text-center border-t border-[#E5E7EB] pt-12">
            <p className="text-gray-500 font-display italic text-2xl mb-4">
              "Redefining elegance for the modern Pakistani woman."
            </p>
            <p className="text-[10px] text-[#111827] uppercase tracking-[0.3em] font-semibold">
              Team NAYARA • Faisalabad • Lahore • Karachi • Islamabad
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

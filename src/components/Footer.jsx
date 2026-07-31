import React from "react";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";

const Footer = () => {
  const linkClass =
    "text-sm font-body text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 tracking-wide";
  const iconClass =
    "w-5 h-5 text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 cursor-pointer";

  return (
    <footer className="bg-[#111827] pt-20 pb-10 border-t-4 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {/* <img src="/NAYARA.jpeg" alt="Nayara" className="h-15 w-15 object-contain rounded-full" /> */}
              <h4 className="text-3xl font-display font-bold text-white tracking-widest uppercase">NAYARA</h4>
            </div>
            <p className="text-sm font-body text-gray-400 leading-relaxed">
              A celebrated Pakistani female fashion house offering a blend of
              rich traditional outfits and modern, elegant pret wear. Experience
              the luxury of premium fabrics.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Shop</h5>
            <ul className="space-y-4">
              <li><a href="#" className={linkClass}>New Arrivals</a></li>
              <li><a href="#" className={linkClass}>Stitched Suits</a></li>
              <li><a href="#" className={linkClass}>Unstitched Fabrics</a></li>
              <li><a href="#" className={linkClass}>Sale Items</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Service</h5>
            <ul className="space-y-4">
              <li><a href="#" className={linkClass}>My Account</a></li>
              <li><a href="#" className={linkClass}>Order Tracking</a></li>
              <li><a href="#" className={linkClass}>Returns & Exchange</a></li>
              <li><a href="#" className={linkClass}>FAQ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Contact Us</h5>
            <div className="space-y-4 text-sm font-body text-gray-400">
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-[#D4AF37]" />
                <span>Faisalabad, Pakistan</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-[#D4AF37]" />
                <span>+92 316 6071102</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-[#D4AF37]" />
                <span>info@nayara.pk</span>
              </p>
              <p className="flex items-start">
                <Clock className="w-4 h-4 mr-3 mt-0.5 text-[#D4AF37]" />
                <span>Mon-Sat: 10am - 7pm (PKT)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex space-x-6">
            <a href="https://instagram.com/nayara_zone.pk" target="_blank" rel="noopener noreferrer"><Instagram className={iconClass} /></a>
            <a href="https://www.facebook.com/Nayarazone" target="_blank" rel="noopener noreferrer"><Facebook className={iconClass} /></a>
            <AiFillTikTok className={iconClass} />
            <a href="https://wa.me/923166071102" target="_blank" rel="noopener noreferrer"><IoLogoWhatsapp className={iconClass} /></a>
          </div>
          <div className="text-xs font-body text-gray-500 uppercase tracking-wider text-center md:text-right space-y-1 md:space-y-0 md:space-x-2">
            <span>&copy; {new Date().getFullYear()} NAYARA. All rights reserved.</span>
            <span className="hidden md:inline text-gray-700">|</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
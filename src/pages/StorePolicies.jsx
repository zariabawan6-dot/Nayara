import React from 'react';
import { PackageOpen, RefreshCw, AlertCircle, MessageCircle, CheckCircle2 } from 'lucide-react';
import { FaSquareWhatsapp } from "react-icons/fa6";

const StorePolicies = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20 font-body">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <span className="text-[#D4AF37] font-semibold tracking-[0.2em] text-[10px] uppercase mb-4 block">
          Customer Care
        </span>
        <h2 className="text-3xl md:text-5xl font-display text-[#111827] mb-6">
          Our Policies
        </h2>
        <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto font-body leading-relaxed">
          We believe in transparency. Please review our shipping and exchange guidelines below to ensure a smooth shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Policy Card 1: Open Parcel */}
        <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm p-8 hover:shadow-lg hover:border-[#D4AF37] transition-all duration-300">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-[#FAF8F3] rounded-full shrink-0 border border-[#E5E7EB]">
              <PackageOpen className="w-6 h-6 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#111827] mb-3">Open Parcel Policy</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-body">
                We offer an Open Parcel facility to ensure your satisfaction. 
                <span className="block mt-4 font-semibold text-[#111827] text-xs uppercase tracking-widest bg-gray-50 p-3 rounded-sm border border-[#E5E7EB]">
                  Note: You must pay delivery charges before opening the parcel seal.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Policy Card 2: Exchange Window */}
        <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm p-8 hover:shadow-lg hover:border-[#D4AF37] transition-all duration-300">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-[#FAF8F3] rounded-full shrink-0 border border-[#E5E7EB]">
              <RefreshCw className="w-6 h-6 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#111827] mb-3">5-Day Exchange</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-body">
                Exchanges are valid within 5 days of delivery. We are happy to facilitate exchanges provided the item is unused and original tags are intact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Section */}
      <div className="mt-12 bg-white rounded-sm p-8 md:p-12 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF8F3] rounded-bl-full -z-10"></div>
        
        <h3 className="text-xl font-display font-semibold text-[#111827] mb-8 flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
          <AlertCircle className="w-6 h-6 text-[#D4AF37]" />
          Exchange Scenarios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Scenario A: Seller Fault */}
          <div className="bg-gray-50 p-6 rounded-sm border border-[#E5E7EB]">
            <h4 className="font-display font-semibold text-[#111827] mb-4 flex items-center gap-3 text-lg">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              Company Fault
            </h4>
            <p className="text-sm text-gray-600 mb-4 font-body leading-relaxed">
              If we deliver the <strong className="text-[#111827]">wrong article</strong> or a <strong className="text-[#111827]">damaged product</strong>, we take full responsibility.
            </p>
            <ul className="text-sm text-gray-600 space-y-3 font-body">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span> Free exchange processing.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span> We cover all delivery charges.
              </li>
            </ul>
          </div>

          {/* Scenario B: Customer Fault */}
          <div className="bg-gray-50 p-6 rounded-sm border border-[#E5E7EB]">
            <h4 className="font-display font-semibold text-[#111827] mb-4 flex items-center gap-3 text-lg">
              <CheckCircle2 className="w-5 h-5 text-gray-400" />
              Customer Preference
            </h4>
            <p className="text-sm text-gray-600 mb-4 font-body leading-relaxed">
              If you wish to exchange due to size issues or change of mind:
            </p>
            <ul className="text-sm text-gray-600 space-y-3 font-body">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span> Exchange is possible within 5 days.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span> <strong className="text-[#111827]">Customer pays delivery charges</strong> for the exchange.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span> <span className="italic text-xs">Note: This applies even if original item was on Sale or had Free Delivery.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer / Contact */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-6 font-body">
          Need more clarity? We are here to help.
        </p>
        <button className="inline-flex items-center gap-3 bg-transparent border border-[#111827] text-[#111827] font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-[#111827] hover:text-white transition-all duration-300 shadow-sm">
          <FaSquareWhatsapp className="w-5 h-5" />
          <span>Contact us on WhatsApp</span>
        </button>
      </div>

    </div>
  );
};

export default StorePolicies;
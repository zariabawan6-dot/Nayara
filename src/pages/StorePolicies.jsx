import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PackageOpen, RefreshCw, AlertCircle, CheckCircle2,
  Shield, FileText, Cookie, ChevronDown
} from 'lucide-react';
import { FaSquareWhatsapp } from "react-icons/fa6";

const Section = ({ id, icon: Icon, title, children }) => (
  <section
    id={id}
    className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm p-8 md:p-12 scroll-mt-28"
  >
    <h2 className="text-2xl font-display font-semibold text-[#111827] mb-6 flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
      <Icon className="w-6 h-6 text-[#D4AF37] shrink-0" />
      {title}
    </h2>
    <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-body">
      {children}
    </div>
  </section>
);

const SubHeading = ({ children }) => (
  <h3 className="text-base font-semibold text-[#111827] mt-8 mb-2">{children}</h3>
);

const Ul = ({ items }) => (
  <ul className="space-y-2 ml-1">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <span className="text-[#D4AF37] mt-0.5 shrink-0">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const StorePolicies = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [hash]);

  const lastUpdated = 'August 2026';

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20 font-body">

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#D4AF37] font-semibold tracking-[0.2em] text-[10px] uppercase mb-4 block">
          Legal & Customer Care
        </span>
        <h1 className="text-3xl md:text-5xl font-display text-[#111827] mb-6">
          Store Policies
        </h1>
        <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6" />
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          We believe in full transparency. Please review our policies below before making a purchase.
        </p>

        {/* Quick jump links */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: 'Privacy Policy', href: '#privacy' },
            { label: 'Terms of Service', href: '#terms' },
            { label: 'Cookie Policy', href: '#cookies' },
            { label: 'Returns & Exchange', href: '#returns' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-xs font-semibold uppercase tracking-widest border border-[#E5E7EB] px-4 py-2 rounded-sm text-[#111827] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-10">

        {/* ─── PRIVACY POLICY ─── */}
        <Section id="privacy" icon={Shield} title="Privacy Policy">
          <p>Last updated: {lastUpdated}</p>
          <p>
            Nayara Zone ("we", "us", or "our") operates the website{' '}
            <a href="https://www.nayarazone.store" className="text-[#D4AF37] underline">
              www.nayarazone.store
            </a>
            . This Privacy Policy explains how we collect, use, and protect your personal information when you visit our store or place an order.
          </p>

          <SubHeading>1. Information We Collect</SubHeading>
          <p>When you place an order or contact us, we may collect:</p>
          <Ul items={[
            'Full name and contact details (phone number, email address)',
            'Shipping address and city',
            'Order details and purchase history',
            'Device information and IP address (collected automatically via cookies and tracking tools)',
            'Browsing behaviour on our website (pages visited, time spent, clicks)',
          ]} />

          <SubHeading>2. How We Use Your Information</SubHeading>
          <Ul items={[
            'To process and deliver your orders',
            'To communicate order updates via WhatsApp or phone',
            'To improve our website and shopping experience',
            'To show you relevant advertisements on Facebook and Instagram via Meta Pixel',
            'To comply with legal obligations',
          ]} />

          <SubHeading>3. Meta Pixel & Facebook Advertising</SubHeading>
          <p>
            Our website uses the <strong className="text-[#111827]">Meta Pixel</strong> (formerly Facebook Pixel), a tracking tool provided by Meta Platforms, Inc. The Pixel allows us to:
          </p>
          <Ul items={[
            'Measure the effectiveness of our Facebook and Instagram advertisements',
            'Track website events such as page views, product views, and purchases',
            'Build custom and lookalike audiences for targeted advertising',
            'Retarget visitors who have shown interest in our products',
          ]} />
          <p>
            Data collected by the Meta Pixel is transmitted to Meta and is subject to Meta's own{' '}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] underline"
            >
              Privacy Policy
            </a>
            . You can opt out of Meta's use of this data for advertising via your{' '}
            <a
              href="https://www.facebook.com/help/109378269482053"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] underline"
            >
              Facebook Ad Preferences
            </a>
            .
          </p>

          <SubHeading>4. Sharing Your Information</SubHeading>
          <p>We do not sell your personal data. We may share it with:</p>
          <Ul items={[
            'Courier and logistics partners to deliver your order',
            'Meta Platforms for advertising purposes (via Pixel data)',
            'Legal authorities if required by law',
          ]} />

          <SubHeading>5. Data Retention</SubHeading>
          <p>
            We retain your order information for up to 2 years for record-keeping and customer service purposes. You may request deletion of your data by contacting us.
          </p>

          <SubHeading>6. Your Rights</SubHeading>
          <Ul items={[
            'Access the personal data we hold about you',
            'Request correction of inaccurate data',
            'Request deletion of your data',
            'Opt out of marketing communications',
          ]} />
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:nayarazone36@gmail.com" className="text-[#D4AF37] underline">
              nayarazone36@gmail.com
            </a>{' '}
            or on WhatsApp at +92 316 6071102.
          </p>

          <SubHeading>7. Security</SubHeading>
          <p>
            We take reasonable measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </p>

          <SubHeading>8. Changes to This Policy</SubHeading>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
          </p>
        </Section>

        {/* ─── TERMS OF SERVICE ─── */}
        <Section id="terms" icon={FileText} title="Terms of Service">
          <p>Last updated: {lastUpdated}</p>
          <p>
            By accessing or purchasing from{' '}
            <a href="https://www.nayarazone.store" className="text-[#D4AF37] underline">
              www.nayarazone.store
            </a>
            , you agree to the following terms and conditions.
          </p>

          <SubHeading>1. Products & Pricing</SubHeading>
          <Ul items={[
            'All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice',
            'Product colours may slightly vary due to screen display differences',
            'We reserve the right to cancel any order in case of stock unavailability',
          ]} />

          <SubHeading>2. Order Placement</SubHeading>
          <Ul items={[
            'Orders are confirmed via WhatsApp or phone call after placement',
            'We currently accept Cash on Delivery (COD) as our primary payment method',
            'Please ensure your delivery address and phone number are correct at checkout',
          ]} />

          <SubHeading>3. Delivery</SubHeading>
          <Ul items={[
            'We deliver across Pakistan through trusted courier partners',
            'Estimated delivery time is 3–7 working days depending on your city',
            'Delivery charges apply and are communicated at the time of order confirmation',
          ]} />

          <SubHeading>4. Intellectual Property</SubHeading>
          <p>
            All content on this website — including images, text, logos, and product designs — is owned by Nayara Zone. Reproduction or use without written permission is strictly prohibited.
          </p>

          <SubHeading>5. Limitation of Liability</SubHeading>
          <p>
            Nayara Zone is not liable for any indirect or consequential damages arising from the use of our website or products beyond the purchase value of the item.
          </p>

          <SubHeading>6. Governing Law</SubHeading>
          <p>
            These terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes shall be subject to the jurisdiction of courts in Faisalabad, Punjab.
          </p>

          <SubHeading>7. Contact</SubHeading>
          <p>
            For any queries regarding these terms, email us at{' '}
            <a href="mailto:nayarazone36@gmail.com" className="text-[#D4AF37] underline">
              nayarazone36@gmail.com
            </a>
            .
          </p>
        </Section>

        {/* ─── COOKIE POLICY ─── */}
        <Section id="cookies" icon={Cookie} title="Cookie Policy">
          <p>Last updated: {lastUpdated}</p>
          <p>
            This Cookie Policy explains how Nayara Zone uses cookies and similar tracking technologies on{' '}
            <a href="https://www.nayarazone.store" className="text-[#D4AF37] underline">
              www.nayarazone.store
            </a>
            .
          </p>

          <SubHeading>1. What Are Cookies?</SubHeading>
          <p>
            Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences and understand how you interact with the site.
          </p>

          <SubHeading>2. Cookies We Use</SubHeading>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#E5E7EB] rounded-sm mt-2">
              <thead className="bg-[#FAF8F3]">
                <tr>
                  {['Cookie Name', 'Provider', 'Purpose', 'Duration'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-[#111827] border-b border-[#E5E7EB] uppercase tracking-widest text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  ['_fbp', 'Meta (Facebook)', 'Identifies browsers for Meta advertising and retargeting', '90 days'],
                  ['_fbc', 'Meta (Facebook)', 'Stores the last Facebook ad click to attribute conversions', '90 days'],
                  ['fr', 'Meta (Facebook)', 'Enables ad delivery and measurement across Meta products', '90 days'],
                  ['_ga', 'Google Analytics (if used)', 'Distinguishes unique website visitors', '2 years'],
                  ['session', 'Nayara Zone', 'Maintains shopping cart and session state', 'Session'],
                ].map(([name, provider, purpose, duration], i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[#111827]">{name}</td>
                    <td className="px-4 py-3">{provider}</td>
                    <td className="px-4 py-3">{purpose}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SubHeading>3. Meta Pixel Cookies Explained</SubHeading>
          <p>
            We use the <strong className="text-[#111827]">Meta Pixel</strong> which sets the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#111827] font-mono">_fbp</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#111827] font-mono">_fbc</code> cookies. These cookies allow Meta to:
          </p>
          <Ul items={[
            'Track when you visit our site after clicking a Facebook or Instagram ad',
            'Report conversions (purchases, page views) back to our ad account',
            'Help us show more relevant ads to you and people like you on Meta platforms',
            'Build retargeting audiences from website visitors',
          ]} />

          <SubHeading>4. Managing & Opting Out of Cookies</SubHeading>
          <p>You can control cookies through the following methods:</p>
          <Ul items={[
            'Browser settings: Most browsers allow you to block or delete cookies via settings',
            'Meta Ad Preferences: Visit facebook.com/ads/preferences to opt out of personalised ads',
            'Your Online Choices: Visit youronlinechoices.eu for broader ad opt-out options',
          ]} />
          <p className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 text-yellow-800 text-xs">
            ⚠️ Disabling cookies may affect the functionality of this website, including the ability to add items to your cart.
          </p>

          <SubHeading>5. Third-Party Links</SubHeading>
          <p>
            Our website may contain links to third-party platforms (Facebook, Instagram, WhatsApp). We are not responsible for the cookie or privacy practices of those platforms.
          </p>
        </Section>

        {/* ─── RETURNS & EXCHANGE ─── */}
        <Section id="returns" icon={RefreshCw} title="Returns & Exchange Policy">
          <p>Last updated: {lastUpdated}</p>

          {/* Open Parcel */}
          <div className="bg-[#FAF8F3] border border-[#E5E7EB] rounded-sm p-6 flex items-start gap-5">
            <div className="p-3 bg-white rounded-full border border-[#E5E7EB] shrink-0">
              <PackageOpen className="w-5 h-5 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">Open Parcel Policy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We offer an Open Parcel facility. You may inspect the item before fully accepting delivery.
              </p>
              <p className="mt-3 text-xs font-semibold text-[#111827] uppercase tracking-widest bg-white border border-[#E5E7EB] p-3 rounded-sm">
                Note: Delivery charges must be paid before opening the parcel seal.
              </p>
            </div>
          </div>

          {/* Exchange window */}
          <div className="bg-[#FAF8F3] border border-[#E5E7EB] rounded-sm p-6 flex items-start gap-5">
            <div className="p-3 bg-white rounded-full border border-[#E5E7EB] shrink-0">
              <RefreshCw className="w-5 h-5 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">5-Day Exchange Window</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Exchanges are accepted within <strong className="text-[#111827]">5 days</strong> of delivery, provided the item is unused and original tags are intact. We do not offer cash refunds.
              </p>
            </div>
          </div>

          {/* Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-green-50 border border-green-200 rounded-sm p-6">
              <h4 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Company Fault
              </h4>
              <p className="text-sm text-gray-600 mb-3">Wrong article or damaged product delivered by us.</p>
              <Ul items={[
                'Free exchange processing',
                'We cover all delivery charges',
              ]} />
            </div>
            <div className="bg-gray-50 border border-[#E5E7EB] rounded-sm p-6">
              <h4 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400" /> Customer Preference
              </h4>
              <p className="text-sm text-gray-600 mb-3">Size issue or change of mind.</p>
              <Ul items={[
                'Exchange within 5 days of delivery',
                'Customer pays delivery charges',
                'Applies even on Sale or Free Delivery items',
              ]} />
            </div>
          </div>

          <SubHeading>Non-Exchangeable Items</SubHeading>
          <Ul items={[
            'Items that have been worn, washed, or altered',
            'Items without original tags or packaging',
            'Items purchased more than 5 days ago',
            'Stitching customisation charges are non-refundable',
          ]} />

          <SubHeading>How to Initiate an Exchange</SubHeading>
          <Ul items={[
            'Contact us on WhatsApp at +92 316 6071102 within 5 days of delivery',
            'Share your order ID and clear photos of the item',
            'Our team will guide you through the exchange process',
          ]} />
        </Section>

      </div>

      {/* Contact CTA */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-6 font-body">
          Need more clarity? We're here to help.
        </p>
        <a
          href="https://wa.me/923166071102?text=Hi%20Nayara%2C%20I%20have%20a%20question%20about%20your%20policies."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-transparent border border-[#111827] text-[#111827] font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-[#111827] hover:text-white transition-all duration-300 shadow-sm"
        >
          <FaSquareWhatsapp className="w-5 h-5" />
          <span>Contact us on WhatsApp</span>
        </a>
      </div>

    </div>
  );
};

export default StorePolicies;

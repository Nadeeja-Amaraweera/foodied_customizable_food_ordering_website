import React, { useState } from 'react';

export interface FooterProps {
  onToast?: (message: string) => void;
  onNewsletterSubscribe?: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onToast, onNewsletterSubscribe }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNewsletterSubscribe) {
      onNewsletterSubscribe(newsletterEmail);
    } else if (onToast) {
      onToast('Thank you for subscribing to our newsletter!');
    }
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#E5F0DA] mt-16 py-16 px-4 sm:px-8 text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Menu */}
        <div>
          <h4 className="text-lg font-extrabold mb-4">Menu</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
            <li>
              <a href="#home" className="hover:text-[#558B2F] transition">
                Home
              </a>
            </li>
            <li>
              <a href="#why-choose" className="hover:text-[#558B2F] transition">
                Why Choose
              </a>
            </li>
            <li>
              <a href="#special-menu" className="hover:text-[#558B2F] transition">
                Special Menu
              </a>
            </li>
            <li>
              <a href="#regular-food" className="hover:text-[#558B2F] transition">
                Regular Food
              </a>
            </li>
            <li>
              <a href="#chefs" className="hover:text-[#558B2F] transition">
                Special Chef&apos;s
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Help */}
        <div>
          <h4 className="text-lg font-extrabold mb-4">Help</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
            <li>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  onToast?.('Privacy Policy opened');
                }}
                className="hover:text-[#558B2F] transition"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  onToast?.('Terms & Conditions opened');
                }}
                className="hover:text-[#558B2F] transition"
              >
                Terms &amp; Condition
              </a>
            </li>
            <li>
              <a
                href="#policy"
                onClick={(e) => {
                  e.preventDefault();
                  onToast?.('Food Safety & Refund Policy opened');
                }}
                className="hover:text-[#558B2F] transition"
              >
                Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="text-lg font-extrabold mb-4">Contact</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
            <li>+123 456 789</li>
            <li>Info@Foodied.Com</li>
            <li>1245, New York, USA</li>
          </ul>
        </div>

        {/* Column 4: Subscribe Our Newsletter */}
        <div>
          <h4 className="text-lg font-extrabold mb-4 leading-snug">
            Subscribe Our <br /> Newsletter
          </h4>
          <form
            onSubmit={handleSubscribe}
            className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-[#C5E1A5] mt-2"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold text-xs px-4 py-2.5 shrink-0 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};


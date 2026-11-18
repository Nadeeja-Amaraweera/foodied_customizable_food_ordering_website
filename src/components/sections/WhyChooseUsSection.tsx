import React from 'react';
import { Sliders, Film, ShoppingBag, Clock } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section id="why-choose" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
      {/* Eyebrow */}
      <span className="text-xs font-bold uppercase tracking-wider text-[#689F38] bg-[#EBF5E0] px-3.5 py-1.5 rounded-full inline-block mb-3">
        The Foodied Difference
      </span>

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1A1A] font-display">
        Why Choose Foodied?
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-xl mx-auto mt-3 leading-relaxed">
        We pair honest culinary craftsmanship with digital transparency. Every feature is designed to give you complete control over what you eat.
      </p>

      {/* 4 Existing Capability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 text-left">
        {/* Card 1: 100% Customizable Meals */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#8BC34A]/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div className="w-13 h-13 rounded-2xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#8BC34A] group-hover:text-white transition-all duration-300">
              <Sliders className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A]">
              Customizable Meals
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
              Personalize every dish to your palate. Choose portion sizes, tailor gourmet extras, and select your exact spice tolerance on every recipe.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 text-[11px] font-bold text-[#558B2F]">
            ✦ Custom sizes, toppings &amp; heat
          </div>
        </div>

        {/* Card 2: Cinematic Food Experience */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#8BC34A]/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div className="w-13 h-13 rounded-2xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#8BC34A] group-hover:text-white transition-all duration-300">
              <Film className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A]">
              Food Experience
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
              Explore how your meal is handcrafted before placing an order. Our 250-frame interactive visualizer shows every layer come together.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 text-[11px] font-bold text-[#558B2F]">
            ✦ 250 scroll-animated frames
          </div>
        </div>

        {/* Card 3: Easy Online Ordering */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#8BC34A]/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div className="w-13 h-13 rounded-2xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#8BC34A] group-hover:text-white transition-all duration-300">
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A]">
              Easy Online Ordering
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
              Instant cart updates, clear transparent pricing with modifiers, and our integrated AI Assistant ready to answer any menu questions.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 text-[11px] font-bold text-[#558B2F]">
            ✦ Seamless cart &amp; AI assistant
          </div>
        </div>

        {/* Card 4: Convenient Order Tracking */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#8BC34A]/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div className="w-13 h-13 rounded-2xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#8BC34A] group-hover:text-white transition-all duration-300">
              <Clock className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A]">
              Convenient Tracking
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
              Stay in the loop from order placement to kitchen fulfillment. Check real-time progress, receipt breakdowns, and history in your account.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 text-[11px] font-bold text-[#558B2F]">
            ✦ Full order transparency
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

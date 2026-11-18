import React from 'react';
import { Heart, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Visual Composition */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 relative order-2 lg:order-1">
          {/* Main Ambient Photograph */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 group">
            <img
              src="/images/restaurant-dining-ambiance.jpg"
              alt="Warm, inviting restaurant dining atmosphere and culinary hospitality"
              loading="lazy"
              className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-103 transition duration-700"
            />
            {/* Atmospheric Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A4D670]">
                Hospitality &amp; Care
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                From Our Kitchen to Your Table
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-md">
                Every meal is prepared to order with the devotion of a neighborhood restaurant.
              </p>
            </div>
          </div>

          {/* Overlapping Inset Photo (Artisan Woodfired Pizza) */}
          <div className="hidden sm:block absolute -top-8 -right-6 sm:-right-8 w-44 sm:w-52 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 z-20 group">
            <img
              src="/images/artisan-woodfired-pizza.jpg"
              alt="Artisan woodfired pizza with fresh buffalo mozzarella"
              loading="lazy"
              className="w-full h-36 sm:h-44 object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-center">
              <p className="text-[10px] font-bold">Woodfired Pizza</p>
            </div>
          </div>

          {/* Floating Craft Badge */}
          <div className="absolute -bottom-5 left-6 sm:left-10 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-[#E53935] fill-current" />
            <div>
              <p className="text-xs font-black text-gray-900 leading-tight">Cooked with Devotion</p>
              <p className="text-[10px] text-gray-500 font-semibold">100% Chef-Crafted</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Brand Story & Commitments */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5E0] text-[#558B2F] text-xs font-bold uppercase tracking-wider">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#7CB342]" />
            <span>Our Culinary Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1A1A] leading-[1.14] font-display">
            Honest Food, <br />
            <span className="text-[#689F38]">Thoughtfully Crafted</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Foodied was founded on a simple conviction: ordering food online should never mean compromising on culinary craft, ingredient integrity, or personal taste.
          </p>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            In an era of mass-produced fast food, we wanted to bridge the gap between fine-dining devotion and modern delivery convenience. Every morning begins with deliveries of organic farm vegetables, slow reductions of house glazes, and shaping cold-fermented sourdoughs.
          </p>

          {/* 3 Core Commitments */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Craft Over Convenience</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  We refuse shortcuts. We cook with real butter, whole aromatics, and honest techniques.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Total Ingredient Transparency</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  You have full visibility into your dish&apos;s elements, with complete power to customize portions, extras, and heat.
                </p>
              </div>
            </div>
          </div>

          {/* Culinary Signature */}
          <div className="pt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5F0DA] flex items-center justify-center text-[#558B2F] font-bold text-sm">
              FD
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">The Foodied Culinary Team</p>
              <p className="text-[11px] text-gray-500">Dedicated to exceptional artisan food</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;


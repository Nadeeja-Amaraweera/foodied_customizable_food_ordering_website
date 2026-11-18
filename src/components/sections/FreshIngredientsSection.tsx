import React from 'react';
import { Leaf, Sparkles, Sun, Droplets } from 'lucide-react';

export const FreshIngredientsSection: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5E0] text-[#558B2F] text-xs font-bold uppercase tracking-wider mb-3">
          <Leaf className="w-3.5 h-3.5 text-[#7CB342]" />
          <span>Honest Sourcing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1A1A] font-display">
          Freshness You Can Taste
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
          We believe extraordinary meals begin long before the pan is heated. We source directly from local farms, selecting produce at the peak of flavor and texture.
        </p>
      </div>

      {/* 3 Editorial Ingredient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Heirloom Produce */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src="/images/fresh-organic-ingredients.jpg"
              alt="Fresh heirloom vegetables and organic tomatoes"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-xs flex items-center gap-1.5">
              <Sun className="w-3 h-3 text-[#7CB342]" />
              <span>Daily Farm Harvest</span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#689F38] transition-colors">
                Heirloom Produce &amp; Greens
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                Sun-ripened tomatoes, crisp wild arugula, and sweet peppers hand-selected from regional growers every morning. Never frozen, never preserved.
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 text-xs font-semibold text-[#558B2F]">
              ✦ Delivered fresh 7 days a week
            </div>
          </div>
        </div>

        {/* Card 2: 24h Cold Fermented Dough */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src="/images/chef-dough-prep.jpg"
              alt="Artisan sourdough pizza dough being hand kneaded"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#7CB342]" />
              <span>Slow Fermentation</span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#689F38] transition-colors">
                24-Hour Fermented Dough
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                Natural sourdough starters, unbleached stoneground flours, and a full day of cold maturation produce an airy, digestible crust with complex artisan aroma.
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 text-xs font-semibold text-[#558B2F]">
              ✦ Light, blistered &amp; easy to digest
            </div>
          </div>
        </div>

        {/* Card 3: Scratch Sauces & Pure Oils */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src="/images/fresh-herbs-harvest.jpg"
              alt="Fresh aromatic basil, garlic and cold pressed olive oil"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-xs flex items-center gap-1.5">
              <Droplets className="w-3 h-3 text-[#7CB342]" />
              <span>Small-Batch Sauces</span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#689F38] transition-colors">
                Cold-Pressed &amp; Scratch-Made
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                Extra virgin olive oil, sweet Italian basil, and roasted garlic confit simmered slowly to create sauces with vibrant depth and pure natural flavors.
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 text-xs font-semibold text-[#558B2F]">
              ✦ Zero artificial additives or thickeners
            </div>
          </div>
        </div>
      </div>

      {/* Freshness Commitment Bar */}
      <div className="mt-14 bg-[#EBF5E0] rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-around gap-6 text-center">
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-[#558B2F]">100%</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Fresh Daily Prep</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[#C5E1A5]" />
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-[#558B2F]">24 Hours</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Cold Fermentation</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[#C5E1A5]" />
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-[#558B2F]">Zero</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Artificial Additives</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[#C5E1A5]" />
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-[#558B2F]">Local</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Organic Partner Farms</span>
        </div>
      </div>
    </section>
  );
};

export default FreshIngredientsSection;


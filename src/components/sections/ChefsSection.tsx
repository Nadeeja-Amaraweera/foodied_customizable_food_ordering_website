import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export const ChefsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="chefs" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Editorial Storytelling, Headings & Pillars */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-7">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5E0] text-[#558B2F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#7CB342]" />
            <span>Crafted With Passion</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1A1A] leading-[1.15] font-display">
              Meet the Art <br />
              <span className="text-[#689F38]">Behind Every Bite</span>
            </h2>
            <p className="text-base sm:text-lg font-medium text-gray-700 italic border-l-3 border-[#8BC34A] pl-4 py-0.5">
              &ldquo;Great food starts with passion, fresh ingredients and the hands of people who love what they create.&rdquo;
            </p>
          </div>

          {/* Story Narrative */}
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            At Foodied, cooking is a craft, not a commodity. Our culinary team approaches every service with the discipline and devotion of fine dining—slow-fermenting doughs for 24 hours, reducing house sauces from scratch, and grilling prime cuts over precise heat to lock in natural juices.
          </p>

          {/* 3 Craft Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="bg-white/80 p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-[#8BC34A]/40 transition">
              <div className="w-9 h-9 rounded-xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-2.5">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Artisan Technique</h3>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                Woodfired baking, cast-iron searing, and delicate finishing sauces.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-[#8BC34A]/40 transition">
              <div className="w-9 h-9 rounded-xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">100% Scratch</h3>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                Zero artificial shortcuts. Every glaze, brine, and dressing made in-house.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-[#8BC34A]/40 transition">
              <div className="w-9 h-9 rounded-xl bg-[#F4F9EE] text-[#689F38] flex items-center justify-center mb-2.5">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Cooked to Order</h3>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                Never sitting under heat lamps. Prepared fresh when your ticket fires.
              </p>
            </div>
          </div>

          {/* CTA: Explore Our Experience */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/experience')}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-[#689F38] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>Explore Our Experience</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Editorial Split Photography Composition */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Subtle Ambient Background Blob */}
          <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#8BC34A]/15 blur-3xl -z-10 pointer-events-none" />

          {/* Main Hero Photograph (Chef Plating) */}
          <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 group">
            <img
              src="/images/chef-crafting-dish.jpg"
              alt="Professional culinary chef delicately garnishing an artisan plate"
              loading="lazy"
              className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-103 transition duration-700"
            />
            {/* Dark Gradient Overlay for Caption readability */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A4D670]">
                The Culinary Craft
              </span>
              <h4 className="text-lg font-bold">Dedicated to Pure Culinary Artistry</h4>
              <p className="text-xs text-gray-200 mt-1">
                Precision seasoning, balanced acidity, and handcrafted presentation.
              </p>
            </div>
          </div>

          {/* Secondary Overlapping Photograph (Bustling Kitchen Action) */}
          <div className="hidden sm:block absolute -bottom-8 -left-6 sm:-left-10 w-44 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 z-20 group">
            <img
              src="/images/chef-kitchen-action.jpg"
              alt="Chefs collaborating in active modern restaurant kitchen"
              loading="lazy"
              className="w-full h-36 sm:h-44 object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 text-white">
              <p className="text-[11px] font-bold">Fresh Daily Prep</p>
              <p className="text-[9px] text-gray-300">Live Kitchen Atmosphere</p>
            </div>
          </div>

          {/* Floating Badge (Top Right) */}
          <div className="absolute -top-4 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#7CB342] animate-ping" />
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-tight">100% Scratch Kitchen</p>
              <p className="text-[10px] text-gray-500 font-semibold">Zero Artificial Preservatives</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefsSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Film, Eye, Layers } from 'lucide-react';

export const FoodExperienceSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-[#182312] text-white shadow-2xl border border-white/10">
        {/* Subtle Background Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#8BC34A]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#558B2F]/25 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 lg:p-16 relative z-10">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Narrative & Highlights */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8BC34A]/20 border border-[#8BC34A]/30 text-[#A4D670] text-xs font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Interactive Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] font-display">
              Step Inside the Kitchen: <br />
              <span className="text-[#8BC34A]">The Food Experience</span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Curious about how your meal is handcrafted? Take control of our interactive, scroll-controlled culinary simulation. Watch our signature burger assemble layer-by-layer across 250 ultra-smooth WebP frames—from freshly toasted brioche to flame-seared Angus beef and organic greens.
            </p>

            {/* 3 Interactive Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <Layers className="w-5 h-5 text-[#8BC34A] mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-white">250 WebP Frames</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Scroll-driven smooth animation</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <Eye className="w-5 h-5 text-[#8BC34A] mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-white">Layer Breakdown</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">See every ingredient in detail</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <Sparkles className="w-5 h-5 text-[#8BC34A] mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-white">Full-Screen UI</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Cinematic viewing experience</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/experience')}
                className="px-7 py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-gray-900 font-extrabold text-sm sm:text-base shadow-lg shadow-[#8BC34A]/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5"
              >
                <Play className="w-4 h-4 fill-current text-gray-900" />
                <span>Launch Food Experience</span>
              </button>
              <span className="text-xs text-gray-400 font-medium">
                ✦ 100% interactive • Free to explore
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Cinematic Card Preview Frame */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              onClick={() => navigate('/experience')}
              className="relative w-full max-w-md rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group cursor-pointer"
            >
              <img
                src="/images/food-experience-cinematic.jpg"
                alt="Interactive Food Experience preparation sequence preview"
                loading="lazy"
                className="w-full h-72 sm:h-96 object-cover object-center group-hover:scale-106 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC34A] text-gray-900 text-xs font-bold w-fit mb-2 shadow">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Click to Explore</span>
                </span>
                <h4 className="text-lg font-bold text-white">Artisan Burger Crafting</h4>
                <p className="text-xs text-gray-300">
                  Interactive frame-by-frame visual journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodExperienceSection;


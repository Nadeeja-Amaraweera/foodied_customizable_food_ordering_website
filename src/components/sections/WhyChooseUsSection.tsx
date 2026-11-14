import React from 'react';
import { Utensils, Award, Truck } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section id="why-choose" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16 text-center">
      <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] uppercase">
        WHY CHOOSE US?
      </h2>
      <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
        You will choose us because you get the best quality food from us and we deliver fast.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
        {/* Card 1: Serve Healthy Food */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center hover:-translate-y-1 transition">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mb-5">
            <Utensils className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#1A1A1A]">Serve Healthy Food</h3>
          <p className="text-xs text-gray-400 mt-2.5 leading-relaxed max-w-xs">
            We serve all healthy food here. You can choose any food you like and customize every ingredient.
          </p>
        </div>

        {/* Card 2: Best Quality */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center hover:-translate-y-1 transition">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mb-5">
            <Award className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#1A1A1A]">Best Quality</h3>
          <p className="text-xs text-gray-400 mt-2.5 leading-relaxed max-w-xs">
            Our food quality is excellent. You will get exactly what you want here prepared fresh to order.
          </p>
        </div>

        {/* Card 3: Fast Delivery */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center hover:-translate-y-1 transition">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mb-5">
            <Truck className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#1A1A1A]">Fast Delivery</h3>
          <p className="text-xs text-gray-400 mt-2.5 leading-relaxed max-w-xs">
            You can say the main goal of our delivery man is to deliver orders quickly. You will receive it shortly after ordering.
          </p>
        </div>
      </div>
    </section>
  );
};


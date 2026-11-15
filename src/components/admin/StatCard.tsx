import React from 'react';
import { ShoppingBag, Clock, Utensils, DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { StatMetric } from '../../data/adminMockData';

interface StatCardProps {
  stat: StatMetric;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, onClick }) => {
  const getIcon = (name: StatMetric['iconName']) => {
    switch (name) {
      case 'shopping-bag':
        return <ShoppingBag className="w-6 h-6 text-[#FF6B35]" />;
      case 'clock':
        return <Clock className="w-6 h-6 text-[#F7931E]" />;
      case 'utensils':
        return <Utensils className="w-6 h-6 text-[#2EC4B6]" />;
      case 'dollar-sign':
        return <DollarSign className="w-6 h-6 text-[#06D6A0]" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-[#FF6B35]" />;
    }
  };

  const getIconBg = (name: StatMetric['iconName']) => {
    switch (name) {
      case 'shopping-bag':
        return 'bg-orange-50 border-orange-100/80';
      case 'clock':
        return 'bg-amber-50 border-amber-100/80';
      case 'utensils':
        return 'bg-teal-50 border-teal-100/80';
      case 'dollar-sign':
        return 'bg-emerald-50 border-emerald-100/80';
      default:
        return 'bg-orange-50 border-orange-100/80';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top subtle decorative color gradient strip on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#2EC4B6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
            {stat.title}
          </span>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 font-display tracking-tight">
            {stat.value}
          </h4>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs ${getIconBg(
            stat.iconName
          )}`}
        >
          {getIcon(stat.iconName)}
        </div>
      </div>

      {/* Change Indicator & Subtitle */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md ${
              stat.isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            {stat.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {stat.change}
          </span>
        </div>

        <span className="text-gray-400 font-medium truncate max-w-[130px]">
          {stat.subtitle}
        </span>
      </div>
    </div>
  );
};


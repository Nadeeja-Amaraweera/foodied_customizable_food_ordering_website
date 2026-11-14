import React from 'react';
import { Check } from 'lucide-react';

export type FloatingCloneData = {
  image: string;
  name: string;
  startX: number;
  startY: number;
};

export const FloatingDishClone: React.FC<{ clone: FloatingCloneData | null }> = ({ clone }) => {
  if (!clone) return null;

  return (
    <div
      style={{ left: clone.startX - 56, top: clone.startY - 56 }}
      className="fixed z-50 pointer-events-none w-28 h-28 rounded-full p-1.5 bg-[#8BC34A] shadow-2xl animate-fly-to-hero"
    >
      <img src={clone.image} alt={clone.name} className="w-full h-full object-cover rounded-full" />
    </div>
  );
};

export const StoreToast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-[#8BC34A]">
      <div className="w-7 h-7 rounded-full bg-[#8BC34A] flex items-center justify-center text-white shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

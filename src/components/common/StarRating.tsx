import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  reviews?: number;
  className?: string;
  size?: string;
  textSize?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  reviews = 0,
  className = 'flex items-center gap-1 mt-1.5',
  size = 'w-3.5 h-3.5',
  textSize = 'text-[11px]'
}) => (
  <div className={className}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`${size} fill-[#FBBF24] text-[#FBBF24]`} />
    ))}
    <span className={`${textSize} text-gray-400 ml-1`}>({reviews})</span>
  </div>
);


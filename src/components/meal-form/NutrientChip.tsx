
import React from 'react';

interface NutrientChipProps {
  type: 'protein' | 'carbs' | 'fat' | 'calories';
  value: string;
  isHighlight?: boolean;
}

const NutrientChip: React.FC<NutrientChipProps> = ({ type, value, isHighlight = false }) => {
  const getNutrientConfig = (type: string) => {
    switch (type) {
      case 'protein':
        return { emoji: '💪', color: 'bg-blue-100 text-blue-800', label: 'Protein' };
      case 'carbs':
        return { emoji: '🌾', color: 'bg-yellow-100 text-yellow-800', label: 'Carbs' };
      case 'fat':
        return { emoji: '🥑', color: 'bg-green-100 text-green-800', label: 'Fat' };
      case 'calories':
        return { emoji: '🔥', color: 'bg-orange-100 text-orange-800', label: 'Calories' };
      default:
        return { emoji: '📊', color: 'bg-gray-100 text-gray-800', label: 'Nutrient' };
    }
  };

  const config = getNutrientConfig(type);
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${isHighlight ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
      <span className="text-sm">{config.emoji}</span>
      <span>{value}</span>
    </div>
  );
};

export default NutrientChip;

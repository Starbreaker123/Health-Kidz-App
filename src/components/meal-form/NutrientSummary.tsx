import React from 'react';
import NutrientChip from './NutrientChip';
import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  daily_calorie_goal?: number;
}

interface NutrientSummaryProps {
  foodItems: FoodItem[];
  child?: Child; // Make child optional
}

const NutrientSummary: React.FC<NutrientSummaryProps> = ({ foodItems, child }) => {
  const calculateTotals = () => {
    return foodItems.reduce((totals, item) => ({
      calories: totals.calories + (item.calories_per_unit * item.quantity),
      protein: totals.protein + ((item.protein_g || 0) * item.quantity),
      carbs: totals.carbs + ((item.carbs_g || 0) * item.quantity),
      fat: totals.fat + ((item.fat_g || 0) * item.quantity)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotals();

  // Get recommended nutrition from clinical calculator with fallback values
  const recommendations = child ? calculateClinicalNutritionRecommendations(child) : {
    calories: 2000, // Default values for a typical child
    protein_g: 50,
    carbs_g: 250,
    fat_g: 65,
    fiber_g: 25,
    vitamin_c_mg: 45,
    vitamin_d_iu: 600,
    calcium_mg: 1000,
    iron_mg: 10
  };

  // Determine highlight nutrients based on recommendations
  const getHighlightNutrients = () => {
    const highlights = [];
    
    // Compare against daily recommendations (this meal as % of daily needs)
    if (totals.protein > recommendations.protein_g * 0.25) highlights.push('protein'); // >25% of daily protein
    if (totals.carbs > recommendations.carbs_g * 0.25) highlights.push('carbs'); // >25% of daily carbs
    if (totals.fat > recommendations.fat_g * 0.25) highlights.push('fat'); // >25% of daily fat
    
    return highlights;
  };

  const highlightNutrients = getHighlightNutrients();

  return (
    <div className="flex flex-wrap gap-2">
      <NutrientChip
        type="calories"
        value={`${Math.round(totals.calories)} cal`}
        isHighlight={highlightNutrients.includes('calories')}
      />
      <NutrientChip
        type="protein"
        value={`${Math.round(totals.protein)}g`}
        isHighlight={highlightNutrients.includes('protein')}
      />
      <NutrientChip
        type="carbs"
        value={`${Math.round(totals.carbs)}g`}
        isHighlight={highlightNutrients.includes('carbs')}
      />
      <NutrientChip
        type="fat"
        value={`${Math.round(totals.fat)}g`}
        isHighlight={highlightNutrients.includes('fat')}
      />
    </div>
  );
};

export default NutrientSummary;

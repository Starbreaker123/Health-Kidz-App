
import React from 'react';
import NutrientProgressGrid from '@/components/NutrientProgressGrid';
import NutritionRecommendations from '@/components/NutritionRecommendations';

interface NutritionalGoal {
  nutrient: string;
  current: number;
  target: number;
  unit: string;
  displayName: string;
}

interface NutrientGap {
  nutrient: string;
  current: number;
  target: number;
  deficit: number;
  percentage: number;
}

interface ProgressRecommendationsProps {
  nutritionalGoals: NutritionalGoal[];
  nutrientGaps: NutrientGap[];
}

const ProgressRecommendations: React.FC<ProgressRecommendationsProps> = ({
  nutritionalGoals,
  nutrientGaps
}) => {
  return (
    <>
      {/* Nutrient Progress Grid */}
      <NutrientProgressGrid nutritionalGoals={nutritionalGoals} />

      {/* Recommendations */}
      <NutritionRecommendations nutrientGaps={nutrientGaps} />
    </>
  );
};

export default ProgressRecommendations;

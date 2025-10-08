export interface NutrientGap {
  nutrient: string;
  current: number;
  target: number;
  deficit: number;
  percentage: number;
}

export const analyzeNutrientGaps = (
  dailyIntake: Record<string, number>,
  child: any,
  customTargets?: Record<string, number>
): NutrientGap[] => {
  // Basic nutrient recommendations (simplified)
  const baseRecommendations: Record<string, number> = {
    calories: 1800,
    protein_g: 50,
    carbs_g: 225,
    fat_g: 60
  };
  const targets = customTargets || baseRecommendations;
  const gaps: NutrientGap[] = [];
  Object.entries(targets).forEach(([nutrient, target]) => {
    const current = dailyIntake[nutrient] || 0;
    const deficit = Math.max(0, target - current);
    const percentage = Math.min(100, Math.round((current / target) * 100));
    if (deficit > 0) {
      gaps.push({
        nutrient,
        current,
        target,
        deficit,
        percentage
      });
    }
  });
  return gaps.sort((a, b) => b.deficit - a.deficit); // Sort by largest deficit first
};

export const getNutrientDisplayName = (nutrient: string): string => {
  const displayNames: { [key: string]: string } = {
    'calories': 'Calories',
    'protein_g': 'Protein',
    'carbs_g': 'Carbohydrates',
    'fat_g': 'Fat'
  };
  return displayNames[nutrient] || nutrient.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getNutrientUnit = (nutrient: string): string => {
  const units: { [key: string]: string } = {
    'calories': 'cal',
    'protein_g': 'g',
    'carbs_g': 'g',
    'fat_g': 'g'
  };
  return units[nutrient] || '';
};

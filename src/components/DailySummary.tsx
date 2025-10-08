import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';

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

interface DailySummaryProps {
  child?: Child; // Make child optional
  dailyIntake: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    vegetables_servings: number;
    water_glasses: number;
  };
}

const DailySummary: React.FC<DailySummaryProps> = ({ child, dailyIntake }) => {
  const isMobile = useIsMobile();
  
  // Get nutrition goals from clinical calculator with fallback values
  const nutritionGoals = child ? calculateClinicalNutritionRecommendations(child) : {
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
  
  const progress = {
    calories: {
      current: Math.round(dailyIntake.calories),
      target: nutritionGoals.calories,
      percentage: Math.round((dailyIntake.calories / nutritionGoals.calories) * 100)
    },
    protein: {
      current: Math.round(dailyIntake.protein_g),
      target: nutritionGoals.protein_g,
      percentage: Math.round((dailyIntake.protein_g / nutritionGoals.protein_g) * 100)
    },
    carbs: {
      current: Math.round(dailyIntake.carbs_g),
      target: nutritionGoals.carbs_g,
      percentage: Math.round((dailyIntake.carbs_g / nutritionGoals.carbs_g) * 100)
    },
    fat: {
      current: Math.round(dailyIntake.fat_g),
      target: nutritionGoals.fat_g,
      percentage: Math.round((dailyIntake.fat_g / nutritionGoals.fat_g) * 100)
    },
    vegetables: {
      current: Math.round(dailyIntake.vegetables_servings),
      target: 5, // Standard recommendation
      percentage: Math.round((dailyIntake.vegetables_servings / 5) * 100)
    },
    water: {
      current: Math.round(dailyIntake.water_glasses),
      target: 8, // Standard recommendation
      percentage: Math.round((dailyIntake.water_glasses / 8) * 100)
    }
  };

  return (
    <Card className="nutri-card nutri-floating">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4">
          {child ? `Daily Summary for ${child.name}` : 'Daily Summary'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Calories</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-nutri-blue">{progress.calories.current}</span>
              <span className="text-sm text-gray-500">/ {progress.calories.target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
              <div className="bg-nutri-blue h-2 rounded-full" style={{ width: `${Math.min(progress.calories.percentage, 100)}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Protein</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-nutri-purple">{progress.protein.current}g</span>
              <span className="text-sm text-gray-500">/ {progress.protein.target}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
              <div className="bg-nutri-purple h-2 rounded-full" style={{ width: `${Math.min(progress.protein.percentage, 100)}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Carbs</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-nutri-green">{progress.carbs.current}g</span>
              <span className="text-sm text-gray-500">/ {progress.carbs.target}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
              <div className="bg-nutri-green h-2 rounded-full" style={{ width: `${Math.min(progress.carbs.percentage, 100)}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Fat</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-nutri-orange">{progress.fat.current}g</span>
              <span className="text-sm text-gray-500">/ {progress.fat.target}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
              <div className="bg-nutri-orange h-2 rounded-full" style={{ width: `${Math.min(progress.fat.percentage, 100)}%` }}></div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;

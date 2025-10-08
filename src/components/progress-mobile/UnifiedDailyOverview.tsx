import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import NutrientRing from '@/components/NutrientRing';
import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface NutritionalGoal {
  nutrient: string;
  current: number;
  target: number;
  unit: string;
  displayName: string;
}

interface UnifiedDailyOverviewProps {
  selectedChild: Child | undefined;
  nutritionalGoals: NutritionalGoal[];
  dailyIntake: Record<string, number>;
}

const UnifiedDailyOverview: React.FC<UnifiedDailyOverviewProps> = ({
  selectedChild,
  nutritionalGoals,
  dailyIntake
}) => {
  const isMobile = useIsMobile();
  if (!selectedChild) return null;
  // Always use clinical recommendations for targets
  const recommendations = calculateClinicalNutritionRecommendations(selectedChild);
  // Map current values from nutritionalGoals
  const getCurrent = (nutrient: string) => {
    const found = nutritionalGoals.find(g => g.nutrient === nutrient);
    return found ? found.current : 0;
  };
  const primaryNutrients = [
    { key: 'calories', label: 'Calories', unit: 'cal', current: getCurrent('calories'), target: recommendations.calories },
    { key: 'protein_g', label: 'Protein', unit: 'g', current: getCurrent('protein_g'), target: recommendations.protein_g },
    { key: 'carbs_g', label: 'Carbs', unit: 'g', current: getCurrent('carbs_g'), target: recommendations.carbs_g },
    { key: 'fat_g', label: 'Fat', unit: 'g', current: getCurrent('fat_g'), target: recommendations.fat_g }
  ];
  const goalsAchieved = primaryNutrients.filter(goal => goal.current / goal.target >= 0.8).length;
  const achievementPercentage = primaryNutrients.length > 0 ? Math.round(goalsAchieved / primaryNutrients.length * 100) : 0;

  return <Card className="bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 border-orange-200 animate-fade-in-up">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-3`}>
          <div className="bg-orange-100 p-2 rounded-xl">
            <Target className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-600`} />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent font-bold">
            Today's Nutrition Overview
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Quick Stats */}
        <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-4 gap-4'} mb-6`}>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-green-600" />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                Goals
              </span>
            </div>
            <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-green-600`}>
              {goalsAchieved}/{primaryNutrients.length}
            </div>
            <Badge variant="outline" className="border-green-400 text-green-700 text-xs">
              {achievementPercentage}%
            </Badge>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                Calories
              </span>
            </div>
            <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-orange-600`}>
              {Math.round(getCurrent('calories'))}
            </div>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              of {recommendations.calories}
            </span>
          </div>

          {!isMobile && <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Progress
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {achievementPercentage >= 80 ? 'Great!' : achievementPercentage >= 60 ? 'Good' : 'Improving'}
              </div>
              <span className="text-sm text-gray-500">
                overall
              </span>
            </div>}
        </div>

        {/* Nutrition Rings */}
        <div className="mb-6">
          <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 mb-3`}>
            Daily Nutrition Goals (Clinical Standards)
          </h4>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'}`}>
            {primaryNutrients.map((goal, index) => <div key={goal.key} className="flex flex-col items-center animate-scale-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <NutrientRing value={goal.current} max={goal.target} size={isMobile ? 80 : 100} color="#10b981">
                  <div className="text-center">
                    <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>
                      {Math.round(goal.current)}
                    </div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                      / {Math.round(goal.target)} {goal.unit}
                    </div>
                  </div>
                </NutrientRing>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-2 text-center font-medium`}>
                  {goal.label}
                </span>
              </div>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default UnifiedDailyOverview;
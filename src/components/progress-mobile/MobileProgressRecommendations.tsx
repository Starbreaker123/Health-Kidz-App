
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Plus, ArrowRight, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import NutrientProgressGrid from '@/components/NutrientProgressGrid';
import NutritionRecommendations from '@/components/NutritionRecommendations';

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

interface NutrientGap {
  nutrient: string;
  current: number;
  target: number;
  deficit: number;
  percentage: number;
}

interface MobileProgressRecommendationsProps {
  nutritionalGoals: NutritionalGoal[];
  nutrientGaps: NutrientGap[];
  selectedChild?: Child;
}

const MobileProgressRecommendations: React.FC<MobileProgressRecommendationsProps> = ({
  nutritionalGoals,
  nutrientGaps,
  selectedChild
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleAddMeal = () => {
    navigate('/meals');
  };

  const handleGetMealSuggestions = () => {
    navigate('/meals', { state: { openSuggestions: true } });
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-violet-200">
        <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-3`}>
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-violet-100 rounded-xl`}>
              <Lightbulb className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-violet-600`} />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-bold">
              Quick Actions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
            <Button
              onClick={handleAddMeal}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-auto py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5" />
                <div className="text-left">
                  <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                    Log a Meal
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>
                    Add nutrition data
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </div>
            </Button>

            <Button
              onClick={handleGetMealSuggestions}
              variant="outline"
              className="border-2 border-violet-200 hover:bg-violet-50 h-auto py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-violet-600" />
                <div className="text-left">
                  <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-violet-700`}>
                    Get AI Suggestions
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-violet-600`}>
                    Smart meal ideas
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-violet-600" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Recommendations */}
      <NutritionRecommendations nutrientGaps={nutrientGaps} />

      {/* Detailed Nutrient Progress */}
      <NutrientProgressGrid nutritionalGoals={nutritionalGoals} />
    </div>
  );
};

export default MobileProgressRecommendations;

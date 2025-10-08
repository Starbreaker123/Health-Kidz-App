
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ChefHat, Zap, Target, ArrowRight, Lightbulb } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import QuickActions from '@/components/QuickActions';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface NutrientGap {
  nutrient: string;
  current: number;
  target: number;
  deficit: number;
  percentage: number;
}

interface QuickActionsCardProps {
  selectedChild: Child | undefined;
  nutrientGaps: NutrientGap[];
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  selectedChild,
  nutrientGaps
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!selectedChild) return null;

  const handleAICoach = () => {
    navigate('/ai-coach');
  };

  const handleMealSuggestions = () => {
    navigate('/meals', { state: { openSuggestions: true } });
  };

  const handleAddMeal = () => {
    navigate('/meals');
  };

  const handleViewProgress = () => {
    navigate('/enhanced-progress');
  };

  // Create functional quick actions based on actual data
  const quickActions = [
    {
      title: 'Ask AI Coach',
      description: `Get personalized nutrition advice for ${selectedChild.name}`,
      icon: Brain,
      gradient: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      onClick: handleAICoach
    },
    {
      title: 'Smart Meal Ideas',
      description: nutrientGaps.length > 0 
        ? `Meals targeting ${nutrientGaps[0]?.nutrient?.replace('_g', '')} needs`
        : 'Discover healthy meal suggestions',
      icon: ChefHat,
      gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
      onClick: handleMealSuggestions
    }
  ];

  // Add specific actions based on nutrient gaps
  if (nutrientGaps.length > 0) {
    const topGap = nutrientGaps[0];
    if (topGap.percentage < 60) {
      quickActions.push({
        title: 'Log a Meal',
        description: `Track food to improve ${topGap.nutrient.replace('_g', '')} intake`,
        icon: Zap,
        gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
        onClick: handleAddMeal
      });
    }
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-violet-200 animate-fade-in-up">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-3`}>
          <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-violet-100 rounded-xl`}>
            <Lightbulb className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-violet-600`} />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent font-bold">
            Smart Actions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Main Action Buttons */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} mb-4`}>
          <Button
            onClick={handleAICoach}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white h-auto py-4 px-4"
          >
            <div className="flex items-center gap-3 w-full">
              <Brain className="w-6 h-6" />
              <div className="text-left flex-1">
                <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                  AI Nutrition Coach
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>
                  Get personalized advice
                </div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>

          <Button
            onClick={handleMealSuggestions}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white h-auto py-4 px-4"
          >
            <div className="flex items-center gap-3 w-full">
              <ChefHat className="w-6 h-6" />
              <div className="text-left flex-1">
                <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                  Meal Suggestions
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>
                  {nutrientGaps.length > 0 ? 'Targeted recipes' : 'Healthy ideas'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>

        {/* Contextual Quick Actions */}
        {nutrientGaps.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40">
            <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 mb-3`}>
              Quick Wins for Today
            </h4>
            <div className="space-y-2">
              {nutrientGaps.slice(0, 2).map((gap, index) => (
                <div 
                  key={gap.nutrient}
                  className="flex items-center justify-between p-2 bg-white/40 rounded-lg"
                >
                  <div className="flex-1">
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
                      Add {gap.nutrient.replace('_g', '')} rich foods
                    </span>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                      Need {Math.round(gap.deficit)} {gap.nutrient.includes('calories') ? 'cal' : 'g'} more
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMealSuggestions}
                    className={`${isMobile ? 'text-xs h-8' : ''} border-violet-200 hover:bg-violet-50`}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Find Foods
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Quick Actions using the existing component */}
        {!isMobile && (
          <div className="mt-4">
            <QuickActions actions={quickActions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;

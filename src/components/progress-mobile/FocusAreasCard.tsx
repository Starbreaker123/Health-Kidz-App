import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getNutrientDisplayName } from '@/services/nutrition/nutrientAnalysis';
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

interface NutrientGap {
  nutrient: string;
  current: number;
  target: number;
  deficit: number;
  percentage: number;
}

interface FocusAreasCardProps {
  nutrientGaps: NutrientGap[];
  selectedChild: Child | undefined;
}

const FocusAreasCard: React.FC<FocusAreasCardProps> = ({
  nutrientGaps,
  selectedChild
}) => {
  const isMobile = useIsMobile();

  // Memoize calculations to prevent unnecessary re-renders
  const seriousGaps = useMemo(() => 
    nutrientGaps.filter(gap => gap.percentage < 60), 
    [nutrientGaps]
  );

  // Always use clinical recommendations for targets
  const recommendations = selectedChild ? calculateClinicalNutritionRecommendations(selectedChild) : undefined;
  const getClinicalTarget = (nutrient: string) => {
    if (!recommendations) return 0;
    switch (nutrient) {
      case 'calories': return recommendations.calories;
      case 'protein_g': return recommendations.protein_g;
      case 'carbs_g': return recommendations.carbs_g;
      case 'fat_g': return recommendations.fat_g;
      default: return 0;
    }
  };

  const recommendationsText = useMemo(() => {
    const recommendationMap: { [key: string]: string } = {
      'protein_g': 'Try eggs, Greek yogurt, lean meats, or protein smoothies',
      'calories': 'Add healthy snacks like nuts, fruits, or whole grain crackers',
      'carbs_g': 'Include whole grains, fruits, and vegetables in meals',
      'fat_g': 'Add healthy fats like avocado, nuts, or olive oil'
    };
    return recommendationMap;
  }, []);

  const getPriorityLevel = useMemo(() => (percentage: number) => {
    if (percentage < 30) return { level: 'Critical', color: 'border-red-200 text-red-700 bg-red-50' };
    if (percentage < 50) return { level: 'High', color: 'border-orange-200 text-orange-700 bg-orange-50' };
    return { level: 'Medium', color: 'border-yellow-200 text-yellow-700 bg-yellow-50' };
  }, []);

  const getRecommendation = (nutrient: string) => {
    return recommendationsText[nutrient] || 'Consult with a nutritionist for specific guidance';
  };

  if (!selectedChild) return null;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 animate-fade-in-up">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-3`}>
          <div className={`${isMobile ? 'p-2' : 'p-2'} bg-amber-100 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center`}>
            <AlertTriangle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-amber-600`} />
          </div>
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-bold">
            Focus Areas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {seriousGaps.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 text-center border border-white/40">
            <div className="min-h-[44px] min-w-[44px] flex items-center justify-center mx-auto mb-3">
              <Target className="w-12 h-12 text-green-500" />
            </div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-2`}>
              Great Job!
            </h3>
            <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600`}>
              {selectedChild.name} is doing well with nutrition today! No serious gaps detected.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {seriousGaps.slice(0, 3).map((gap, index) => {
              const priority = getPriorityLevel(gap.percentage);
              const clinicalTarget = getClinicalTarget(gap.nutrient);
              return (
                <div 
                  key={gap.nutrient}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
                          {getNutrientDisplayName(gap.nutrient)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`${priority.color} ${isMobile ? 'text-sm px-3 py-1 min-h-[32px]' : 'text-base px-4 py-2'}`}
                        >
                          {priority.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-700`}>
                          {Math.round(gap.current)} / {Math.round(clinicalTarget)} {gap.nutrient.includes('calories') ? 'cal' : 'g'}
                        </span>
                        <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>
                          ({gap.percentage}% achieved)
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3 min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <TrendingUp className={`w-6 h-6 ${gap.percentage < 30 ? 'text-red-500' : gap.percentage < 50 ? 'text-orange-500' : 'text-yellow-500'}`} />
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        gap.percentage < 30 ? 'bg-red-500' : 
                        gap.percentage < 50 ? 'bg-orange-500' : 
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(gap.percentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 leading-relaxed`}>
                    💡 {getRecommendation(gap.nutrient)}
                  </p>
                </div>
              );
            })}
            
            {seriousGaps.length > 3 && (
              <div className="text-center py-3">
                <span className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-500`}>
                  +{seriousGaps.length - 3} more areas to focus on
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusAreasCard;

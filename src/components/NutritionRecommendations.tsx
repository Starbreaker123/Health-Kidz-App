
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileCard, Typography, TouchTarget } from '@/components/ui/design-system';
import { getNutrientDisplayName, getNutrientUnit } from '@/services/spoonacularApi';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp } from 'lucide-react';

interface NutrientGap {
  nutrient: string;
  current: number;
  target: number;
  deficit: number;
  percentage: number;
}

interface NutritionRecommendationsProps {
  nutrientGaps: NutrientGap[];
}

const NutritionRecommendations: React.FC<NutritionRecommendationsProps> = ({
  nutrientGaps
}) => {
  const isMobile = useIsMobile();

  if (nutrientGaps.length === 0) return null;

  if (isMobile) {
    return (
      <MobileCard variant="default" className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <TouchTarget className="bg-yellow-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </TouchTarget>
          <Typography.MobileSubtitle>Nutrition Tips</Typography.MobileSubtitle>
        </div>
        <div className="space-y-3">
          {nutrientGaps.slice(0, 3).map((gap, index) => (
            <div 
              key={gap.nutrient} 
              className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg micro-bounce"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {getNutrientDisplayName(gap.nutrient)}
                </h4>
                <p className="text-xs text-gray-600">
                  {gap.percentage}% of daily goal
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-yellow-700">
                  {gap.deficit.toFixed(1)} {getNutrientUnit(gap.nutrient)}
                </p>
                <p className="text-xs text-gray-500">needed</p>
              </div>
            </div>
          ))}
        </div>
      </MobileCard>
    );
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
          Nutrition Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nutrientGaps.slice(0, 3).map((gap, index) => (
            <div 
              key={gap.nutrient} 
              className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <h4 className="font-medium text-gray-900">
                  {getNutrientDisplayName(gap.nutrient)}
                </h4>
                <p className="text-sm text-gray-600">
                  {gap.percentage}% of daily goal reached
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-yellow-700">
                  {gap.deficit.toFixed(1)} {getNutrientUnit(gap.nutrient)} needed
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionRecommendations;

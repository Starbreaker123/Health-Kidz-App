
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface ProgressOverviewSummaryProps {
  selectedChild: Child | undefined;
  selectedDate: string;
  nutritionalGoals: NutritionalGoal[];
  nutrientGaps: NutrientGap[];
}

const ProgressOverviewSummary: React.FC<ProgressOverviewSummaryProps> = ({
  selectedChild,
  selectedDate,
  nutritionalGoals,
  nutrientGaps
}) => {
  const isMobile = useIsMobile();

  if (!selectedChild) return null;

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 shadow-lg">
        <CardContent className={`${isMobile ? 'p-4' : 'p-4'}`}>
          <div className={`flex items-center ${isMobile ? 'space-x-4' : 'space-x-3'}`}>
            <Target className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} text-green-600`} />
            <div>
              <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>Goals Met</h3>
              <p className={`font-bold text-green-600 ${isMobile ? 'text-3xl' : 'text-2xl'}`}>
                {nutritionalGoals.filter(goal => (goal.current / goal.target) >= 0.8).length}
              </p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>out of {nutritionalGoals.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
        <CardContent className={`${isMobile ? 'p-4' : 'p-4'}`}>
          <div className={`flex items-center ${isMobile ? 'space-x-4' : 'space-x-3'}`}>
            <TrendingUp className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} text-yellow-600`} />
            <div>
              <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>Needs Attention</h3>
              <p className={`font-bold text-yellow-600 ${isMobile ? 'text-3xl' : 'text-2xl'}`}>
                {nutrientGaps.length}
              </p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>nutrients below target</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
        <CardContent className={`${isMobile ? 'p-4' : 'p-4'}`}>
          <div className={`flex items-center ${isMobile ? 'space-x-4' : 'space-x-3'}`}>
            <Calendar className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} text-purple-600`} />
            <div>
              <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>Tracking For</h3>
              <p className={`font-bold text-purple-600 ${isMobile ? 'text-xl' : 'text-lg'}`}>{selectedChild.name}</p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>{selectedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverviewSummary;

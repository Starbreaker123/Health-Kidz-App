import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressOverviewSummary from '@/components/ProgressOverviewSummary';
import { MobileCard, TouchTarget } from '@/components/ui/design-system';
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

interface ProgressDashboardProps {
  selectedChild: Child | null;
  selectedDate: string;
  nutritionalGoals: any[];
  nutrientGaps: any[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  selectedChild,
  selectedDate,
  nutritionalGoals,
  nutrientGaps
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
      {/* Nutrition Rings */}
      <div className="animate-fade-in-up">
        <ProgressOverviewSummary
          selectedChild={selectedChild}
          selectedDate={selectedDate}
          nutritionalGoals={nutritionalGoals}
          nutrientGaps={nutrientGaps}
        />
      </div>
    </div>
  );
};

export default ProgressDashboard;

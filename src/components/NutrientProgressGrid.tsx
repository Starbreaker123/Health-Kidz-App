
import React from 'react';
import NutrientProgressCard from '@/components/NutrientProgressCard';
import { Typography } from '@/components/ui/design-system';
import { useIsMobile } from '@/hooks/use-mobile';

interface NutritionalGoal {
  nutrient: string;
  current: number;
  target: number;
  unit: string;
  displayName: string;
}

interface NutrientProgressGridProps {
  nutritionalGoals: NutritionalGoal[];
}

const NutrientProgressGrid: React.FC<NutrientProgressGridProps> = ({
  nutritionalGoals
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 animate-fade-in-up">
      {isMobile ? (
        <Typography.MobileSubtitle className="text-gray-900">
          Daily Nutrition Breakdown
        </Typography.MobileSubtitle>
      ) : (
        <Typography.H3 className="text-gray-900">
          Daily Nutrition Breakdown
        </Typography.H3>
      )}
      <div className={`mobile-grid animate-scale-in`}>
        {nutritionalGoals.map((goal, index) => (
          <div 
            key={goal.nutrient}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <NutrientProgressCard
              nutrient={goal.nutrient}
              current={goal.current}
              target={goal.target}
              unit={goal.unit}
              displayName={goal.displayName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutrientProgressGrid;

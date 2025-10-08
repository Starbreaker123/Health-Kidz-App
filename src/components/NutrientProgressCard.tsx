
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { MobileCard, TouchTarget } from '@/components/ui/design-system';
import { useIsMobile } from '@/hooks/use-mobile';

interface NutrientProgressCardProps {
  nutrient: string;
  current: number;
  target: number;
  unit: string;
  displayName: string;
  color?: string;
}

const NutrientProgressCard: React.FC<NutrientProgressCardProps> = ({
  nutrient,
  current,
  target,
  unit,
  displayName,
  color = 'green'
}) => {
  const isMobile = useIsMobile();
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = percentage >= 100;
  const isGood = percentage >= 80;
  const isLow = percentage < 50;

  const getStatusIcon = () => {
    const iconSize = 'w-5 h-5'; // Consistent size
    if (isComplete) return <CheckCircle className={`${iconSize} text-green-500`} />;
    if (isGood) return <Circle className={`${iconSize} text-yellow-500`} />;
    return <AlertCircle className={`${iconSize} text-red-500`} />;
  };

  const getBackgroundColor = () => {
    if (isComplete) return 'bg-green-50 border-green-200';
    if (isGood) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (isMobile) {
    return (
      <MobileCard variant="interactive" className={`${getBackgroundColor()} micro-bounce`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-medium text-gray-700">{displayName}</h4>
          <TouchTarget className="touch-target">{getStatusIcon()}</TouchTarget>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-base">
              {current.toFixed(1)} {unit}
            </span>
            <span className="text-gray-500 text-base">
              / {target.toFixed(1)} {unit}
            </span>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-4 touch-target"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium text-base ${
              isComplete ? 'text-green-600' : 
              isGood ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round(percentage)}%
            </span>
            {!isComplete && (
              <span className="text-gray-500 text-base">
                {(target - current).toFixed(1)} {unit} to go
              </span>
            )}
          </div>
        </div>
      </MobileCard>
    );
  }

  return (
    <Card className={`${getBackgroundColor()} transition-all duration-200 hover:shadow-xl nutri-floating`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-gray-700">
            {displayName}
          </CardTitle>
          <div className="touch-target">
            {getStatusIcon()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold">
            {current.toFixed(1)} {unit}
          </span>
          <span className="text-gray-500">
            / {target.toFixed(1)} {unit}
          </span>
        </div>
        
        <Progress 
          value={percentage} 
          className="h-3 touch-target"
        />
        
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${
            isComplete ? 'text-green-600' : 
            isGood ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {Math.round(percentage)}% Complete
          </span>
          {!isComplete && (
            <span className="text-gray-500">
              {(target - current).toFixed(1)} {unit} to go
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutrientProgressCard;

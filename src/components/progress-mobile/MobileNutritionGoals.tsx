
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle, AlertCircle, Clock, TrendingUp, Zap } from 'lucide-react';
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

interface MobileNutritionGoalsProps {
  nutritionalGoals: NutritionalGoal[];
  nutrientGaps: NutrientGap[];
  selectedChild: Child | undefined;
}

const MobileNutritionGoals: React.FC<MobileNutritionGoalsProps> = ({
  nutritionalGoals,
  nutrientGaps,
  selectedChild
}) => {
  const isMobile = useIsMobile();

  if (!selectedChild || nutritionalGoals.length === 0) return null;

  const getGoalStatus = (goal: NutritionalGoal) => {
    const percentage = (goal.current / goal.target) * 100;
    if (percentage >= 90) return { 
      status: 'excellent', 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      progressColor: 'bg-green-500'
    };
    if (percentage >= 75) return { 
      status: 'good', 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      progressColor: 'bg-blue-500'
    };
    if (percentage >= 50) return { 
      status: 'progress', 
      icon: Clock, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      progressColor: 'bg-yellow-500'
    };
    return { 
      status: 'needs-attention', 
      icon: AlertCircle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      progressColor: 'bg-red-500'
    };
  };

  const getStatusMessage = (status: string, deficit: number, unit: string) => {
    switch (status) {
      case 'excellent': return 'Excellent! Goal exceeded!';
      case 'good': return 'Great progress! Almost there!';
      case 'progress': return `Need ${Math.round(deficit)} more ${unit}`;
      case 'needs-attention': return `Focus needed: ${Math.round(deficit)} ${unit} remaining`;
      default: return '';
    }
  };

  const achievedGoals = nutritionalGoals.filter(goal => (goal.current / goal.target) >= 0.9).length;
  const goodProgress = nutritionalGoals.filter(goal => {
    const perc = (goal.current / goal.target);
    return perc >= 0.75 && perc < 0.9;
  }).length;
  const needsFocus = nutritionalGoals.filter(goal => (goal.current / goal.target) < 0.5).length;

  return (
    <Card className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border-teal-200 animate-fade-in-up">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-3`}>
          <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-teal-100 rounded-xl`}>
            <Target className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-teal-600`} />
          </div>
          <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-bold">
            Nutrition Goals Progress
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Goals Progress Cards */}
        <div className="space-y-3 mb-6">
          {nutritionalGoals.map((goal, index) => {
            const status = getGoalStatus(goal);
            const StatusIcon = status.icon;
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            const deficit = goal.target - goal.current;

            return (
              <div 
                key={goal.nutrient}
                className={`${status.bgColor} ${status.borderColor} border rounded-xl p-4 animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    <div>
                      <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}>
                        {goal.displayName}
                      </span>
                      <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                        {Math.round(goal.current)} / {Math.round(goal.target)} {goal.unit}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={status.status === 'excellent' ? "default" : "outline"}
                    className={`${isMobile ? 'text-xs px-2 py-0.5' : ''} ${
                      status.status === 'excellent' ? 'bg-green-500 text-white' : 
                      status.status === 'good' ? 'border-blue-400 text-blue-700 bg-blue-50' : 
                      status.status === 'progress' ? 'border-yellow-400 text-yellow-700 bg-yellow-50' : 
                      'border-red-400 text-red-700 bg-red-50'
                    }`}
                  >
                    {Math.round(percentage)}%
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${status.progressColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Status Message */}
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} ${status.color} font-medium text-center`}>
                  {getStatusMessage(status.status, deficit, goal.unit)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Summary Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-teal-600" />
            <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}>
              Daily Goals Summary
            </span>
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-3 gap-4'}`}>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600`}>
                {achievedGoals}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-700 font-medium`}>
                Excellent
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-600`}>
                90%+ achieved
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-600`}>
                {goodProgress}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-700 font-medium`}>
                Good Progress
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-600`}>
                75-89% achieved
              </div>
            </div>
            
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-red-600`}>
                {needsFocus}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-700 font-medium`}>
                Needs Focus
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-600`}>
                Below 50%
              </div>
            </div>
          </div>

          {/* Overall Progress Indicator */}
          <div className="mt-4 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
            <div className="flex items-center justify-between mb-2">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
                Overall Progress
              </span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-teal-600`}>
                {Math.round(((achievedGoals + goodProgress * 0.8) / nutritionalGoals.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.round(((achievedGoals + goodProgress * 0.8) / nutritionalGoals.length) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileNutritionGoals;

import React from 'react';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { Typography } from '@/components/ui/design-system';
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

interface MobileProgressHeaderProps {
  selectedChild?: Child;
  nutritionalGoals?: NutritionalGoal[];
}

const MobileProgressHeader: React.FC<MobileProgressHeaderProps> = ({
  selectedChild,
  nutritionalGoals = []
}) => {
  const isMobile = useIsMobile();
  
  const goalsAchieved = nutritionalGoals.filter(goal => (goal.current / goal.target) >= 0.8).length;
  const totalGoals = nutritionalGoals.length;
  const achievementPercentage = totalGoals > 0 ? Math.round((goalsAchieved / totalGoals) * 100) : 0;

  return (
    <div className="relative overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
      <div className="relative bg-gradient-to-br from-green-400/90 via-blue-400/90 to-purple-500/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-center space-x-4 sm:space-x-6 mb-6">
            <div className="bg-white/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg animate-scale-in flex-shrink-0">
              <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              {isMobile ? (
                <>
                  <Typography.MobileTitle className="text-white drop-shadow-lg mb-1">
                    {selectedChild ? `${selectedChild.name}'s Progress` : 'Nutrition Progress'}
                  </Typography.MobileTitle>
                  <Typography.MobileBody className="text-white/90 drop-shadow">
                    Daily nutrition tracking and insights
                  </Typography.MobileBody>
                </>
              ) : (
                <>
                  <Typography.H1 className="text-white drop-shadow-lg mb-2">
                    {selectedChild ? `${selectedChild.name}'s Progress` : 'Nutrition Progress'}
                  </Typography.H1>
                  <Typography.Body className="text-white/90 drop-shadow text-lg">
                    Daily nutrition tracking and insights
                  </Typography.Body>
                </>
              )}
            </div>
            <div className="hidden sm:flex bg-white/20 backdrop-blur-md p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white drop-shadow" />
            </div>
          </div>

          {/* Quick Stats */}
          {selectedChild && nutritionalGoals.length > 0 && (
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4'}`}>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <Target className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/90 font-medium`}>
                    Goals Met
                  </span>
                </div>
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
                  {goalsAchieved}/{totalGoals}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <Award className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/90 font-medium`}>
                    Success Rate
                  </span>
                </div>
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
                  {achievementPercentage}%
                </div>
              </div>

              {!isMobile && (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/30">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-sm text-white/90 font-medium">
                      Tracking
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white truncate">
                    {selectedChild.name}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Adjusted header height for very small screens */}
      <div className="h-3 sm:h-4" />
    </div>
  );
};

export default MobileProgressHeader;

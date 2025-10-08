
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface WeeklyStat {
  label: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface WeeklyProgressSummaryProps {
  weeklyStats: WeeklyStat[];
  goalsAchieved: number;
  totalGoals: number;
  streak: number;
}

const WeeklyProgressSummary: React.FC<WeeklyProgressSummaryProps> = ({
  weeklyStats,
  goalsAchieved,
  totalGoals,
  streak
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Weekly Achievement */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Goals Achieved</p>
              <p className="text-2xl font-bold text-green-800">
                {goalsAchieved}/{totalGoals}
              </p>
              <p className="text-xs text-green-600">
                {Math.round((goalsAchieved / totalGoals) * 100)}% completion
              </p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Current Streak</p>
              <p className="text-2xl font-bold text-orange-800">{streak}</p>
              <p className="text-xs text-orange-600">
                {streak > 0 ? 'days of good nutrition' : 'Start a new streak!'}
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      {/* Top Weekly Stats */}
      {weeklyStats.slice(0, 2).map((stat, index) => {
        const trendPercentage = getTrendPercentage(stat.current, stat.previous);
        const progressPercentage = (stat.current / stat.target) * 100;
        
        return (
          <Card key={index} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                {getTrendIcon(stat.trend)}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stat.current.toFixed(1)} {stat.unit}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className={`${
                  trendPercentage > 0 ? 'text-green-600' : 
                  trendPercentage < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}% vs last week
                </span>
                <span className="text-gray-500">
                  {progressPercentage.toFixed(0)}% of goal
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WeeklyProgressSummary;

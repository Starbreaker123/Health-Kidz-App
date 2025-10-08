
import React from 'react';
import UnifiedNutritionChart from '@/components/charts/UnifiedNutritionChart';
import SmartInsights from '@/components/analytics/SmartInsights';

interface ProgressAnalyticsProps {
  enhancedNutritionHistory: any[];
  macroData: any[];
  totalCalories: number;
  insights: any[];
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  enhancedNutritionHistory,
  macroData,
  totalCalories,
  insights
}) => {
  return (
    <>
      {/* Unified Chart Component */}
      <UnifiedNutritionChart
        trendData={enhancedNutritionHistory}
        macroData={macroData}
        totalCalories={totalCalories}
      />

      {/* Smart Insights */}
      <SmartInsights insights={insights} />
    </>
  );
};

export default ProgressAnalytics;

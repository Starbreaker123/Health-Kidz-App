
import WeeklyProgressSummary from '@/components/analytics/WeeklyProgressSummary';
import UnifiedNutritionChart from '@/components/charts/UnifiedNutritionChart';
import AdvancedInsights from '@/components/analytics/AdvancedInsights';
import ComparativeAnalytics from '@/components/analytics/ComparativeAnalytics';
import NutritionPatterns from '@/components/analytics/NutritionPatterns';
import ProgressOverviewSummary from '@/components/ProgressOverviewSummary';
import SmartInsights from '@/components/analytics/SmartInsights';
import NutrientProgressGrid from '@/components/NutrientProgressGrid';
import NutritionRecommendations from '@/components/NutritionRecommendations';

interface EnhancedProgressContentProps {
  selectedChild: any;
  selectedDate: string;
  nutritionalGoals: any[];
  nutrientGaps: any[];
  enhancedNutritionHistory: any[];
  macroData: any[];
  dailyIntake: Record<string, number>;
  weeklyStats: any;
  goalsAchieved: number;
  totalGoals: number;
  streak: number;
  advancedInsights: any;
  weeklyComparisons: any;
  monthlyComparisons: any;
  mealPatterns: any;
  eatingPatterns: any;
  insights: any;
}

const EnhancedProgressContent = ({
  selectedChild,
  selectedDate,
  nutritionalGoals,
  nutrientGaps,
  enhancedNutritionHistory,
  macroData,
  dailyIntake,
  weeklyStats,
  goalsAchieved,
  totalGoals,
  streak,
  advancedInsights,
  weeklyComparisons,
  monthlyComparisons,
  mealPatterns,
  eatingPatterns,
  insights
}: EnhancedProgressContentProps) => {
  return (
    <>
      <WeeklyProgressSummary
        weeklyStats={weeklyStats}
        goalsAchieved={goalsAchieved}
        totalGoals={totalGoals}
        streak={streak}
      />

      <UnifiedNutritionChart
        trendData={enhancedNutritionHistory}
        macroData={macroData}
        totalCalories={dailyIntake.calories || 0}
      />

      <AdvancedInsights 
        insights={advancedInsights}
        selectedChild={selectedChild}
      />

      <ComparativeAnalytics
        weeklyData={weeklyComparisons}
        monthlyData={monthlyComparisons}
      />

      <NutritionPatterns
        mealPatterns={mealPatterns}
        eatingPatterns={eatingPatterns}
        selectedChild={selectedChild}
      />

      <ProgressOverviewSummary
        selectedChild={selectedChild}
        selectedDate={selectedDate}
        nutritionalGoals={nutritionalGoals}
        nutrientGaps={nutrientGaps}
      />

      <SmartInsights insights={insights} />

      <NutrientProgressGrid nutritionalGoals={nutritionalGoals} />

      <NutritionRecommendations nutrientGaps={nutrientGaps} />
    </>
  );
};

export default EnhancedProgressContent;

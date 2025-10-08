
import { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useEnhancedProgressData } from '@/hooks/useEnhancedProgressData';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedProgressHeader from '@/components/enhanced-progress/EnhancedProgressHeader';
import EnhancedProgressSelectors from '@/components/enhanced-progress/EnhancedProgressSelectors';
import EnhancedProgressContent from '@/components/enhanced-progress/EnhancedProgressContent';

const EnhancedProgress = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedDate,
    setSelectedDate,
    loading,
    selectedChild,
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
  } = useEnhancedProgressData(user);

  if (loading) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  if (children.length === 0) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="space-y-6">
          <EnhancedProgressHeader isMobile={isMobile} />
          
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No children profiles</h3>
              <p className="text-gray-500 mb-4">Add a child profile first to track nutrition progress</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <EnhancedProgressHeader isMobile={isMobile} />

        <EnhancedProgressSelectors
          children={children}
          selectedChildId={selectedChildId}
          selectedDate={selectedDate}
          onChildChange={setSelectedChildId}
          onDateChange={setSelectedDate}
        />

        <EnhancedProgressContent
          selectedChild={selectedChild}
          selectedDate={selectedDate}
          nutritionalGoals={nutritionalGoals}
          nutrientGaps={nutrientGaps}
          enhancedNutritionHistory={enhancedNutritionHistory}
          macroData={macroData}
          dailyIntake={dailyIntake}
          weeklyStats={weeklyStats}
          goalsAchieved={goalsAchieved}
          totalGoals={totalGoals}
          streak={streak}
          advancedInsights={advancedInsights}
          weeklyComparisons={weeklyComparisons}
          monthlyComparisons={monthlyComparisons}
          mealPatterns={mealPatterns}
          eatingPatterns={eatingPatterns}
          insights={insights}
        />
      </div>
    </Layout>
  );
};

export default EnhancedProgress;

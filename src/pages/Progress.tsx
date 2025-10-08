import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useEnhancedProgressData } from '@/hooks/useEnhancedProgressData';
import { useIsMobile } from '@/hooks/use-mobile';
import ProgressHeader from '@/components/progress/ProgressHeader';
import ChildDateSelector from '@/components/ChildDateSelector';
import ProgressDashboard from '@/components/progress/ProgressDashboard';
import ProgressRecommendations from '@/components/progress/ProgressRecommendations';

const Progress = () => {
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
    dailyIntake,
    nutritionalGoals,
    nutrientGaps,
    enhancedNutritionHistory,
    macroData,
    weeklyStats,
    goalsAchieved,
    totalGoals,
    streak,
    advancedInsights,
    weeklyComparisons,
    monthlyComparisons,
    mealPatterns,
    eatingPatterns,
    insights,
    errors,
    refetch
  } = useEnhancedProgressData(user);

  if (loading) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="text-sm text-gray-500">Loading nutrition data...</p>
        </div>
      </Layout>
    );
  }

  if (children.length === 0) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="space-y-6">
          <ProgressHeader />
          
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No children profiles</h3>
              <p className="text-gray-500 mb-4">Add a child profile first to track nutrition progress</p>
              <Button 
                onClick={() => window.location.href = '/children'} 
                className="bg-green-500 hover:bg-green-600"
              >
                Add Child Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <ProgressHeader />
        
        <ChildDateSelector
          children={children}
          selectedChildId={selectedChildId}
          selectedDate={selectedDate}
          onChildChange={setSelectedChildId}
          onDateChange={setSelectedDate}
        />

        <ProgressDashboard
          selectedChild={selectedChild}
          selectedDate={selectedDate}
          nutritionalGoals={nutritionalGoals}
          nutrientGaps={nutrientGaps}
        />

        <ProgressRecommendations
          nutritionalGoals={nutritionalGoals}
          nutrientGaps={nutrientGaps}
        />
      </div>
    </Layout>
  );
};

export default Progress;

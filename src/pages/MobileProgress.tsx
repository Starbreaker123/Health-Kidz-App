import { useState } from 'react';
import { BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useEnhancedProgressData } from '@/hooks/useEnhancedProgressData';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileProgressHeader from '@/components/progress-mobile/MobileProgressHeader';
import MobileChildDateSelector from '@/components/progress-mobile/MobileChildDateSelector';
import UnifiedDailyOverview from '@/components/progress-mobile/UnifiedDailyOverview';
import FocusAreasCard from '@/components/progress-mobile/FocusAreasCard';
import QuickActionsCard from '@/components/progress-mobile/QuickActionsCard';

const MobileProgress = () => {
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

  // Error state
  if (errors.children || errors.general) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="space-y-6">
          <MobileProgressHeader />
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Unable to Load Data
              </h3>
              <p className="text-red-700 mb-4">
                {errors.children || errors.general || 'Something went wrong while loading your data.'}
              </p>
              <Button
                onClick={() => {
                  if (errors.children && refetch.children) {
                    refetch.children();
                  }
                }}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (children.length === 0) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="space-y-6">
          <MobileProgressHeader />
          
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
      <div className="space-y-6 pb-6">
        {/* Streamlined Header */}
        <MobileProgressHeader 
          selectedChild={selectedChild}
          nutritionalGoals={nutritionalGoals}
        />

        {/* Child and Date Selectors */}
        <MobileChildDateSelector
          children={children}
          selectedChildId={selectedChildId}
          selectedDate={selectedDate}
          onChildChange={setSelectedChildId}
          onDateChange={setSelectedDate}
        />

        {/* Show daily intake error if present */}
        {errors.dailyIntake && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800">{errors.dailyIntake}</p>
                </div>
                <Button
                  onClick={refetch.dailyIntake}
                  size="sm"
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unified Daily Overview */}
        <UnifiedDailyOverview
          selectedChild={selectedChild}
          nutritionalGoals={nutritionalGoals}
          dailyIntake={dailyIntake}
        />

        {/* Focus Areas */}
        <FocusAreasCard
          nutrientGaps={nutrientGaps}
          selectedChild={selectedChild}
        />

        {/* Quick Actions */}
        <QuickActionsCard
          selectedChild={selectedChild}
          nutrientGaps={nutrientGaps}
        />
      </div>
    </Layout>
  );
};

export default MobileProgress;

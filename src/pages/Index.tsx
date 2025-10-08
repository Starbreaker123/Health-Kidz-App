import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Users, Target, Award, Plus, Zap, Heart, Bot, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import EmptyState from '@/components/EmptyState';
import QuickActions from '@/components/QuickActions';
import NutrientRing from '@/components/NutrientRing';
import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';
import { calculateDailyIntakeFromMeals } from '@/utils/dailyIntakeCalculator';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  daily_calorie_goal?: number;
}

interface DailyIntake {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  vegetables_servings: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [dailyIntake, setDailyIntake] = useState<DailyIntake>({
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    vegetables_servings: 0
  });
  const [daysSinceJoined, setDaysSinceJoined] = useState(0);
  const [childrenLoading, setChildrenLoading] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Only redirect if user is null AND auth loading is complete
    if (user === null && !authLoading) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Handle email verification redirects
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !authLoading) {
      // User has verification code, redirect to verification page
      navigate('/verify');
    }
  }, [searchParams, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setChildrenLoading(true);
      fetchChildren();
      calculateDaysSinceJoined();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChild) {
      fetchTodayIntake();
    }
  }, [selectedChild]);

  const calculateDaysSinceJoined = () => {
    if (user?.created_at) {
      const joinDate = new Date(user.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysSinceJoined(diffDays);
    }
  };

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, birth_date, gender, weight_kg, height_cm, activity_level, daily_calorie_goal')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching children:', error);
        return;
      }

      setChildren(data || []);
      if (data && data.length > 0) {
        setSelectedChild(data[0]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setChildrenLoading(false);
    }
  };

  const fetchTodayIntake = async () => {
    if (!selectedChild) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch meals for the selected child and date
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('id, total_calories')
        .eq('child_id', selectedChild.id)
        .eq('date', today);

      if (mealsError) throw mealsError;

      if (!meals || meals.length === 0) {
        setDailyIntake({
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
          vegetables_servings: 0
        });
        return;
      }

      // Fetch food items for all meals
      const mealIds = meals.map(meal => meal.id);
      const { data: foodItems, error: foodItemsError } = await supabase
        .from('food_items')
        .select('meal_id, name, quantity, unit, calories_per_unit, protein_g, carbs_g, fat_g')
        .in('meal_id', mealIds);

      if (foodItemsError) throw foodItemsError;

      // Attach food_items to each meal
      const mealsWithItems = meals.map(meal => ({
        ...meal,
        food_items: foodItems?.filter(item => item.meal_id === meal.id) || []
      }));

      // Use the robust utility for calculation
      const calculatedIntake = calculateDailyIntakeFromMeals(mealsWithItems);
      setDailyIntake(calculatedIntake);
    } catch (error) {
      console.error('Error fetching daily intake:', error);
    }
  };
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
      age--;
    }
    return age;
  };
  const getGenderColor = (gender?: string) => {
    switch (gender) {
      case 'female':
        return 'from-pink-400 to-red-400';
      case 'male':
        return 'from-blue-400 to-indigo-400';
      default:
        return 'from-green-400 to-teal-400';
    }
  };

  // Calculate targets based on selected child
  const getNutritionGoals = (child: Child | undefined) => {
    if (!child) return { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
    const clinical = calculateClinicalNutritionRecommendations(child);
    return {
      calories: clinical.calories,
      protein_g: clinical.protein_g,
      carbs_g: clinical.carbs_g,
      fat_g: clinical.fat_g
    };
  };

  const safeChild = selectedChild || (children.length > 0 ? children[0] : undefined);
  const nutritionGoals = getNutritionGoals(safeChild);
  
  const progress = {
    calories: {
      current: Math.round(dailyIntake.calories),
      target: nutritionGoals.calories,
      percentage: nutritionGoals.calories > 0 ? Math.round(dailyIntake.calories / nutritionGoals.calories * 100) : 0
    },
    protein: {
      current: Math.round(dailyIntake.protein_g),
      target: nutritionGoals.protein_g,
      percentage: nutritionGoals.protein_g > 0 ? Math.round(dailyIntake.protein_g / nutritionGoals.protein_g * 100) : 0
    },
    vegetables: {
      current: Math.round(dailyIntake.vegetables_servings),
      target: 5, // Standard recommendation for vegetables
      percentage: Math.round(dailyIntake.vegetables_servings / 5 * 100)
    }
  };
  const overallProgress = Math.round((progress.calories.percentage + progress.protein.percentage + progress.vegetables.percentage) / 3);
  const quickActions = [{
    title: 'Log Today\'s Meals',
    description: 'Add breakfast, lunch, dinner & snacks',
    icon: Calendar,
    gradient: 'nutri-gradient-orange',
    onClick: () => navigate('/meals')
  }, {
    title: 'Ask AI Coach',
    description: 'Get personalized nutrition advice',
    icon: Bot,
    gradient: 'nutri-gradient-purple',
    onClick: () => navigate('/ai-coach')
  }, {
    title: 'Manage Children',
    description: 'Add profiles & set nutrition goals',
    icon: Users,
    gradient: 'nutri-gradient-blue',
    onClick: () => navigate('/children')
  }, {
    title: 'View Progress',
    description: 'Track nutrition achievements',
    icon: Target,
    gradient: 'nutri-gradient-green',
    onClick: () => navigate('/progress')
  }];
  if (authLoading || childrenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            {authLoading ? 'Checking authentication...' : 'Loading your nutrition dashboard...'}
          </p>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  if (!user) {
    return null; // Will redirect to auth
  }
  return <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* Welcome Hero Card */}
        <Card className="nutri-card nutri-gradient-green text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
          <CardContent className="p-4 sm:p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl sm:text-2xl animate-bounce">👋</span>
                  <h2 className="text-xl sm:text-2xl font-bold nutri-text-shadow">Good Morning!</h2>
                </div>
                <p className="text-green-100 mb-3 sm:mb-4 text-sm sm:text-lg">
                  Let's make today a healthy adventure for your kids
                </p>
              </div>
              <div className="flex items-center space-x-1 bg-white/20 rounded-full px-2 sm:px-3 py-1">
                <span className="text-lg sm:text-2xl">⭐</span>
                <span className="text-xs sm:text-sm font-medium">Day {daysSinceJoined}</span>
              </div>
            </div>
            
            <div className="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm font-medium">
                  {selectedChild ? `${selectedChild.name}'s Progress Today` : "Today's Overall Progress"}
                </p>
                <span className="text-xs sm:text-sm bg-white/30 px-2 sm:px-3 py-1 rounded-full font-semibold">
                  {overallProgress}%
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 sm:h-3 mb-2 sm:mb-3">
                <div className="bg-white h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out shadow-sm" style={{
                width: `${Math.min(overallProgress, 100)}%`
              }}></div>
              </div>
              <p className="text-xs sm:text-sm text-green-100">
                {overallProgress >= 80 ? "🎉 Excellent progress! Your kids are exceeding their nutrition goals." : overallProgress >= 50 ? "👍 Good progress! Keep up the healthy eating habits." : "🌱 Great start! Let's log more meals to reach daily goals."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Progress Rings with Real Data */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="nutri-card nutri-floating cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/meals')}>
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <NutrientRing value={progress.calories.current} max={progress.calories.target} color="#3b82f6" size={56} strokeWidth={6}>
                <div>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-nutri-blue mx-auto mb-1" />
                  <p className="text-xs sm:text-sm text-gray-500">Calories</p>
                </div>
              </NutrientRing>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mt-2">Energy</h3>
              <p className="text-base sm:text-lg font-bold text-nutri-blue">{progress.calories.current}</p>
              <p className="text-xs sm:text-sm text-gray-500">of {progress.calories.target}</p>
            </CardContent>
          </Card>

          <Card className="nutri-card nutri-floating cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/meals')}>
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <NutrientRing value={progress.protein.current} max={progress.protein.target} color="#8b5cf6" size={56} strokeWidth={6}>
                <div>
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-nutri-purple mx-auto mb-1" />
                  <p className="text-xs sm:text-sm text-gray-500">Protein</p>
                </div>
              </NutrientRing>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mt-2">Growth</h3>
              <p className="text-base sm:text-lg font-bold text-nutri-purple">{progress.protein.current}g</p>
              <p className="text-xs sm:text-sm text-gray-500">of {progress.protein.target}g</p>
            </CardContent>
          </Card>

          <Card className="nutri-card nutri-floating cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/meals')}>
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <NutrientRing value={progress.vegetables.current} max={progress.vegetables.target} color="#10b981" size={56} strokeWidth={6}>
                <div>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-nutri-green mx-auto mb-1" />
                  <p className="text-xs sm:text-sm text-gray-500">Veggies</p>
                </div>
              </NutrientRing>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mt-2">Health</h3>
              <p className="text-base sm:text-lg font-bold text-nutri-green">{progress.vegetables.current}</p>
              <p className="text-xs sm:text-sm text-gray-500">of {progress.vegetables.target} servings</p>
            </CardContent>
          </Card>

          <Card className="nutri-card nutri-floating cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/meals')}>
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <NutrientRing value={dailyIntake.carbs_g} max={nutritionGoals.carbs_g} color="#f59e0b" size={56} strokeWidth={6}>
                <div>
                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-nutri-orange mx-auto mb-1" />
                  <p className="text-xs sm:text-sm text-gray-500">Carbs</p>
                </div>
              </NutrientRing>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mt-2">Energy</h3>
              <p className="text-base sm:text-lg font-bold text-nutri-orange">{Math.round(dailyIntake.carbs_g)}g</p>
              <p className="text-xs sm:text-sm text-gray-500">of {nutritionGoals.carbs_g}g</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />

        {/* Children Overview */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Children</h3>
            {children.length > 0 && (
              <Button 
                size="sm" 
                onClick={() => navigate('/children')} 
                className="nutri-gradient-green text-white hover:shadow-lg transition-all nutri-floating touch-target"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Child</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>
          
          {children.length === 0 ? <EmptyState icon={Users} title="Welcome to HealthKidz!" description="Let's start by adding your first child's profile to track their nutrition journey and create healthy habits together." actionLabel="Add Your First Child" onAction={() => navigate('/children')} gradient="nutri-gradient-blue" /> : <div className="space-y-3">
              {children.map(child => {
            const childCalories = child.id === selectedChild?.id ? dailyIntake.calories : 0;
            const childTarget = getNutritionGoals(child);
            const childProgress = childTarget.calories > 0 ? (childCalories / childTarget.calories * 100) : 0;
            return (
              <Card
                key={child.id}
                className={`nutri-card nutri-floating group hover:shadow-lg transition-all cursor-pointer ${child.id === selectedChild?.id ? 'ring-2 ring-green-400' : ''} rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4`}
                onClick={() => setSelectedChild(child)}
              >
                {/* Avatar */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${getGenderColor(child.gender)} rounded-full flex items-center justify-center shadow-md border-4 border-white border-opacity-60`}>
                  <span className="text-white font-bold text-lg sm:text-2xl">
                    {child.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 w-full">
                  <h4 className="font-bold text-base sm:text-lg text-gray-900">{child.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{calculateAge(child.birth_date)} years old</p>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      {childTarget.calories} cal goal
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${childProgress >= 80 ? 'bg-green-100 text-green-700' : childProgress >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                      <Award className="w-3 h-3 inline mr-1" />
                      {childProgress >= 80 ? 'On track' : childProgress >= 50 ? 'In progress' : 'Needs attention'}
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-nutri-green">{Math.round(childCalories)}</span>
                    <span className="text-xs sm:text-sm text-gray-400 mb-1">cal today</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                    <div className="h-1 bg-nutri-green rounded-full transition-all duration-500" style={{ width: `${Math.min(childProgress, 100)}%` }}></div>
                  </div>
                </div>
              </Card>
            );
          })}
            </div>}
        </div>
      </div>
    </Layout>;
};
export default Index;
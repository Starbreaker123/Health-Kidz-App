
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Utensils, Star, AlertCircle } from 'lucide-react';

interface MealPattern {
  mealType: string;
  averageCalories: number;
  frequency: number; // days per week
  qualityScore: number; // 0-100
  commonFoods: string[];
  recommendations: string[];
}

interface EatingPattern {
  bestPerformingTime: string;
  consistencyScore: number; // 0-100
  weekendVsWeekday: {
    weekday: number;
    weekend: number;
    difference: number;
  };
  skipFrequency: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
}

interface NutritionPatternsProps {
  mealPatterns: MealPattern[];
  eatingPatterns: EatingPattern;
  selectedChild?: { name: string };
}

const NutritionPatterns: React.FC<NutritionPatternsProps> = ({
  mealPatterns,
  eatingPatterns,
  selectedChild
}) => {
  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🥪';
      case 'dinner':
        return '🍽️';
      case 'snacks':
        return '🍎';
      default:
        return '🍴';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConsistencyMessage = (score: number) => {
    if (score >= 80) return 'Very consistent eating patterns';
    if (score >= 60) return 'Moderately consistent patterns';
    return 'Irregular eating patterns detected';
  };

  return (
    <div className="space-y-6">
      {/* Meal Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-500" />
            Meal Pattern Analysis for {selectedChild?.name || 'Your Child'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mealPatterns.map((pattern) => (
            <div key={pattern.mealType} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getMealIcon(pattern.mealType)}</span>
                  <h4 className="font-semibold text-gray-900 capitalize">{pattern.mealType}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getQualityColor(pattern.qualityScore)}`}>
                    Quality: {pattern.qualityScore}/100
                  </span>
                  <span className="text-sm text-gray-600">
                    {pattern.frequency}/7 days
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Average Calories</p>
                  <p className="text-lg font-bold text-blue-600">{pattern.averageCalories}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Common Foods</p>
                  <div className="flex flex-wrap gap-1">
                    {pattern.commonFoods.slice(0, 3).map((food, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {food}
                      </span>
                    ))}
                    {pattern.commonFoods.length > 3 && (
                      <span className="text-xs text-gray-500">+{pattern.commonFoods.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>

              {pattern.recommendations.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p className="text-xs font-medium text-blue-700 mb-1">Recommendations:</p>
                  {pattern.recommendations.map((rec, index) => (
                    <p key={index} className="text-xs text-blue-600">• {rec}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Eating Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Eating Behavior Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Consistency Score */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Meal Consistency</h4>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-900">{eatingPatterns.consistencyScore}/100</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{getConsistencyMessage(eatingPatterns.consistencyScore)}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  eatingPatterns.consistencyScore >= 80 ? 'bg-green-500' :
                  eatingPatterns.consistencyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${eatingPatterns.consistencyScore}%` }}
              ></div>
            </div>
          </div>

          {/* Best Performing Time */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Optimal Eating Time</h4>
            <p className="text-sm text-gray-600 mb-2">
              {selectedChild?.name || 'Your child'} tends to eat best during:
            </p>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {eatingPatterns.bestPerformingTime}
            </span>
          </div>

          {/* Weekend vs Weekday */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Weekend vs Weekday Patterns</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Weekday Average</p>
                <p className="text-xl font-bold text-blue-600">{eatingPatterns.weekendVsWeekday.weekday} cal</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Weekend Average</p>
                <p className="text-xl font-bold text-purple-600">{eatingPatterns.weekendVsWeekday.weekend} cal</p>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className={`text-sm ${
                eatingPatterns.weekendVsWeekday.difference > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {eatingPatterns.weekendVsWeekday.difference > 0 ? '+' : ''}{eatingPatterns.weekendVsWeekday.difference} cal difference
              </span>
            </div>
          </div>

          {/* Meal Skip Frequency */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Meal Skip Analysis</h4>
            <div className="space-y-2">
              {Object.entries(eatingPatterns.skipFrequency).map(([meal, frequency]) => (
                <div key={meal} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{meal}</span>
                  <div className="flex items-center gap-2">
                    {frequency > 2 && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    <span className={`text-sm font-medium ${
                      frequency > 2 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {frequency} skips/week
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionPatterns;

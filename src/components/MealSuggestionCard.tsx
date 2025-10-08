
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Sparkles } from 'lucide-react';

interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  prepTime: number;
  servings: number;
  targetNutrients: string[];
  mealType: string;
  difficulty: string;
}

interface MealSuggestionCardProps {
  suggestion: MealSuggestion;
  onSelect?: (suggestion: MealSuggestion) => void;
}

const MealSuggestionCard: React.FC<MealSuggestionCardProps> = ({
  suggestion,
  onSelect
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-yellow-400 to-orange-400';
      case 'lunch': return 'from-green-400 to-blue-400';
      case 'dinner': return 'from-purple-400 to-pink-400';
      case 'snack': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 mb-1">
              {suggestion.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">
              {suggestion.description}
            </p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(suggestion.difficulty)} mb-2`}>
              <ChefHat className="w-3 h-3 mr-1" />
              {suggestion.difficulty}
            </div>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-r ${getMealTypeColor(suggestion.mealType)} rounded-full flex items-center justify-center`}>
            <span className="text-white font-semibold text-xs capitalize">
              {suggestion.mealType.slice(0, 2)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Meal Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {suggestion.prepTime} min
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {suggestion.servings} serving{suggestion.servings > 1 ? 's' : ''}
          </div>
        </div>

        {/* Target Nutrients */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
            Nutritional Boost:
          </h4>
          <div className="flex flex-wrap gap-1">
            {suggestion.targetNutrients.map((nutrient) => (
              <span
                key={nutrient}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {nutrient.replace('_', ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Ingredients Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredients:</h4>
          <p className="text-xs text-gray-600">
            {suggestion.ingredients.slice(0, 4).join(', ')}
            {suggestion.ingredients.length > 4 && ` +${suggestion.ingredients.length - 4} more`}
          </p>
        </div>

        {/* Action Button */}
        {onSelect && (
          <Button
            onClick={() => onSelect(suggestion)}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            size="sm"
          >
            Use This Meal
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MealSuggestionCard;

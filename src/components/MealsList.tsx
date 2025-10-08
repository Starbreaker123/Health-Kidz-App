import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Utensils, Plus } from 'lucide-react';

interface Meal {
  id: string;
  child_id: string;
  name: string;
  meal_type: string;
  date: string;
  total_calories: number;
  notes?: string;
}

interface FoodItem {
  id: string;
  meal_id: string;
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

interface MealsListProps {
  meals: Meal[];
  foodItems: { [mealId: string]: FoodItem[] };
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (mealId: string) => void;
  onAddFirstMeal: () => void;
}

const MealsList = ({ meals, foodItems, onEditMeal, onDeleteMeal, onAddFirstMeal }: MealsListProps) => {
  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-yellow-400 to-orange-400';
      case 'lunch': return 'from-green-400 to-blue-400';
      case 'dinner': return 'from-purple-400 to-pink-400';
      case 'snack': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (meals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Utensils className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-3">No meals logged for this date</p>
          <Button onClick={onAddFirstMeal} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add First Meal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <Card key={meal.id} className="rounded-xl shadow-md">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${getMealTypeColor(meal.meal_type)} rounded-full flex items-center justify-center`}>
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">{meal.name}</CardTitle>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full capitalize mt-1">{meal.meal_type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{meal.total_calories} cal</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditMeal(meal)}
                  className="min-h-[44px] min-w-[44px] text-base"
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteMeal(meal.id)}
                  className="min-h-[44px] min-w-[44px] text-base text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            {foodItems[meal.id] && foodItems[meal.id].length > 0 && (
              <div className="space-y-2 mt-2">
                <h4 className="text-sm font-medium text-gray-900">Food Items:</h4>
                <div className="grid gap-2">
                  {foodItems[meal.id].map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                      <span>{item.name}</span>
                      <span className="text-gray-600">{item.quantity} {item.unit} • {item.calories_per_unit * item.quantity} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {meal.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{meal.notes}</p>
              </div>
            )}
            {/* Tightened spacing for mobile to avoid crowding */}
            <div className="h-2 sm:h-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MealsList;

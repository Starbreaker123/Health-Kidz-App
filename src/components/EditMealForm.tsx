
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface FoodItem {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

interface Meal {
  id: string;
  child_id: string;
  name: string;
  meal_type: string;
  date: string;
  total_calories: number;
  notes?: string;
}

interface EditMealFormProps {
  meal: Meal;
  onSave: (mealData: any) => void;
  onCancel: () => void;
}

const EditMealForm = ({ meal, onSave, onCancel }: EditMealFormProps) => {
  const [formData, setFormData] = useState({
    name: meal.name,
    meal_type: meal.meal_type,
    notes: meal.notes || '',
  });
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newFoodItem, setNewFoodItem] = useState<FoodItem>({
    name: '',
    quantity: 1,
    unit: '100g',
    calories_per_unit: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchFoodItems();
  }, [meal.id]);

  const fetchFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('meal_id', meal.id);

      if (error) throw error;
      setFoodItems(data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFoodItemChange = (field: keyof FoodItem, value: string | number) => {
    setNewFoodItem(prev => ({ ...prev, [field]: value }));
  };

  const addFoodItem = async () => {
    if (newFoodItem.name && newFoodItem.calories_per_unit > 0) {
      try {
        const { error } = await supabase
          .from('food_items')
          .insert([{ ...newFoodItem, meal_id: meal.id }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Food item added successfully",
        });

        setNewFoodItem({
          name: '',
          quantity: 1,
          unit: '100g',
          calories_per_unit: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
        });

        fetchFoodItems();
      } catch (error) {
        console.error('Error adding food item:', error);
        toast({
          title: "Error",
          description: "Failed to add food item",
          variant: "destructive",
        });
      }
    }
  };

  const removeFoodItem = async (itemId?: string, index?: number) => {
    if (itemId) {
      try {
        const { error } = await supabase
          .from('food_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Food item removed successfully",
        });

        fetchFoodItems();
      } catch (error) {
        console.error('Error removing food item:', error);
        toast({
          title: "Error",
          description: "Failed to remove food item",
          variant: "destructive",
        });
      }
    }
  };

  const calculateTotalCalories = () => {
    return foodItems.reduce((total, item) => total + (item.calories_per_unit * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.meal_type) {
      return;
    }

    const mealData = {
      child_id: meal.child_id,
      name: formData.name,
      meal_type: formData.meal_type,
      date: meal.date,
      total_calories: calculateTotalCalories(),
      notes: formData.notes || null,
    };

    onSave(mealData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`${isMobile ? 'w-full max-w-[95vw] max-h-[90vh]' : 'w-full max-w-2xl max-h-[85vh]'} overflow-hidden`}>
        <CardHeader className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Edit Meal</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'} overflow-y-auto max-h-[calc(85vh-120px)]`}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Meal Info */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base font-semibold text-gray-700 mb-2 block">
                  Meal Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-12 sm:h-14 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <Label className="text-sm sm:text-base font-semibold text-gray-700 mb-2 block">
                  Meal Type *
                </Label>
                <Select value={formData.meal_type} onValueChange={(value) => handleInputChange('meal_type', value)}>
                  <SelectTrigger className="h-12 sm:h-14 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="breakfast" className="py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">🌅</span>
                        <span className="text-sm sm:text-base">Breakfast</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="lunch" className="py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">☀️</span>
                        <span className="text-sm sm:text-base">Lunch</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dinner" className="py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">🌙</span>
                        <span className="text-sm sm:text-base">Dinner</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="snack" className="py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">🍎</span>
                        <span className="text-sm sm:text-base">Snack</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Food Items Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Food Items</h3>
              
              {/* Current Food Items */}
              {foodItems.length > 0 && (
                <div className="space-y-2">
                  {foodItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <span className="font-medium text-sm sm:text-base">{item.name}</span>
                        <span className="text-gray-500 ml-2 text-xs sm:text-sm">
                          {item.quantity} {item.unit} • {item.calories_per_unit * item.quantity} cal
                        </span>
                        {(item.protein_g || item.carbs_g || item.fat_g) && (
                          <div className="text-xs text-gray-500 mt-1">
                            P: {(item.protein_g || 0) * item.quantity}g • 
                            C: {(item.carbs_g || 0) * item.quantity}g • 
                            F: {(item.fat_g || 0) * item.quantity}g
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFoodItem(item.id)}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-semibold text-green-600">
                      Total: {calculateTotalCalories()} calories
                    </span>
                  </div>
                </div>
              )}

              {/* Add Food Item Form */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Add New Food Item</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 sm:mb-4">
                    <div>
                      <Label htmlFor="food_name" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Food Name</Label>
                      <Input
                        id="food_name"
                        value={newFoodItem.name}
                        onChange={(e) => handleFoodItemChange('name', e.target.value)}
                        placeholder="e.g., Apple"
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newFoodItem.quantity}
                        onChange={(e) => handleFoodItemChange('quantity', parseFloat(e.target.value) || 0)}
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Unit</Label>
                      <Select value={newFoodItem.unit} onValueChange={(value) => handleFoodItemChange('unit', value)}>
                        <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="100g">100g (standard)</SelectItem>
                          <SelectItem value="cup">cup (185g)</SelectItem>
                          <SelectItem value="piece">piece (120g)</SelectItem>
                          <SelectItem value="gram">gram (1g)</SelectItem>
                          <SelectItem value="ounce">ounce (28g)</SelectItem>
                          <SelectItem value="tablespoon">tablespoon (15g)</SelectItem>
                          <SelectItem value="teaspoon">teaspoon (5g)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="calories" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Calories per unit</Label>
                      <Input
                        id="calories"
                        type="number"
                        min="0"
                        value={newFoodItem.calories_per_unit}
                        onChange={(e) => handleFoodItemChange('calories_per_unit', parseInt(e.target.value) || 0)}
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 sm:mb-4">
                    <div>
                      <Label htmlFor="protein" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newFoodItem.protein_g}
                        onChange={(e) => handleFoodItemChange('protein_g', parseFloat(e.target.value) || 0)}
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbs" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Carbs (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newFoodItem.carbs_g}
                        onChange={(e) => handleFoodItemChange('carbs_g', parseFloat(e.target.value) || 0)}
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fat" className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Fat (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newFoodItem.fat_g}
                        onChange={(e) => handleFoodItemChange('fat_g', parseFloat(e.target.value) || 0)}
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addFoodItem} 
                    size="sm"
                    className="h-10 sm:h-12 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Add Food Item
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm sm:text-base font-semibold text-gray-700 mb-2 block">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes about this meal..."
                rows={3}
                className="text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 h-12 sm:h-14 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-xl">
                Update Meal
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="h-12 sm:h-14 text-sm sm:text-base rounded-xl border-2 border-gray-300">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMealForm;


import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import FoodSearchInput from '@/components/FoodSearchInput';

interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

interface FoodItemManagerProps {
  foodItems: FoodItem[];
  onFoodItemsChange: (items: FoodItem[]) => void;
}

const FoodItemManager = ({ foodItems, onFoodItemsChange }: FoodItemManagerProps) => {
  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    quantity: 1,
    unit: '100g',
    calories_per_unit: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0
  });

  const handleFoodItemChange = (field: keyof FoodItem, value: string | number) => {
    setNewFoodItem(prev => ({ ...prev, [field]: value }));
  };

  const handleFoodSelect = (food: {
    name: string;
    calories_per_unit: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }) => {
    setNewFoodItem(prev => ({
      ...prev,
      name: food.name,
      calories_per_unit: food.calories_per_unit,
      protein_g: food.protein_g,
      carbs_g: food.carbs_g,
      fat_g: food.fat_g
    }));
  };

  const addFoodItem = () => {
    if (newFoodItem.name && newFoodItem.calories_per_unit > 0) {
      onFoodItemsChange([...foodItems, { ...newFoodItem }]);
      setNewFoodItem({
        name: '',
        quantity: 1,
        unit: '100g',
        calories_per_unit: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
      });
    }
  };

  const removeFoodItem = (index: number) => {
    onFoodItemsChange(foodItems.filter((_, i) => i !== index));
  };

  const calculateTotalCalories = () => {
    return foodItems.reduce((total, item) => total + (item.calories_per_unit * item.quantity), 0);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        🍽️ Food Items
      </h3>
      
      {/* Add Food Item Form */}
      <Card className="bg-gray-50/50 border border-gray-200">
        <CardContent className="p-3 space-y-3">
          {/* Food Search */}
          <div>
            <Label className="text-xs font-medium text-gray-600">Search Food Database</Label>
            <FoodSearchInput
              onFoodSelect={handleFoodSelect}
              quantity={newFoodItem.quantity}
              unit={newFoodItem.unit}
            />
          </div>

          {/* Manual Entry - Compact Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="col-span-2">
              <Label className="text-xs text-gray-600">Manual Entry</Label>
              <Input
                value={newFoodItem.name}
                onChange={(e) => handleFoodItemChange('name', e.target.value)}
                placeholder="Food name"
                className="text-sm"
              />
            </div>
            <div>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={newFoodItem.quantity}
                onChange={(e) => handleFoodItemChange('quantity', parseFloat(e.target.value) || 0)}
                placeholder="Qty"
                className="text-sm"
              />
            </div>
            <div>
              <Select value={newFoodItem.unit} onValueChange={(value) => handleFoodItemChange('unit', value)}>
                <SelectTrigger className="text-sm h-9">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                                          <SelectItem value="100g">100g (standard)</SelectItem>
                  <SelectItem value="cup">cup</SelectItem>
                  <SelectItem value="piece">piece</SelectItem>
                  <SelectItem value="gram">gram</SelectItem>
                  <SelectItem value="ounce">ounce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="number"
                min="0"
                value={newFoodItem.calories_per_unit}
                onChange={(e) => handleFoodItemChange('calories_per_unit', parseInt(e.target.value) || 0)}
                placeholder="Cal/unit"
                className="text-sm"
              />
            </div>
          </div>
          
          <Button type="button" onClick={addFoodItem} size="sm" className="w-full h-8 text-xs bg-green-600 hover:bg-green-700">
            <Plus className="w-3 h-3 mr-1" />
            Add Food
          </Button>
        </CardContent>
      </Card>

      {/* Food Items List */}
      {foodItems.length > 0 && (
        <div className="space-y-2">
          <div className="max-h-32 overflow-y-auto space-y-1">
            {foodItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.quantity} {item.unit} • {Math.round(item.calories_per_unit * item.quantity)} cal
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFoodItem(index)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="text-right bg-green-50 p-2 rounded-md">
            <span className="text-sm font-semibold text-green-700">
              Total: {calculateTotalCalories()} calories
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemManager;

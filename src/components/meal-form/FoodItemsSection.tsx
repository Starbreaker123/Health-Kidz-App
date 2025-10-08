
import { useState } from 'react';
import { Plus, Trash2, Search, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface FoodItemsSectionProps {
  foodItems: FoodItem[];
  onFoodItemsChange: (items: FoodItem[]) => void;
}

const FoodItemsSection = ({ foodItems, onFoodItemsChange }: FoodItemsSectionProps) => {
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
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🍽️ Food Items
          {foodItems.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({foodItems.length} item{foodItems.length !== 1 ? 's' : ''})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Food Item Tabs */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-lg bg-gray-100">
            <TabsTrigger value="search" className="flex items-center gap-2 rounded-md">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search Database</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2 rounded-md">
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Manual Entry</span>
              <span className="sm:hidden">Manual</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Search for food in our database
              </Label>
              <FoodSearchInput
                onFoodSelect={handleFoodSelect}
                quantity={newFoodItem.quantity}
                unit={newFoodItem.unit}
              />
              
              {/* Quantity and Unit for searched food */}
              {newFoodItem.name && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newFoodItem.quantity}
                      onChange={(e) => handleFoodItemChange('quantity', parseFloat(e.target.value) || 0)}
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Unit</Label>
                    <Select value={newFoodItem.unit} onValueChange={(value) => handleFoodItemChange('unit', value)}>
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100g">100g (standard)</SelectItem>
                        <SelectItem value="cup">cup (185g)</SelectItem>
                        <SelectItem value="piece">piece (120g)</SelectItem>
                        <SelectItem value="gram">gram (1g)</SelectItem>
                        <SelectItem value="ounce">ounce (28g)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Label className="text-sm font-medium text-gray-700">
                Enter food details manually
              </Label>
              
              <div className="space-y-3">
                <Input
                  value={newFoodItem.name}
                  onChange={(e) => handleFoodItemChange('name', e.target.value)}
                  placeholder="Food name (e.g., Apple, Chicken breast)"
                  className="h-10 rounded-lg"
                />
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Quantity</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newFoodItem.quantity}
                      onChange={(e) => handleFoodItemChange('quantity', parseFloat(e.target.value) || 0)}
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Unit</Label>
                    <Select value={newFoodItem.unit} onValueChange={(value) => handleFoodItemChange('unit', value)}>
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100g">100g (standard)</SelectItem>
                        <SelectItem value="cup">cup (185g)</SelectItem>
                        <SelectItem value="piece">piece (120g)</SelectItem>
                        <SelectItem value="gram">gram (1g)</SelectItem>
                        <SelectItem value="ounce">ounce (28g)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Cal/unit</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newFoodItem.calories_per_unit}
                      onChange={(e) => handleFoodItemChange('calories_per_unit', parseInt(e.target.value) || 0)}
                      className="h-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Button */}
        <Button 
          type="button" 
          onClick={addFoodItem} 
          disabled={!newFoodItem.name || newFoodItem.calories_per_unit <= 0}
          className="w-full h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Food Item
        </Button>

        {/* Food Items List */}
        {foodItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Added Items</h4>
              <div className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {calculateTotalCalories()} calories total
              </div>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {foodItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} {item.unit} • {Math.round(item.calories_per_unit * item.quantity)} cal
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFoodItem(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodItemsSection;

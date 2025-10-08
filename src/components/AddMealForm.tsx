import { useState } from 'react';
import { Plus, Search, Edit3, Droplets } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import FoodSearchInput from './FoodSearchInput';
import EditableFoodCard from './meal-form/EditableFoodCard';
import NutrientSummary from './meal-form/NutrientSummary';
import { useMealForm } from '@/hooks/useMealForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { getUnitLabel } from '@/services/foodDatabase';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface AddMealFormProps {
  isOpen: boolean;
  childId: string;
  date: string;
  prePopulatedData?: any;
  selectedChild?: Child;
  onSave: () => void;
  onCancel: () => void;
}

const AddMealForm = ({ isOpen, childId, date, prePopulatedData, selectedChild, onSave, onCancel }: AddMealFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [foodInputMode, setFoodInputMode] = useState<'search' | 'manual'>('search');
  const [searchQuantity, setSearchQuantity] = useState(1);
  const [searchUnit, setSearchUnit] = useState('100g');
  const isMobile = useIsMobile();
  
  // Manual food entry state
  const [manualFood, setManualFood] = useState({
    name: '',
    quantity: 1,
    unit: '100g',
    calories_per_unit: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0
  });

  const {
    mealData,
    setMealData,
    foodItems,
    setFoodItems,
    isSaving,
    handleSave
  } = useMealForm(childId, date, prePopulatedData, onSave);

  const totalCalories = foodItems.reduce((total, item) => total + (item.calories_per_unit * item.quantity), 0);

  const handleFoodSearchSelect = (food: any) => {
    const newItem = {
      id: `search-${Date.now()}-${Math.random()}`,
      name: food.name,
      quantity: searchQuantity,
      unit: searchUnit,
      calories_per_unit: food.calories_per_unit,
      protein_g: food.protein_g || 0,
      carbs_g: food.carbs_g || 0,
      fat_g: food.fat_g || 0
    };
    setFoodItems([...foodItems, newItem]);
    
    // Reset search inputs for next food
    setSearchQuantity(1);
    setSearchUnit('100g');
  };

  // Select all text on focus for quantity input
  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const addManualFoodItem = () => {
    if (!manualFood.name || manualFood.calories_per_unit <= 0) {
      return;
    }
    
    const newItem = {
      id: `manual-${Date.now()}-${Math.random()}`,
      name: manualFood.name,
      quantity: manualFood.quantity,
      unit: manualFood.unit,
      calories_per_unit: manualFood.calories_per_unit,
      protein_g: manualFood.protein_g,
      carbs_g: manualFood.carbs_g,
      fat_g: manualFood.fat_g
    };
    setFoodItems([...foodItems, newItem]);
    
    // Reset manual form
    setManualFood({
      name: '',
      quantity: 1,
      unit: '100g',
      calories_per_unit: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0
    });
  };

  const updateFoodItem = (id: string, field: string, value: any) => {
    setFoodItems(items => items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeFoodItem = (id: string) => {
    setFoodItems(items => items.filter(item => item.id !== id));
  };

  const canProceed = () => {
    if (currentStep === 1) return mealData.name && mealData.meal_type;
    if (currentStep === 2) return foodItems.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    await handleSave();
  };

  // Reset wizard and transient inputs when dialog is opened without pre-populated data
  if (isOpen && !prePopulatedData && (mealData.name || foodItems.length > 0 || currentStep !== 1)) {
    setMealData({ name: '', meal_type: 'breakfast', notes: '', water_glasses: 0 });
    setFoodItems([]);
    setCurrentStep(1);
    setFoodInputMode('search');
    setSearchQuantity(1);
    setSearchUnit('100g');
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className={`
        ${isMobile 
          ? 'max-w-[95vw] max-h-[90vh] mx-4 my-4 rounded-2xl border-2 border-gray-200 shadow-2xl' 
          : 'max-w-2xl max-h-[85vh] mx-auto my-8 rounded-2xl border border-gray-200 shadow-xl'
        } 
        p-0 flex flex-col bg-white overflow-hidden
      `}>
        {/* Header */}
        <DialogHeader className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 relative`}>
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 text-center">Add New Meal</DialogTitle>
          
          {/* Step Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    step === currentStep 
                      ? 'bg-green-500 text-white shadow-lg scale-105' 
                      : step < currentStep 
                        ? 'bg-green-200 text-green-700' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-center mt-2">
            <div className="flex space-x-6 sm:space-x-8 text-xs text-gray-600">
              <span className={currentStep === 1 ? 'text-green-600 font-medium' : ''}>Details</span>
              <span className={currentStep === 2 ? 'text-green-600 font-medium' : ''}>Add Food</span>
              <span className={currentStep === 3 ? 'text-green-600 font-medium' : ''}>Summary</span>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'} space-y-4 sm:space-y-6`}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6">
                <div className="text-3xl sm:text-4xl mb-3">🍽️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Meal Details</h3>
                <p className="text-sm sm:text-base text-gray-600">Let's start with the basics</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base font-semibold text-gray-700 mb-2 block">
                    Meal Name *
                  </Label>
                  <Input
                    id="name"
                    value={mealData.name}
                    onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                    placeholder="e.g., Pancakes with berries"
                    className="h-12 sm:h-14 text-base rounded-xl border-2 border-gray-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <Label className="text-sm sm:text-base font-semibold text-gray-700 mb-2 block">
                    Meal Type *
                  </Label>
                  <Select value={mealData.meal_type} onValueChange={(value) => setMealData({ ...mealData, meal_type: value })}>
                    <SelectTrigger className="h-12 sm:h-14 text-base rounded-xl border-2 border-gray-200 focus:border-green-500">
                      <SelectValue placeholder="Select meal type" />
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

                <div>
                  <Label htmlFor="notes" className="text-sm sm:text-base font-semibold text-gray-700 mb-2 block">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={mealData.notes}
                    onChange={(e) => setMealData({ ...mealData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:border-green-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Food Items */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6">
                <div className="text-3xl sm:text-4xl mb-3">🔍</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Add Food Items</h3>
                <p className="text-sm sm:text-base text-gray-600">Search or add foods manually</p>
              </div>

              {/* Food Input Mode Tabs */}
              <div className="bg-gray-50 rounded-xl p-1 border border-gray-200">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setFoodInputMode('search')}
                    className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      foodInputMode === 'search' 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Search</span>
                  </button>
                  <button
                    onClick={() => setFoodInputMode('manual')}
                    className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      foodInputMode === 'manual' 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Manual</span>
                  </button>
                </div>
              </div>

              {/* Search Mode */}
              {foodInputMode === 'search' && (
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Quantity</Label>
                      <Input
                        type="number"
                        value={searchQuantity}
                        onChange={(e) => setSearchQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                        onFocus={handleQuantityFocus}
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200 text-center font-semibold"
                        min="1"
                        step="1"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Unit</Label>
                      <Select value={searchUnit} onValueChange={setSearchUnit}>
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
                  </div>
                  <FoodSearchInput 
                    onFoodSelect={handleFoodSearchSelect} 
                    quantity={searchQuantity} 
                    unit={searchUnit} 
                  />
                </div>
              )}

              {/* Manual Mode */}
              {foodInputMode === 'manual' && (
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 space-y-4 sm:space-y-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Add Food Manually</h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Food Name *</Label>
                      <Input
                        value={manualFood.name}
                        onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
                        placeholder="e.g., Apple, Chicken breast"
                        className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Quantity *</Label>
                        <Input
                          type="number"
                          value={manualFood.quantity}
                          onChange={(e) => setManualFood({ ...manualFood, quantity: Math.max(1, parseFloat(e.target.value) || 1) })}
                          onFocus={handleQuantityFocus}
                          className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                          min="1"
                          step="1"
                          placeholder="Enter quantity"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Unit *</Label>
                        <Select value={manualFood.unit} onValueChange={(value) => setManualFood({ ...manualFood, unit: value })}>
                          <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                                                  <SelectContent>
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
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Calories/unit *</Label>
                        <Input
                          type="number"
                          value={manualFood.calories_per_unit}
                          onChange={(e) => setManualFood({ ...manualFood, calories_per_unit: parseInt(e.target.value) || 0 })}
                          className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Protein (g)</Label>
                        <Input
                          type="number"
                          value={manualFood.protein_g}
                          onChange={(e) => setManualFood({ ...manualFood, protein_g: parseFloat(e.target.value) || 0 })}
                          className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Carbs (g)</Label>
                        <Input
                          type="number"
                          value={manualFood.carbs_g}
                          onChange={(e) => setManualFood({ ...manualFood, carbs_g: parseFloat(e.target.value) || 0 })}
                          className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Fat (g)</Label>
                        <Input
                          type="number"
                          value={manualFood.fat_g}
                          onChange={(e) => setManualFood({ ...manualFood, fat_g: parseFloat(e.target.value) || 0 })}
                          className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-gray-200"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={addManualFoodItem}
                      disabled={!manualFood.name || manualFood.calories_per_unit <= 0 || manualFood.quantity <= 0}
                      className="w-full h-10 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Add Food Item
                    </Button>
                  </div>
                </div>
              )}

              {/* Food Items List */}
              {foodItems.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">Added Foods ({foodItems.length})</h4>
                    <div className="text-xs sm:text-sm font-semibold text-green-700 bg-green-100 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                      {Math.round(totalCalories)} cal total
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {foodItems.map((item) => (
                      <EditableFoodCard
                        key={item.id}
                        item={item}
                        onUpdate={updateFoodItem}
                        onRemove={removeFoodItem}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Summary */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6">
                <div className="text-3xl sm:text-4xl mb-3">📊</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Summary</h3>
                <p className="text-sm sm:text-base text-gray-600">Review your meal details</p>
              </div>

              {/* Nutrient Summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border-2 border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900">Nutrition Summary</h4>
                  </div>
                  <NutrientSummary foodItems={foodItems} child={selectedChild} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`${isMobile ? 'p-4' : 'p-6'} bg-gray-50 border-t border-gray-200 space-y-3`}>
          {currentStep < 3 ? (
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="flex-1 h-12 sm:h-14 text-sm sm:text-base rounded-xl border-2 border-gray-300 font-semibold"
                >
                  Back
                </Button>
              )}
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className={`${currentStep === 1 ? 'w-full' : 'flex-1'} h-12 sm:h-14 text-sm sm:text-base bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all duration-200 ${!canProceed() ? 'opacity-50' : 'hover:scale-[1.02]'}`}
              >
                Next Step
              </Button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base rounded-xl border-2 border-gray-300 font-semibold"
              >
                Back
              </Button>
              <Button 
                onClick={handleFinish} 
                disabled={isSaving || !canProceed()}
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] relative overflow-hidden"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    ✅ Save Meal
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealForm;

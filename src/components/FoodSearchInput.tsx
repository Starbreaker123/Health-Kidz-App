
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchFoods, calculateNutritionForQuantity, getUnitLabel, getGramsForUnit, type FoodSearchResult } from '@/services/foodDatabase';

interface FoodSearchInputProps {
  onFoodSelect: (food: {
    name: string;
    calories_per_unit: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }) => void;
  quantity: number;
  unit: string;
}

const FoodSearchInput: React.FC<FoodSearchInputProps> = ({ onFoodSelect, quantity, unit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDebounced = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchFoods(query);
          setResults(searchResults);
          setShowResults(true);
        } catch (error) {
          console.error('Food search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounced);
  }, [query]);

  const handleFoodSelect = (food: FoodSearchResult) => {
    const nutrition = calculateNutritionForQuantity(food, quantity, unit);
    
    onFoodSelect({
      name: food.name,
      calories_per_unit: Math.round(nutrition.calories / quantity),
      protein_g: nutrition.protein / quantity,
      carbs_g: nutrition.carbs / quantity,
      fat_g: nutrition.fat / quantity
    });

    setQuery(food.name);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food (e.g., banana, chicken breast)..."
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((food) => {
              const nutrition100g = calculateNutritionForQuantity(food, 1, '100g');
              const nutritionSelected = calculateNutritionForQuantity(food, quantity, unit);
              const gramsForUnit = getGramsForUnit(unit);
              const totalGrams = quantity * gramsForUnit;
              
              return (
                <Button
                  key={food.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleFoodSelect(food)}
                >
                  <div className="flex flex-col items-start space-y-2 w-full">
                    <span className="font-medium text-sm text-gray-900">{food.name}</span>
                    
                    {/* Nutrition per 100g */}
                    <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      <span className="font-medium">100g:</span> {nutrition100g.calories} cal • P: {nutrition100g.protein}g • C: {nutrition100g.carbs}g • F: {nutrition100g.fat}g
                    </div>
                    
                    {/* Selected quantity nutrition */}
                    <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                      <span className="font-medium">{quantity} {getUnitLabel(unit)} ({totalGrams}g):</span> {nutritionSelected.calories} cal • P: {nutritionSelected.protein}g • C: {nutritionSelected.carbs}g • F: {nutritionSelected.fat}g
                    </div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-3 text-center text-gray-500 text-sm">
            No foods found. Try a different search term.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodSearchInput;

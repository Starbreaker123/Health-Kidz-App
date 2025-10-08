
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FoodItem as FoodItemType } from '@/types';
import { logger } from '@/lib/logger';

interface MealData {
  name: string;
  meal_type: string;
  notes: string;
  water_glasses: number;
}

type FoodItem = FoodItemType;

export const useMealForm = (
  childId: string,
  date: string,
  prePopulatedData?: { name?: string; meal_type?: string; notes?: string; water_glasses?: number; foodItems?: Omit<FoodItem, 'id'>[] },
  onSave?: () => void
) => {
  const [mealData, setMealData] = useState<MealData>({
    name: '',
    meal_type: 'breakfast',
    notes: '',
    water_glasses: 0
  });
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (prePopulatedData) {
      setMealData({
        name: prePopulatedData.name || '',
        meal_type: prePopulatedData.meal_type || 'breakfast',
        notes: prePopulatedData.notes || '',
        water_glasses: prePopulatedData.water_glasses || 0
      });
      
      if (prePopulatedData.foodItems) {
        setFoodItems(prePopulatedData.foodItems.map((item, index: number) => ({
          ...item,
          id: `prepop-${index}`
        })) as FoodItem[]);
      }
    } else {
      // If prePopulatedData was cleared, reset the form to defaults
      setMealData({
        name: '',
        meal_type: 'breakfast',
        notes: '',
        water_glasses: 0
      });
      setFoodItems([]);
    }
  }, [prePopulatedData]);

  const handleSave = async () => {
    if (!mealData.name || foodItems.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a meal name and add at least one food item.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const totalCalories = foodItems.reduce(
        (total, item) => total + (item.calories_per_unit * item.quantity),
        0
      );

      const { data: meal, error: mealError } = await supabase
        .from('meals')
        .insert({
          child_id: childId,
          name: mealData.name,
          meal_type: mealData.meal_type,
          date: date,
          total_calories: Math.round(totalCalories),
          notes: mealData.notes || null,
          water_glasses: mealData.water_glasses || 0
        })
        .select()
        .single();

      if (mealError) throw mealError;

      const foodItemsData = foodItems.map(item => ({
        meal_id: meal.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        calories_per_unit: item.calories_per_unit,
        protein_g: item.protein_g || 0,
        carbs_g: item.carbs_g || 0,
        fat_g: item.fat_g || 0
      }));

      const { error: foodError } = await supabase
        .from('food_items')
        .insert(foodItemsData);

      if (foodError) throw foodError;

      toast({
        title: "Success",
        description: "Meal added successfully!",
      });

      onSave?.();
    } catch (error) {
      logger.error('Error saving meal:', error);
      toast({
        title: "Error",
        description: "Failed to save meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    mealData,
    setMealData,
    foodItems,
    setFoodItems,
    isSaving,
    handleSave
  };
};

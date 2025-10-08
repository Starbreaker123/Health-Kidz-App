
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  daily_calorie_goal?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
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

export const useMealsData = (selectedChildId: string, selectedDate: string) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foodItems, setFoodItems] = useState<{ [mealId: string]: FoodItem[] }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, birth_date, daily_calorie_goal, gender, weight_kg, height_cm, activity_level')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChildren(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to load children profiles",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async () => {
    if (!selectedChildId) return;

    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('child_id', selectedChildId)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast({
        title: "Error",
        description: "Failed to load meals",
        variant: "destructive",
      });
    }
  };

  const fetchFoodItems = async () => {
    if (meals.length === 0) return;

    try {
      const mealIds = meals.map(meal => meal.id);
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .in('meal_id', mealIds);

      if (error) throw error;

      const groupedItems: { [mealId: string]: FoodItem[] } = {};
      (data || []).forEach(item => {
        if (!groupedItems[item.meal_id]) {
          groupedItems[item.meal_id] = [];
        }
        groupedItems[item.meal_id].push(item);
      });

      setFoodItems(groupedItems);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        title: "Error",
        description: "Failed to load food items",
        variant: "destructive",
      });
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });

      fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    await fetchMeals();
  };

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChildId) {
      fetchMeals();
    }
  }, [selectedChildId, selectedDate]);

  useEffect(() => {
    if (meals.length > 0) {
      fetchFoodItems();
    }
  }, [meals]);

  return {
    children,
    meals,
    foodItems,
    loading,
    deleteMeal,
    refreshData,
  };
};

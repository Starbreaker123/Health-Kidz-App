import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import SmartMealSuggestions from '@/components/SmartMealSuggestions';
import ChildDateSelector from '@/components/ChildDateSelector';
import DailySummary from '@/components/DailySummary';
import MealsList from '@/components/MealsList';
import { useMealsData } from '@/hooks/useMealsData';
import { useMealSuggestions } from '@/hooks/useMealSuggestions';
// Import MealSuggestion type from spoonacularApi since it's the primary service
import type { MealSuggestion } from '@/services/spoonacularApi';

import MealsHeader from "@/components/meals/MealsHeader";
import MealsLoadingState from "@/components/meals/MealsLoadingState";
import MealsEmptyState from "@/components/meals/MealsEmptyState";
import MealsActions from "@/components/meals/MealsActions";

interface Meal {
  id: string;
  child_id: string;
  name: string;
  meal_type: string;
  date: string;
  total_calories: number;
  notes?: string;
}

const Meals = () => {
  const [activeTab, setActiveTab] = useState('meals');
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [prePopulatedMeal, setPrePopulatedMeal] = useState<any>(null);

  const { children, meals, foodItems, loading, deleteMeal, refreshData } = useMealsData(selectedChildId, selectedDate);
  
  // Set first child as selected when children are loaded
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const selectedChild = children.find(child => child.id === selectedChildId);
  const { mealSuggestions, loading: suggestionsLoading, refreshSuggestions, getMoreSuggestions, deleteSuggestion } = useMealSuggestions(selectedChild, meals, foodItems);

  const handleMealSelect = (suggestion: MealSuggestion) => {
    // Calculate estimated calories per ingredient based on suggestion totals
    const ingredientCount = suggestion.ingredients.length;
    const caloriesPerIngredient = ingredientCount > 0 ? Math.round(suggestion.calories / ingredientCount) : 0;
    const proteinPerIngredient = ingredientCount > 0 ? Math.round((suggestion.protein / ingredientCount) * 10) / 10 : 0;
    const carbsPerIngredient = ingredientCount > 0 ? Math.round((suggestion.carbs / ingredientCount) * 10) / 10 : 0;
    const fatPerIngredient = ingredientCount > 0 ? Math.round((suggestion.fat / ingredientCount) * 10) / 10 : 0;

    const prePopulated = {
      name: suggestion.name,
      meal_type: suggestion.mealType,
      notes: suggestion.description,
      foodItems: suggestion.ingredients.map(ingredient => ({
        name: ingredient,
        quantity: 1,
        unit: '100g',
        calories_per_unit: caloriesPerIngredient,
        protein_g: proteinPerIngredient,
        carbs_g: carbsPerIngredient,
        fat_g: fatPerIngredient
      }))
    };
    
    setPrePopulatedMeal(prePopulated);
    setShowAddForm(true);
  };

  const handleAddMeal = async () => {
    setShowAddForm(false);
    setPrePopulatedMeal(null);
    await refreshData();
    refreshSuggestions();
  };

  const handleEditMeal = async () => {
    setEditingMeal(null);
    await refreshData();
    refreshSuggestions();
  };

  const dailyGoal = selectedChild?.daily_calorie_goal || 0;
  const totalCalories = useMemo(() => {
    return meals.reduce((total, meal) => total + (meal.total_calories || 0), 0);
  }, [meals]);
  const aggregatedMacros = useMemo(() => {
    let proteinTotal = 0;
    let carbsTotal = 0;
    let fatTotal = 0;
    for (const items of Object.values(foodItems)) {
      for (const item of items) {
        proteinTotal += item.protein_g || 0;
        carbsTotal += item.carbs_g || 0;
        fatTotal += item.fat_g || 0;
      }
    }
    return { protein_g: proteinTotal, carbs_g: carbsTotal, fat_g: fatTotal };
  }, [foodItems]);
  const goalProgress = dailyGoal > 0 ? (totalCalories / dailyGoal) * 100 : 0;

  if (loading) {
    return <MealsLoadingState activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  if (children.length === 0) {
    return <MealsEmptyState activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <MealsHeader
          onAddMeal={() => {
            setPrePopulatedMeal(null);
            setShowAddForm(true);
          }}
        />

        <ChildDateSelector
          children={children}
          selectedChildId={selectedChildId}
          selectedDate={selectedDate}
          onChildChange={setSelectedChildId}
          onDateChange={setSelectedDate}
        />

        {selectedChildId && (
          <DailySummary
            child={selectedChild}
            dailyIntake={{
              calories: totalCalories,
              protein_g: aggregatedMacros.protein_g,
              carbs_g: aggregatedMacros.carbs_g,
              fat_g: aggregatedMacros.fat_g,
              vegetables_servings: 0,
              water_glasses: 0
            }}
          />
        )}

        {selectedChildId && (
          <SmartMealSuggestions
            mealSuggestions={mealSuggestions}
            selectedChild={selectedChild}
            loading={suggestionsLoading}
            onMealSelect={handleMealSelect}
            onDeleteSuggestion={deleteSuggestion}
            onGetMoreSuggestions={getMoreSuggestions}
          />
        )}

        {selectedChildId && (
          <MealsList
            meals={meals}
            foodItems={foodItems}
            onEditMeal={setEditingMeal}
            onDeleteMeal={deleteMeal}
            onAddFirstMeal={() => {
              setPrePopulatedMeal(null);
              setShowAddForm(true);
            }}
          />
        )}

        <MealsActions
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          prePopulatedMeal={prePopulatedMeal}
          setPrePopulatedMeal={setPrePopulatedMeal}
          selectedChildId={selectedChildId}
          selectedDate={selectedDate}
          selectedChild={selectedChild}
          onAddMeal={handleAddMeal}
          editingMeal={editingMeal}
          setEditingMeal={setEditingMeal}
          onEditMeal={handleEditMeal}
        />
      </div>
    </Layout>
  );
};

export default Meals;

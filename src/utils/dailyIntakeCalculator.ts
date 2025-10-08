// Utility to robustly calculate daily intake from meals and their food items
export function calculateDailyIntakeFromMeals(meals: any[]): {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  vegetables_servings: number;
} {
  const intake = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    vegetables_servings: 0
  };

  meals?.forEach(meal => {
    intake.calories += meal.total_calories || 0;
    meal.food_items?.forEach((item: any) => {
      const quantity = item.quantity || 1;
      intake.protein_g += (item.protein_g || 0) * quantity;
      intake.carbs_g += (item.carbs_g || 0) * quantity;
      intake.fat_g += (item.fat_g || 0) * quantity;
      // Estimate vegetables from food names
      if (item.name?.toLowerCase().includes('vegetable') || 
          item.name?.toLowerCase().includes('broccoli') || 
          item.name?.toLowerCase().includes('carrot') || 
          item.name?.toLowerCase().includes('spinach') || 
          item.name?.toLowerCase().includes('lettuce')) {
        intake.vegetables_servings += quantity * 0.5; // Estimate
      }
    });
  });

  return intake;
} 
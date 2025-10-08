export type UUID = string;

export interface Child {
  id: UUID;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  daily_calorie_goal?: number;
  parent_id?: UUID;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface Meal {
  id: UUID;
  child_id: UUID;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD
  notes?: string;
  total_calories?: number;
}

export interface DailyIntakeSummary {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface NutritionHistoryDay {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface NutritionHistory {
  days: NutritionHistoryDay[];
}



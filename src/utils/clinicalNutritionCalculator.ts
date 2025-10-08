
interface ChildData {
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

export interface ClinicalNutritionRecommendations {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  // Micronutrients for compatibility
  vitamin_c_mg: number;
  vitamin_d_iu: number;
  calcium_mg: number;
  iron_mg: number;
}

interface PhysicalActivityCoefficients {
  sedentary: number;
  lightly_active: number;
  moderately_active: number;
  very_active: number;
  extra_active: number;
}

// IOM Physical Activity coefficients by age and gender
const PA_COEFFICIENTS: Record<string, PhysicalActivityCoefficients> = {
  'male_3_18': {
    sedentary: 1.00,
    lightly_active: 1.13,
    moderately_active: 1.26,
    very_active: 1.42,
    extra_active: 1.42
  },
  'female_3_18': {
    sedentary: 1.00,
    lightly_active: 1.16,
    moderately_active: 1.31,
    very_active: 1.56,
    extra_active: 1.56
  }
};

// Protein RDA by age (grams per day)
const PROTEIN_RDA: Record<string, number> = {
  '1_3': 13,
  '4_8': 19,
  '9_13': 34,
  '14_18_male': 52,
  '14_18_female': 46
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(1, age); // Minimum age 1 for calculations
};

const getAverageWeight = (age: number, gender: string): number => {
  // CDC growth chart averages (50th percentile)
  const maleWeights = [10.2, 12.1, 13.5, 15.0, 16.3, 17.7, 19.5, 22.0, 25.0, 28.1, 31.9, 36.0, 40.8, 47.8, 56.0, 62.1, 68.0, 73.0];
  const femaleWeights = [9.7, 11.3, 12.9, 14.2, 15.4, 16.8, 18.3, 20.8, 23.3, 26.5, 30.5, 36.9, 42.0, 47.6, 52.1, 56.7, 58.0, 59.0];
  
  const weights = gender === 'male' ? maleWeights : femaleWeights;
  const index = Math.min(age - 1, weights.length - 1);
  return weights[index] || weights[weights.length - 1];
};

const getAverageHeight = (age: number, gender: string): number => {
  // CDC growth chart averages (50th percentile) in cm
  const maleHeights = [75.7, 87.1, 96.1, 102.9, 109.2, 115.5, 121.9, 128.0, 133.3, 138.4, 143.5, 149.1, 156.2, 163.8, 170.1, 175.2, 177.0, 177.8];
  const femaleHeights = [74.2, 86.4, 95.0, 101.6, 107.9, 114.1, 120.0, 125.8, 131.2, 136.9, 142.5, 148.7, 154.1, 159.8, 163.2, 163.8, 164.0, 164.2];
  
  const heights = gender === 'male' ? maleHeights : femaleHeights;
  const index = Math.min(age - 1, heights.length - 1);
  return heights[index] || heights[heights.length - 1];
};

const getPhysicalActivityCoefficient = (age: number, gender: string, activityLevel: string): number => {
  let key: string;
  
  if (age >= 3 && age <= 18) {
    key = `${gender}_3_18`;
  } else {
    // Fallback for ages outside range
    key = `${gender}_3_18`;
  }
  
  const coefficients = PA_COEFFICIENTS[key];
  if (!coefficients) {
    return 1.26; // Default moderate activity
  }
  
  // Map activity levels to PA coefficients
  switch (activityLevel) {
    case 'sedentary': return coefficients.sedentary;
    case 'lightly_active': return coefficients.lightly_active;
    case 'moderately_active': return coefficients.moderately_active;
    case 'very_active': return coefficients.very_active;
    case 'extra_active': return coefficients.extra_active;
    default: return coefficients.moderately_active;
  }
};

const calculateEER = (age: number, gender: string, weight: number, height: number, activityLevel: string): number => {
  // Convert height from cm to meters for IOM formula
  const heightM = height / 100;
  
  // Get Physical Activity coefficient
  const PA = getPhysicalActivityCoefficient(age, gender, activityLevel);
  
  let eer: number;
  
  if (age >= 1 && age <= 3) {
    // Toddler formula (13-35 months): EER = (89 × weight [kg] - 100) + 20
    eer = (89 * weight - 100) + 20;
  } else if (age >= 4 && age <= 8) {
    // IOM EER equations for 4-8 years
    if (gender === 'male') {
      // Boys 4–8 years: EER = 88.5 - (61.9 × age) + PA × (26.7 × weight + 903 × height) + 20
      eer = 88.5 - (61.9 * age) + PA * (26.7 * weight + 903 * heightM) + 20;
    } else {
      // Girls 4–8 years: EER = 135.3 - (30.8 × age) + PA × (10.0 × weight + 934 × height) + 20
      eer = 135.3 - (30.8 * age) + PA * (10.0 * weight + 934 * heightM) + 20;
    }
  } else if (age >= 9 && age <= 18) {
    // IOM EER equations for 9-18 years
    if (gender === 'male') {
      // Boys 9–18 years: EER = 88.5 - (61.9 × age) + PA × (26.7 × weight + 903 × height) + 25
      eer = 88.5 - (61.9 * age) + PA * (26.7 * weight + 903 * heightM) + 25;
    } else {
      // Girls 9–18 years: EER = 135.3 - (30.8 × age) + PA × (10.0 × weight + 934 × height) + 25
      eer = 135.3 - (30.8 * age) + PA * (10.0 * weight + 934 * heightM) + 25;
    }
  } else {
    // Fallback for ages outside typical range
    const bmr = gender === 'male' ? 
      (10 * weight) + (6.25 * height) - (5 * age) + 5 :
      (10 * weight) + (6.25 * height) - (5 * age) - 161;
    eer = bmr * PA;
  }
  
  return Math.round(Math.max(eer, 800)); // Minimum 800 calories
};

const getProteinRDA = (age: number, gender: string): number => {
  if (age >= 1 && age <= 3) return PROTEIN_RDA['1_3'];
  if (age >= 4 && age <= 8) return PROTEIN_RDA['4_8'];
  if (age >= 9 && age <= 13) return PROTEIN_RDA['9_13'];
  if (age >= 14 && age <= 18) {
    return gender === 'male' ? PROTEIN_RDA['14_18_male'] : PROTEIN_RDA['14_18_female'];
  }
  return PROTEIN_RDA['9_13']; // Fallback
};

const calculateMacronutrients = (calories: number, age: number, gender: string, weight: number): {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
} => {
  // New percentage-based approach from research document
  // Using standard macronutrient distribution ranges (AMDR)
  
  // Protein: 10-30% of calories, using 15% as middle value
  const proteinPercentage = 0.15;
  const protein_g = Math.round((proteinPercentage * calories) / 4);
  
  // Fat: 25-35% of calories, using 30% as middle value
  const fatPercentage = 0.30;
  const fat_g = Math.round((fatPercentage * calories) / 9);
  
  // Carbohydrates: remainder of calories (45-65% AMDR)
  const remainingCalories = calories - (protein_g * 4) - (fat_g * 9);
  let carbs_g = Math.round(remainingCalories / 4);
  
  // Ensure minimum 130g carbohydrates as per research
  carbs_g = Math.max(carbs_g, 130);
  
  return { protein_g, carbs_g, fat_g };
};

const getMicronutrients = (age: number, gender: string): {
  vitamin_c_mg: number;
  vitamin_d_iu: number;
  calcium_mg: number;
  iron_mg: number;
  fiber_g: number;
} => {
  // Vitamin C requirements
  let vitamin_c_mg: number;
  if (age >= 1 && age <= 3) vitamin_c_mg = 15;
  else if (age >= 4 && age <= 8) vitamin_c_mg = 25;
  else if (age >= 9 && age <= 13) vitamin_c_mg = 45;
  else vitamin_c_mg = 65;
  
  // Vitamin D - 600 IU for children 1+ years
  const vitamin_d_iu = age < 1 ? 400 : 600;
  
  // Calcium requirements
  let calcium_mg: number;
  if (age >= 1 && age <= 3) calcium_mg = 700;
  else if (age >= 4 && age <= 8) calcium_mg = 1000;
  else calcium_mg = 1300;
  
  // Iron requirements
  let iron_mg: number;
  if (age >= 1 && age <= 3) iron_mg = 7;
  else if (age >= 4 && age <= 8) iron_mg = 10;
  else if (age >= 9 && age <= 13) iron_mg = 8;
  else iron_mg = gender === 'female' ? 15 : 11;
  
  // Fiber (Age + 5g rule)
  const fiber_g = Math.round(age + 5);
  
  return { vitamin_c_mg, vitamin_d_iu, calcium_mg, iron_mg, fiber_g };
};

export const calculateClinicalNutritionRecommendations = (child: ChildData): ClinicalNutritionRecommendations => {
  const age = calculateAge(child.birth_date);
  const gender = child.gender || 'male';
  const weight = child.weight_kg || getAverageWeight(age, gender);
  const height = child.height_cm || getAverageHeight(age, gender);
  const activityLevel = child.activity_level || 'moderately_active';
  
  // Calculate EER using clinical formulas
  const calories = calculateEER(age, gender, weight, height, activityLevel);
  
  // Calculate macronutrients using clinical guidelines
  const { protein_g, carbs_g, fat_g } = calculateMacronutrients(calories, age, gender, weight);
  
  // Get micronutrients
  const { vitamin_c_mg, vitamin_d_iu, calcium_mg, iron_mg, fiber_g } = getMicronutrients(age, gender);
  
  return {
    calories,
    protein_g,
    carbs_g,
    fat_g,
    fiber_g,
    vitamin_c_mg,
    vitamin_d_iu,
    calcium_mg,
    iron_mg
  };
};

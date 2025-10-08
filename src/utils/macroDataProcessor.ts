
interface DailyIntakeData {
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  water_glasses?: number;
  [key: string]: number | undefined;
}

export const processMacroData = (dailyIntake: DailyIntakeData) => {
  const totalCalories = dailyIntake.calories || 0;
  const protein = dailyIntake.protein_g || 0;
  const carbs = dailyIntake.carbs_g || 0;
  const fat = dailyIntake.fat_g || 0;

  return [
    {
      name: 'Protein',
      value: protein,
      color: '#10B981',
      percentage: totalCalories > 0 ? Math.round((protein * 4 / totalCalories) * 100) : 0
    },
    {
      name: 'Carbs',
      value: carbs,
      color: '#3B82F6',
      percentage: totalCalories > 0 ? Math.round((carbs * 4 / totalCalories) * 100) : 0
    },
    {
      name: 'Fat',
      value: fat,
      color: '#F59E0B',
      percentage: totalCalories > 0 ? Math.round((fat * 9 / totalCalories) * 100) : 0
    }
  ];
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Coffee, Sun, Sunset, Moon } from 'lucide-react';

interface MealSelectorProps {
  onMealSelect: (mealType: string) => void;
}

const MealSelector: React.FC<MealSelectorProps> = ({ onMealSelect }) => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const mealTypes = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      icon: Coffee,
      color: 'from-orange-400 to-yellow-500',
      time: '7:00 - 10:00 AM',
      emoji: '🌅'
    },
    {
      id: 'lunch',
      name: 'Lunch',
      icon: Sun,
      color: 'from-green-400 to-emerald-500',
      time: '12:00 - 2:00 PM',
      emoji: '☀️'
    },
    {
      id: 'dinner',
      name: 'Dinner',
      icon: Sunset,
      color: 'from-purple-400 to-pink-500',
      time: '6:00 - 8:00 PM',
      emoji: '🌆'
    },
    {
      id: 'snack',
      name: 'Snack',
      icon: Moon,
      color: 'from-blue-400 to-indigo-500',
      time: 'Anytime',
      emoji: '🍎'
    }
  ];

  const handleMealClick = (mealId: string) => {
    setSelectedMeal(mealId);
    setTimeout(() => {
      onMealSelect(mealId);
      setSelectedMeal(null);
    }, 200);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">What meal would you like to log?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mealTypes.map((meal) => {
          const Icon = meal.icon;
          const isSelected = selectedMeal === meal.id;
          
          return (
            <Card 
              key={meal.id}
              className={`nutri-card nutri-floating cursor-pointer group transition-all duration-200 ${
                isSelected ? 'scale-95 shadow-xl' : 'hover:shadow-lg'
              }`}
              onClick={() => handleMealClick(meal.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${meal.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                    <span className="text-2xl">{meal.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{meal.name}</h4>
                    <p className="text-sm text-gray-500">{meal.time}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MealSelector;

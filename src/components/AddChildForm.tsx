import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateClinicalNutritionRecommendations, calculateAge } from '@/utils/clinicalNutritionCalculator';

interface Child {
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  daily_calorie_goal?: number;
}

interface AddChildFormProps {
  onSave: (child: Child) => void;
  onCancel: () => void;
}

const AddChildForm = ({ onSave, onCancel }: AddChildFormProps) => {
  const [formData, setFormData] = useState<Child>({
    name: '',
    birth_date: '',
    gender: '',
    weight_kg: undefined,
    height_cm: undefined,
    activity_level: 'moderately_active',
    daily_calorie_goal: undefined,
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  const getRecommendations = () => {
    if (!formData.birth_date) return null;
    return calculateClinicalNutritionRecommendations(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.birth_date) {
      return;
    }

    // Auto-calculate recommended calories if not manually set
    const finalData = { ...formData };
    if (!formData.daily_calorie_goal && formData.birth_date) {
      const recommendations = getRecommendations();
      if (recommendations) {
        finalData.daily_calorie_goal = recommendations.calories;
      }
    }

    // Clean up the data before sending
    const cleanData = {
      ...finalData,
      name: finalData.name.trim(),
      gender: finalData.gender || undefined,
      weight_kg: finalData.weight_kg || undefined,
      height_cm: finalData.height_cm || undefined,
      daily_calorie_goal: finalData.daily_calorie_goal || undefined,
    };

    onSave(cleanData);
  };

  const handleChange = (field: keyof Child, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const recommendations = getRecommendations();
  const childAge = formData.birth_date ? calculateAge(formData.birth_date) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Add New Child</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Child's name"
                required
              />
            </div>

            <div>
              <Label htmlFor="birth_date">Birth Date *</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleChange('birth_date', e.target.value)}
                required
              />
              {childAge !== null && (
                <p className="text-xs text-gray-500 mt-1">Age: {childAge} years old</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight_kg || ''}
                  onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || undefined)}
                  placeholder="25.5"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height_cm || ''}
                  onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || undefined)}
                  placeholder="120.0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="activity_level">Activity Level</Label>
              <select
                id="activity_level"
                value={formData.activity_level}
                onChange={(e) => handleChange('activity_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extra_active">Extra Active (very hard exercise, sports)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="daily_goal">Daily Calorie Goal</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="p-1"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <Input
                id="daily_goal"
                type="number"
                value={formData.daily_calorie_goal || ''}
                onChange={(e) => handleChange('daily_calorie_goal', parseInt(e.target.value) || undefined)}
                placeholder={recommendations ? `Recommended: ${recommendations.calories}` : "e.g., 1200"}
              />
              {recommendations && (
                <p className="text-xs text-green-600 mt-1">
                  Recommended: {recommendations.calories} calories/day
                </p>
              )}
            </div>

            {showRecommendations && recommendations && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">AI Nutritional Recommendations</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Calories:</span> {recommendations.calories}/day
                    </div>
                    <div>
                      <span className="font-medium">Protein:</span> {recommendations.protein_g}g/day
                    </div>
                    <div>
                      <span className="font-medium">Carbs:</span> {recommendations.carbs_g}g/day
                    </div>
                    <div>
                      <span className="font-medium">Fat:</span> {recommendations.fat_g}g/day
                    </div>
                    <div>
                      <span className="font-medium">Fiber:</span> {recommendations.fiber_g}g/day
                    </div>
                    <div>
                      <span className="font-medium">Calcium:</span> {recommendations.calcium_mg}mg/day
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Based on age, gender, weight, height, and activity level using scientific guidelines.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Add Child
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddChildForm;

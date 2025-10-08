
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MealsPageHeaderProps {
  selectedChildId: string;
  onAddMeal: () => void;
}

const MealsPageHeader = ({ selectedChildId, onAddMeal }: MealsPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meal Logging</h1>
        <p className="text-gray-600">Track daily nutrition for your children</p>
      </div>
      <Button
        onClick={onAddMeal}
        disabled={!selectedChildId}
        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Meal
      </Button>
    </div>
  );
};

export default MealsPageHeader;

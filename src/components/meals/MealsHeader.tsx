import { Utensils, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MealsHeaderProps {
  onAddMeal: () => void;
}
const MealsHeader = ({ onAddMeal }: MealsHeaderProps) => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
    <div className="relative bg-gradient-to-br from-green-400/90 via-blue-400/90 to-teal-500/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8 animate-fade-in-up">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="bg-white/20 backdrop-blur-md p-2 sm:p-4 rounded-2xl shadow-lg animate-scale-in">
            <Utensils className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
              Meal Logging
            </h1>
            <p className="text-white/90 text-base sm:text-lg drop-shadow">
              Track daily nutrition and meals for your children
            </p>
          </div>
        </div>
        <Button
          onClick={onAddMeal}
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-lg transition-all duration-200 hover:scale-105 min-h-[44px] min-w-[44px] text-base px-4"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Meal
        </Button>
      </div>
      {/* Compact spacer for very small screens */}
      <div className="h-2 sm:h-3" />
    </div>
  </div>
);

export default MealsHeader;

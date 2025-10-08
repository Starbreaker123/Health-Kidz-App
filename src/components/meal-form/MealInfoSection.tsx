
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface MealInfoSectionProps {
  formData: {
    name: string;
    meal_type: string;
    notes: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const MealInfoSection = ({ formData, onInputChange }: MealInfoSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Meal Name */}
        <div className="mobile-form-field">
          <Label htmlFor="name" className="text-base font-medium text-gray-700 flex items-center gap-1">
            Meal Name
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="e.g., Pancakes with berries"
            className="mobile-form-input rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
            autoComplete="off"
          />
        </div>

        {/* Meal Type */}
        <div className="mobile-form-field">
          <Label className="text-base font-medium text-gray-700 flex items-center gap-1">
            Meal Type
            <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.meal_type} onValueChange={(value) => onInputChange('meal_type', value)}>
            <SelectTrigger className="mobile-form-input rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 touch-target">
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white border shadow-lg z-50">
              <SelectItem value="breakfast" className="py-4 touch-target">
                <div className="flex items-center gap-2">
                  <span>🌅</span>
                  <span className="text-base">Breakfast</span>
                </div>
              </SelectItem>
              <SelectItem value="lunch" className="py-4 touch-target">
                <div className="flex items-center gap-2">
                  <span>☀️</span>
                  <span className="text-base">Lunch</span>
                </div>
              </SelectItem>
              <SelectItem value="dinner" className="py-4 touch-target">
                <div className="flex items-center gap-2">
                  <span>🌙</span>
                  <span className="text-base">Dinner</span>
                </div>
              </SelectItem>
              <SelectItem value="snack" className="py-4 touch-target">
                <div className="flex items-center gap-2">
                  <span>🍎</span>
                  <span className="text-base">Snack</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="mobile-form-field">
        <Label htmlFor="notes" className="text-base font-medium text-gray-700">
          Notes (optional)
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder="Any additional notes about this meal..."
          rows={isMobile ? 4 : 3}
          className="resize-none rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 text-base min-h-[44px]"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default MealInfoSection;

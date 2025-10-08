
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface MealBasicInfoProps {
  formData: {
    name: string;
    meal_type: string;
    notes: string;
  };
  onInputChange: (field: string, value: string) => void;
  prePopulated?: boolean;
}

const MealBasicInfo = ({ formData, onInputChange, prePopulated }: MealBasicInfoProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {prePopulated && (
        <div className="p-4 bg-blue-50 rounded-lg text-base text-blue-700 border border-blue-200">
          <strong>💡 Tip:</strong> This meal has been pre-filled based on nutritional recommendations.
        </div>
      )}
      
      <div className="space-y-4">
        <div className="mobile-form-field">
          <Label htmlFor="name" className="text-base font-medium text-gray-700">
            Meal Name *
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
        
        <div className="mobile-form-field">
          <Label htmlFor="meal_type" className="text-base font-medium text-gray-700">
            Meal Type *
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
    </>
  );
};

export default MealBasicInfo;

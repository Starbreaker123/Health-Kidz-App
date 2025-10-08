
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Edit2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

interface CompactFoodItemProps {
  item: FoodItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

const CompactFoodItem: React.FC<CompactFoodItemProps> = ({
  item,
  onUpdate,
  onRemove
}) => {
  const isMobile = useIsMobile();
  const totalCalories = Math.round(item.quantity * item.calories_per_unit);

  return (
    <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg border ${isMobile ? 'flex-col space-y-2' : 'flex-row'}`}>
      {/* Food Name */}
      <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-0`}>
        <Input
          value={item.name}
          onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
          placeholder="Food name"
          className={`${isMobile ? 'h-10 text-sm' : 'h-9 text-sm'} border-gray-300 bg-white`}
        />
      </div>

      {/* Quantity and Unit */}
      <div className={`flex gap-2 ${isMobile ? 'w-full' : 'w-auto'}`}>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
          placeholder="Qty"
          className={`${isMobile ? 'h-10 w-20 text-sm' : 'h-9 w-16 text-sm'} border-gray-300 bg-white`}
          min="0"
          step="0.1"
        />
        <Input
          value={item.unit}
          onChange={(e) => onUpdate(item.id, 'unit', e.target.value)}
          placeholder="Unit"
          className={`${isMobile ? 'h-10 w-20 text-sm' : 'h-9 w-16 text-sm'} border-gray-300 bg-white`}
        />
      </div>

      {/* Calories */}
      <div className={`${isMobile ? 'w-full flex justify-between items-center' : 'flex items-center gap-2'}`}>
        <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600 font-medium`}>
          {totalCalories} cal
        </div>
        
        {/* Actions */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className={`${isMobile ? 'h-8 w-8' : 'h-7 w-7'} p-0 text-red-500 hover:text-red-700 hover:bg-red-50`}
          >
            <X className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompactFoodItem;

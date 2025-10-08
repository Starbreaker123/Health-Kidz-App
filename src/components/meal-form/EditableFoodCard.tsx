
import React, { useState } from 'react';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NutrientChip from './NutrientChip';

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

interface EditableFoodCardProps {
  item: FoodItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

const EditableFoodCard: React.FC<EditableFoodCardProps> = ({ item, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    quantity: item.quantity,
    unit: item.unit
  });

  const totalCalories = Math.round(item.quantity * item.calories_per_unit);
  const totalProtein = Math.round((item.protein_g || 0) * item.quantity * 10) / 10;
  const totalCarbs = Math.round((item.carbs_g || 0) * item.quantity * 10) / 10;
  const totalFat = Math.round((item.fat_g || 0) * item.quantity * 10) / 10;

  const handleSave = () => {
    onUpdate(item.id, 'quantity', editValues.quantity);
    onUpdate(item.id, 'unit', editValues.unit);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      quantity: item.quantity,
      unit: item.unit
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base truncate">{item.name}</h4>
        </div>
        <div className="flex items-center gap-2 ml-3">
          {!isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 text-gray-500 hover:text-green-600"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quantity & Unit */}
      {isEditing ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Input
              type="number"
              value={editValues.quantity}
              onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              className="h-10 text-sm"
              min="0"
              step="0.1"
              placeholder="Qty"
            />
          </div>
          <div>
            <Select value={editValues.unit} onValueChange={(value) => setEditValues(prev => ({ ...prev, unit: value }))}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100g">100g (standard)</SelectItem>
                <SelectItem value="cup">cup</SelectItem>
                <SelectItem value="piece">piece</SelectItem>
                <SelectItem value="gram">gram</SelectItem>
                <SelectItem value="ounce">ounce</SelectItem>
                <SelectItem value="tablespoon">tablespoon</SelectItem>
                <SelectItem value="teaspoon">teaspoon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">{item.quantity}</span> {item.unit}
        </div>
      )}

      {/* Nutrients */}
      <div className="flex flex-wrap gap-2">
        <NutrientChip type="calories" value={`${totalCalories}`} />
        {totalProtein > 0 && <NutrientChip type="protein" value={`${totalProtein}g`} />}
        {totalCarbs > 0 && <NutrientChip type="carbs" value={`${totalCarbs}g`} />}
        {totalFat > 0 && <NutrientChip type="fat" value={`${totalFat}g`} />}
      </div>
    </div>
  );
};

export default EditableFoodCard;

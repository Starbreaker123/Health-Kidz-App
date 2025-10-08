
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  daily_calorie_goal?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface ChildDateSelectorProps {
  children: Child[];
  selectedChildId: string;
  selectedDate: string;
  onChildChange: (childId: string) => void;
  onDateChange: (date: string) => void;
}

const ChildDateSelector = ({
  children,
  selectedChildId,
  selectedDate,
  onChildChange,
  onDateChange
}: ChildDateSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
        <Select value={selectedChildId} onValueChange={onChildChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a child" />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
};

export default ChildDateSelector;

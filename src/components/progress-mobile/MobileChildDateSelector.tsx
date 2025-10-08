
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface MobileChildDateSelectorProps {
  children: Child[];
  selectedChildId: string;
  selectedDate: string;
  onChildChange: (childId: string) => void;
  onDateChange: (date: string) => void;
}

const MobileChildDateSelector: React.FC<MobileChildDateSelectorProps> = ({
  children,
  selectedChildId,
  selectedDate,
  onChildChange,
  onDateChange
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        {/* Child Selector */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <label className="text-sm font-medium text-gray-700">Select Child</label>
            </div>
            <Select value={selectedChildId} onValueChange={onChildChange}>
              <SelectTrigger className="bg-white border-blue-200 focus:ring-blue-500">
                <SelectValue placeholder="Choose a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white text-xs font-bold">
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                      {child.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Date Selector */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <label className="text-sm font-medium text-gray-700">Select Date</label>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-base"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <label className="text-sm font-medium text-gray-700">Select Child</label>
          </div>
          <Select value={selectedChildId} onValueChange={onChildChange}>
            <SelectTrigger className="bg-white border-blue-200 focus:ring-blue-500">
              <SelectValue placeholder="Choose a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white text-xs font-bold">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    {child.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <label className="text-sm font-medium text-gray-700">Select Date</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileChildDateSelector;

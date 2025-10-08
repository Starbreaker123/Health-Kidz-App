
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendData {
  date: string;
  calories: number;
  protein: number;
  calcium: number;
  iron: number;
  vitaminC: number;
}

interface NutritionTrendChartProps {
  data: TrendData[];
  selectedNutrients: string[];
  onNutrientToggle: (nutrient: string) => void;
}

const nutrientConfig = {
  calories: { color: '#3B82F6', label: 'Calories' },
  protein: { color: '#10B981', label: 'Protein (g)' },
  calcium: { color: '#F59E0B', label: 'Calcium (mg)' },
  iron: { color: '#EF4444', label: 'Iron (mg)' },
  vitaminC: { color: '#8B5CF6', label: 'Vitamin C (mg)' }
};

const NutritionTrendChart: React.FC<NutritionTrendChartProps> = ({
  data,
  selectedNutrients,
  onNutrientToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nutrition Trends (Last 7 Days)</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(nutrientConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => onNutrientToggle(key)}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  selectedNutrients.includes(key)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {selectedNutrients.map((nutrient) => (
                <Line
                  key={nutrient}
                  type="monotone"
                  dataKey={nutrient}
                  stroke={nutrientConfig[nutrient as keyof typeof nutrientConfig]?.color}
                  strokeWidth={2}
                  dot={{ fill: nutrientConfig[nutrient as keyof typeof nutrientConfig]?.color, strokeWidth: 2, r: 4 }}
                  name={nutrientConfig[nutrient as keyof typeof nutrientConfig]?.label}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionTrendChart;

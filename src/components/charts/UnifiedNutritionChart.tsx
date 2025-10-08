
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface TrendData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MacroData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface UnifiedNutritionChartProps {
  trendData: TrendData[];
  macroData: MacroData[];
  totalCalories: number;
}

// Focus on major nutrients only
const majorNutrientConfig = {
  calories: { color: '#3B82F6', label: 'Calories' },
  protein: { color: '#10B981', label: 'Protein (g)' },
  carbs: { color: '#F59E0B', label: 'Carbs (g)' },
  fat: { color: '#EF4444', label: 'Fat (g)' },
  fiber: { color: '#8B5CF6', label: 'Fiber (g)' }
};

const ChartErrorBoundary: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">Chart temporarily unavailable</p>
      </div>
    </div>
  ) 
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    setHasError(true);
    return <>{fallback}</>;
  }
};

const UnifiedNutritionChart: React.FC<UnifiedNutritionChartProps> = ({
  trendData,
  macroData,
  totalCalories: _totalCalories
}) => {
  const [chartType, setChartType] = useState<'trends' | 'distribution'>('trends');
  const [selectedNutrients, setSelectedNutrients] = useState(['calories', 'protein']);
  const [ChartComponents, setChartComponents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import Recharts to avoid initialization issues
    const loadCharts = async () => {
      try {
        const recharts = await import('recharts');
        setChartComponents(recharts);
        setLoading(false);
      } catch (error) {
        console.warn('Failed to load charts:', error);
        setLoading(false);
      }
    };

    loadCharts();
  }, []);

  const handleNutrientToggle = (nutrient: string) => {
    setSelectedNutrients(prev => 
      prev.includes(nutrient) 
        ? prev.filter(n => n !== nutrient)
        : [...prev, nutrient]
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value}g ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  const renderTrendChart = () => {
    if (!ChartComponents) return null;
    
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = ChartComponents;
    
    return (
      <ChartErrorBoundary>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedNutrients.map(nutrient => (
              <Line
                key={nutrient}
                type="monotone"
                dataKey={nutrient}
                stroke={majorNutrientConfig[nutrient as keyof typeof majorNutrientConfig]?.color || '#000'}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartErrorBoundary>
    );
  };

  const renderDistributionChart = () => {
    if (!ChartComponents) return null;
    
    const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } = ChartComponents;
    
    return (
      <ChartErrorBoundary>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={macroData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {macroData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartErrorBoundary>
    );
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading charts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Nutrition Analytics</CardTitle>
          
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('trends')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm ${
                chartType === 'trends'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Trends</span>
            </button>
            <button
              onClick={() => setChartType('distribution')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm ${
                chartType === 'distribution'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Distribution</span>
            </button>
          </div>
        </div>

        {/* Nutrient Toggles - Only show for trends */}
        {chartType === 'trends' && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(majorNutrientConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleNutrientToggle(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedNutrients.includes(key)
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {chartType === 'trends' ? renderTrendChart() : renderDistributionChart()}
      </CardContent>
    </Card>
  );
};

export default UnifiedNutritionChart;

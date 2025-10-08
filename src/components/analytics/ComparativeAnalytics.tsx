
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PeriodComparison {
  period: string;
  calories: number;
  protein: number;
  goalsMet: number;
  variety: number; // number of different foods
}

interface ComparativeAnalyticsProps {
  weeklyData: PeriodComparison[];
  monthlyData: PeriodComparison[];
}

const ComparativeAnalytics: React.FC<ComparativeAnalyticsProps> = ({
  weeklyData,
  monthlyData
}) => {
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMetric, setSelectedMetric] = useState<'calories' | 'protein' | 'goalsMet' | 'variety'>('calories');

  const data = viewType === 'weekly' ? weeklyData : monthlyData;

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'calories':
        return 'Average Calories';
      case 'protein':
        return 'Average Protein (g)';
      case 'goalsMet':
        return 'Goals Met (%)';
      case 'variety':
        return 'Food Variety Score';
      default:
        return metric;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getBarColor = (value: number, metric: string) => {
    if (metric === 'goalsMet') {
      if (value >= 80) return '#10B981'; // green
      if (value >= 60) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    }
    return '#3B82F6'; // blue
  };

  const currentValue = data.length > 0 ? data[data.length - 1][selectedMetric as keyof PeriodComparison] : 0;
  const previousValue = data.length > 1 ? data[data.length - 2][selectedMetric as keyof PeriodComparison] : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Comparative Analytics
          </CardTitle>
          
          <div className="flex gap-2">
            {/* View Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('weekly')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  viewType === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewType('monthly')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  viewType === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Metric Selection */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(['calories', 'protein', 'goalsMet', 'variety'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedMetric === metric
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
              }`}
            >
              {getMetricLabel(metric)}
            </button>
          ))}
        </div>

        {/* Current vs Previous Period Summary */}
        {data.length > 1 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current {viewType === 'weekly' ? 'Week' : 'Month'}</p>
                <p className="text-xl font-bold text-gray-900">
                  {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
                  {selectedMetric === 'goalsMet' ? '%' : selectedMetric === 'protein' ? 'g' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(currentValue as number, previousValue as number)}
                <span className={`text-sm font-medium ${
                  currentValue > previousValue ? 'text-green-600' : 
                  currentValue < previousValue ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {currentValue > previousValue ? '+' : ''}{getTrendPercentage(currentValue as number, previousValue as number)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="period" 
                fontSize={12}
                tickFormatter={(value) => value.split(' ').pop() || value}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(label) => `Period: ${label}`}
                formatter={(value: number, name) => [
                  `${value.toFixed(1)}${selectedMetric === 'goalsMet' ? '%' : selectedMetric === 'protein' ? 'g' : ''}`,
                  getMetricLabel(selectedMetric)
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey={selectedMetric} radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry[selectedMetric] as number, selectedMetric)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparativeAnalytics;

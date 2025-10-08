
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface Insight {
  type: 'achievement' | 'warning' | 'tip' | 'trend';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface SmartInsightsProps {
  insights: Insight[];
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightStyle = (type: string, priority: string) => {
    const baseStyle = "border-l-4 ";
    
    switch (type) {
      case 'achievement':
        return baseStyle + "border-green-400 bg-green-50";
      case 'warning':
        return baseStyle + "border-yellow-400 bg-yellow-50";
      case 'tip':
        return baseStyle + "border-blue-400 bg-blue-50";
      case 'trend':
        return baseStyle + "border-purple-400 bg-purple-50";
      default:
        return baseStyle + "border-gray-400 bg-gray-50";
    }
  };

  // Sort insights by priority
  const sortedInsights = insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-500" />
          Smart Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedInsights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Keep tracking meals to get personalized insights!</p>
          </div>
        ) : (
          sortedInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${getInsightStyle(insight.type, insight.priority)}`}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <p className="text-xs font-medium text-gray-900 bg-white/60 rounded px-2 py-1 inline-block">
                      💡 {insight.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SmartInsights;

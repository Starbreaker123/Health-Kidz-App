
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Award, AlertTriangle, Lightbulb, Calendar } from 'lucide-react';

interface AdvancedInsight {
  id: string;
  type: 'trend' | 'achievement' | 'warning' | 'prediction' | 'recommendation';
  category: 'nutrition' | 'growth' | 'behavior' | 'goals';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestions?: string[];
  dataPoints?: { label: string; value: number; trend: 'up' | 'down' | 'stable' }[];
}

interface AdvancedInsightsProps {
  insights: AdvancedInsight[];
  selectedChild?: { name: string };
}

const AdvancedInsights: React.FC<AdvancedInsightsProps> = ({ insights, selectedChild }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'prediction':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-orange-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightStyle = (type: string, impact: string) => {
    const baseStyle = "border-l-4 ";
    let colorStyle = "";
    
    switch (type) {
      case 'achievement':
        colorStyle = "border-green-400 bg-green-50";
        break;
      case 'warning':
        colorStyle = "border-yellow-400 bg-yellow-50";
        break;
      case 'trend':
        colorStyle = "border-purple-400 bg-purple-50";
        break;
      case 'prediction':
        colorStyle = "border-blue-400 bg-blue-50";
        break;
      case 'recommendation':
        colorStyle = "border-orange-400 bg-orange-50";
        break;
      default:
        colorStyle = "border-gray-400 bg-gray-50";
    }
    
    return baseStyle + colorStyle;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Sort insights by impact and confidence
  const sortedInsights = insights.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    if (impactOrder[a.impact] !== impactOrder[b.impact]) {
      return impactOrder[a.impact] - impactOrder[b.impact];
    }
    return b.confidence - a.confidence;
  });

  // Group insights by category
  const groupedInsights = sortedInsights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, AdvancedInsight[]>);

  const categoryLabels = {
    nutrition: 'Nutritional Analysis',
    growth: 'Growth Patterns',
    behavior: 'Eating Behaviors',
    goals: 'Goal Achievement'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-500" />
          AI-Powered Insights for {selectedChild?.name || 'Your Child'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Advanced analytics and personalized recommendations based on nutrition patterns
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.keys(groupedInsights).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Keep tracking meals to unlock advanced insights!</p>
            <p className="text-sm mt-1">We need at least a week of data to generate meaningful patterns.</p>
          </div>
        ) : (
          Object.entries(groupedInsights).map(([category, categoryInsights]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h4>
              {categoryInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg ${getInsightStyle(insight.type, insight.impact)}`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">
                          {insight.title}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(insight.confidence)}`}>
                            {insight.confidence}% confidence
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {insight.impact} impact
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {insight.description}
                      </p>

                      {insight.dataPoints && insight.dataPoints.length > 0 && (
                        <div className="mb-3 p-2 bg-white/60 rounded">
                          <p className="text-xs font-medium text-gray-600 mb-1">Supporting Data:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {insight.dataPoints.map((point, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span>{point.label}:</span>
                                <span className="font-medium flex items-center gap-1">
                                  {point.value}
                                  {point.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                                  {point.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {insight.suggestions && insight.suggestions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-900">Recommended Actions:</p>
                          {insight.suggestions.map((suggestion, index) => (
                            <p key={index} className="text-xs text-gray-800 bg-white/60 rounded px-2 py-1">
                              💡 {suggestion}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedInsights;

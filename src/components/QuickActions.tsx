import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className="nutri-card nutri-floating cursor-pointer group hover:shadow-lg transition-all" 
              onClick={action.onClick}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${action.gradient} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 text-base">{action.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{action.description}</p>
                    <div className="flex items-center text-nutri-green text-sm font-medium">
                      <span>Get started</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  gradient?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  gradient = "nutri-gradient-blue"
}) => {
  return (
    <Card className="nutri-card">
      <CardContent className="p-4 sm:p-8 text-center">
        <div className={`w-16 h-16 ${gradient} rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h4>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="nutri-gradient-green text-white hover:shadow-lg transition-all nutri-floating"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;

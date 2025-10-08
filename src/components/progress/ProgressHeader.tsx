
import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Typography } from '@/components/ui/design-system';
import { useIsMobile } from '@/hooks/use-mobile';

const ProgressHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
      <div className="relative bg-gradient-to-br from-purple-400/90 via-blue-400/90 to-teal-500/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
        <div className="relative z-10 flex items-center space-x-4 sm:space-x-6">
          <div className="bg-white/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg animate-scale-in flex-shrink-0">
            <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1 min-w-0">
            {isMobile ? (
              <>
                <Typography.MobileTitle className="text-white drop-shadow-lg mb-1">
                  Daily Nutrition Progress
                </Typography.MobileTitle>
                <Typography.MobileBody className="text-white/90 drop-shadow">
                  Track your child's nutritional intake and progress.
                </Typography.MobileBody>
              </>
            ) : (
              <>
                <Typography.H1 className="text-white drop-shadow-lg mb-2">
                  Daily Nutrition Progress
                </Typography.H1>
                <Typography.Body className="text-white/90 drop-shadow text-lg">
                  Track your child's nutritional intake and progress.
                </Typography.Body>
              </>
            )}
          </div>
          <div className="hidden sm:flex bg-white/20 backdrop-blur-md p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white drop-shadow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;

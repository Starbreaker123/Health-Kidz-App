
import { BarChart3, TrendingUp } from 'lucide-react';

interface EnhancedProgressHeaderProps {
  isMobile: boolean;
}

const EnhancedProgressHeader = ({ isMobile }: EnhancedProgressHeaderProps) => {
  return (
    <div className="relative overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
      <div className="relative bg-gradient-to-br from-violet-400/90 via-cyan-400/90 to-emerald-500/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
        <div className="relative z-10 flex items-center space-x-4 sm:space-x-6">
          <div className="bg-white/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg animate-scale-in flex-shrink-0">
            <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1 min-w-0">
            {isMobile ? (
              <>
                <h1 className="text-xl font-bold text-white drop-shadow-lg mb-1">
                  Advanced Nutrition Analytics
                </h1>
                <p className="text-white/90 drop-shadow text-sm">
                  Comprehensive insights and progress tracking
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
                  Advanced Nutrition Analytics
                </h1>
                <p className="text-white/90 drop-shadow text-lg">
                  Comprehensive insights and progress tracking
                </p>
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

export default EnhancedProgressHeader;

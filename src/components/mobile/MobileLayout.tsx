
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  enableSafeArea?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className, 
  enableSafeArea = true 
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full min-h-screen",
        // Mobile-specific layout optimizations
        isMobile && [
          "relative overflow-hidden",
          enableSafeArea && "safe-area-top safe-area-bottom",
          // Prevent pull-to-refresh on mobile
          "overscroll-none",
          // Optimize for mobile performance
          "will-change-transform",
        ],
        className
      )}
      style={isMobile ? {
        // Prevent zoom on double-tap
        touchAction: 'manipulation',
        // Smooth scrolling
        WebkitOverflowScrolling: 'touch',
        // Prevent text selection on mobile for better UX
        WebkitUserSelect: 'none',
        userSelect: 'none',
      } : {}}
    >
      {children}
    </div>
  );
};

export { MobileLayout };

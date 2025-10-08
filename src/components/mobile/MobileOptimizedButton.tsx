
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

const MobileOptimizedButton = React.forwardRef<
  HTMLButtonElement,
  MobileOptimizedButtonProps
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <Button
      ref={ref}
      className={cn(
        // Ensure proper touch targets on mobile
        isMobile && "min-h-[44px] min-w-[44px] px-4 py-3 text-base touch-target",
        // Add haptic feedback classes for mobile
        isMobile && "active:scale-95 transition-transform duration-150",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

MobileOptimizedButton.displayName = "MobileOptimizedButton";

export { MobileOptimizedButton };

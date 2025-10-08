
import React from 'react';
import { cn } from '@/lib/utils';

// Enhanced spacing system with mobile-first approach
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

// Enhanced typography components with responsive scaling
export const Typography = {
  H1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 nutri-text-shadow leading-tight", className)} {...props}>
      {children}
    </h1>
  ),
  H2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight", className)} {...props}>
      {children}
    </h2>
  ),
  H3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight", className)} {...props}>
      {children}
    </h3>
  ),
  Body: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm sm:text-base text-gray-600 leading-relaxed", className)} {...props}>
      {children}
    </p>
  ),
  Caption: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn("text-xs sm:text-sm text-gray-500", className)} {...props}>
      {children}
    </span>
  ),
  // New mobile-optimized typography variants
  MobileTitle: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-lg sm:text-xl font-bold text-gray-900 leading-tight", className)} {...props}>
      {children}
    </h2>
  ),
  MobileSubtitle: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-base sm:text-lg font-semibold text-gray-800 leading-snug", className)} {...props}>
      {children}
    </h3>
  ),
  MobileBody: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm text-gray-600 leading-relaxed", className)} {...props}>
      {children}
    </p>
  ),
};

// Enhanced container component with mobile-first design
export const Container = ({ children, className, size = 'default', ...props }: {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  };

  return (
    <div className={cn("mx-auto px-3 sm:px-6 lg:px-8", sizeClasses[size], className)} {...props}>
      {children}
    </div>
  );
};

// Enhanced card variants with mobile-optimized spacing
export const CardVariants = {
  Default: "nutri-card shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6",
  Elevated: "nutri-card shadow-lg border-0 nutri-floating p-3 sm:p-4 lg:p-6",
  Interactive: "nutri-card shadow-md border border-gray-100 nutri-floating hover:shadow-xl transition-all cursor-pointer p-3 sm:p-4 lg:p-6 touch-scale",
  Gradient: "nutri-card shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4 lg:p-6",
  Mobile: "nutri-card shadow-sm border border-gray-100 p-4 mobile-touch-target"
};

// Mobile-first section wrapper component
export const Section = ({ children, className, spacing: spacingSize = 'lg', ...props }: {
  children: React.ReactNode;
  className?: string;
  spacing?: keyof typeof spacing;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <section className={cn(`py-4 sm:py-6 lg:py-${spacingSize === 'lg' ? '12' : spacingSize === 'md' ? '8' : '6'}`, className)} {...props}>
    {children}
  </section>
);

// New mobile-specific components
export const MobileCard = ({ children, className, variant = 'default', ...props }: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'compact';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const variants = {
    default: "bg-white rounded-xl shadow-sm border border-gray-100 p-4",
    interactive: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 touch-scale hover:shadow-md transition-all active:scale-95",
    compact: "bg-white rounded-lg shadow-sm border border-gray-100 p-3"
  };

  return (
    <div className={cn(variants[variant], "min-h-[44px]", className)} {...props}>
      {children}
    </div>
  );
};

export const TouchTarget = ({ children, className, size = 'default', ...props }: {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const sizes = {
    sm: 'min-h-[40px] min-w-[40px]',
    default: 'min-h-[44px] min-w-[44px]',
    lg: 'min-h-[48px] min-w-[48px]'
  };

  return (
    <div className={cn("flex items-center justify-center touch-scale", sizes[size], className)} {...props}>
      {children}
    </div>
  );
};

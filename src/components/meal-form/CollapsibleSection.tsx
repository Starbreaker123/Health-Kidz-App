
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CollapsibleSectionProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  required?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  emoji,
  children,
  defaultOpen = true,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();

  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className={`${isMobile ? 'py-2 px-3' : 'py-3 px-4'} cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>{emoji}</span>
                <span>{title}</span>
                {required && <span className="text-red-500 text-xs ml-1">*</span>}
              </div>
              <div className="transition-transform duration-200">
                {isOpen ? (
                  <ChevronUp className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} text-gray-500`} />
                ) : (
                  <ChevronDown className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} text-gray-500`} />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <CardContent className={`${isMobile ? 'px-3 pb-3' : 'px-4 pb-4'} pt-0`}>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleSection;

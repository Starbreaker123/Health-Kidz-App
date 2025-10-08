
import { useState, useCallback, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

export const useMobileGestures = () => {
  const isMobile = useIsMobile();
  const [swipe, setSwipe] = useState<SwipeGesture>({ direction: null, distance: 0 });
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, [isMobile]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, [isMobile]);

  const onTouchEnd = useCallback(() => {
    if (!isMobile || !touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    let direction: SwipeGesture['direction'] = null;
    let distance = 0;

    if (isLeftSwipe) {
      direction = 'left';
      distance = Math.abs(distanceX);
    } else if (isRightSwipe) {
      direction = 'right';
      distance = Math.abs(distanceX);
    } else if (isUpSwipe) {
      direction = 'up';
      distance = Math.abs(distanceY);
    } else if (isDownSwipe) {
      direction = 'down';
      distance = Math.abs(distanceY);
    }

    setSwipe({ direction, distance });
  }, [isMobile]);

  const resetSwipe = useCallback(() => {
    setSwipe({ direction: null, distance: 0 });
  }, []);

  return {
    swipe,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetSwipe,
    isMobile,
  };
};

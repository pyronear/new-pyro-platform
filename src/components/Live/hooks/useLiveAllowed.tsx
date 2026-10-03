import { useMemo } from 'react';

import { useAuth } from '@/context/useAuth.ts';
import { useIsMobile } from '@/utils/useIsMobile.ts';

export const useLiveAllowed = () => {
  const isMobile = useIsMobile();
  const { hasRole } = useAuth();

  const isLiveAuthorized = useMemo(() => {
    return !isMobile && hasRole('F001_LIVESTREAMING');
  }, [isMobile, hasRole]);

  return { isLiveAuthorized };
};

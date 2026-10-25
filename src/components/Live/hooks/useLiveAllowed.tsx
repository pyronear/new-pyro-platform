import { useMemo } from 'react';

import { useAuth } from '@/context/useAuth.ts';
import { useIsMobile } from '@/utils/useIsMobile.ts';

export const useLiveAllowed = () => {
  const isMobile = useIsMobile();
  const { hasProfil } = useAuth();

  const isLiveAuthorized = useMemo(() => {
    return !isMobile && hasProfil('operator');
  }, [isMobile, hasProfil]);

  return { isLiveAuthorized };
};

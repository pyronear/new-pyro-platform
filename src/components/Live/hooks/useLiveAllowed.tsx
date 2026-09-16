import { useMemo } from 'react';

import { useAuth } from '@/context/useAuth.ts';
import { useIsMobile } from '@/utils/useIsMobile.ts';

export const useLiveAllowed = () => {
  const isMobile = useIsMobile();
  const { profil } = useAuth();

  const isLiveAuthorized = useMemo(() => {
    return !isMobile && profil == 'agent';
  }, [isMobile, profil]);

  return { isLiveAuthorized };
};

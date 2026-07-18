import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';

import { LOADING_ACTION_BUTTON_TIMER_MS } from '@/utils/live.ts';

interface FabLoadingProps {
  onClick: () => void;
  isSmall?: boolean;
  children: React.ReactNode;
}

export const FabLoading = ({
  onClick,
  isSmall = false,
  children,
}: FabLoadingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const onClickWithLoading = () => {
    setIsLoading(true);
    setTimeoutId(
      window.setTimeout(() => {
        setIsLoading(false);
      }, LOADING_ACTION_BUTTON_TIMER_MS)
    );
    onClick();
  };

  useEffect(() => {
    return () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <Fab size={isSmall ? 'small' : 'medium'} onClick={onClickWithLoading}>
      {isLoading ? <CircularProgress size={isSmall ? 10 : 20} /> : children}
    </Fab>
  );
};

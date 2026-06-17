import { Fab } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

const LOADING_TIMER_MS = 1000;

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
  const [timeout, setTimeout] = useState<number | null>(null);

  const onClickWithLoading = () => {
    setIsLoading(true);
    setTimeout(
      window.setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIMER_MS)
    );
    onClick();
  };

  useEffect(() => {
    return () => {
      if (timeout != null) {
        window.clearTimeout(timeout);
      }
    };
  }, [timeout]);

  return (
    <Fab size={isSmall ? 'small' : 'medium'} onClick={onClickWithLoading}>
      {isLoading ? <CircularProgress size={isSmall ? 10 : 20} /> : children}
    </Fab>
  );
};

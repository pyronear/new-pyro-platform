import { Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { formatAzimuth } from '@/utils/alerts.ts';

interface LabelProps {
  value: number;
  isLoading: boolean;
}

export const LabelAzimuthAxis = ({ isLoading, value }: LabelProps) => {
  return (
    <>
      {isLoading ? (
        <Skeleton width="20px" height="1.5rem" />
      ) : (
        <Typography variant="caption" whiteSpace="nowrap" textAlign="center">
          {formatAzimuth(value)}
        </Typography>
      )}
    </>
  );
};

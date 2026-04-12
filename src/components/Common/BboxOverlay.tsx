import { Box } from '@mui/material';

import type { BboxType } from '@/utils/occlusionMasks';

interface BboxOverlayProps {
  bbox: BboxType;
  color: 'red' | 'green';
  onClick?: () => void;
}

export const BboxOverlay = ({ bbox, color, onClick }: BboxOverlayProps) => {
  const borderColor = color === 'red' ? '#f44336' : '#4caf50';
  const backgroundColor =
    color === 'red' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)';

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: `${bbox.xmin * 100}%`,
        top: `${bbox.ymin * 100}%`,
        width: `${(bbox.xmax - bbox.xmin) * 100}%`,
        height: `${(bbox.ymax - bbox.ymin) * 100}%`,
        border: `2px solid ${borderColor}`,
        backgroundColor,
        pointerEvents: onClick ? 'auto' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        zIndex: 1,
      }}
    />
  );
};

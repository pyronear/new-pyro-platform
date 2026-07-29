import { Box, Stack, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';

import { LabelAzimuthAxis } from '@/components/Common/AzimuthAxis/LabelAzimuthAxis.tsx';
import {
  buildArrayAroundCenter,
  isFirstOrLastInList,
  isMiddleInList,
} from '@/utils/axisHelper.ts';

const STEP = 5;

const TickLine = styled('div')(
  ({ isHighlight, color }: { isHighlight: boolean; color: string }) => ({
    width: '1px',
    height: `${isHighlight ? 8 : 5}px`,
    backgroundColor: color,
    flexShrink: 0,
  })
);

interface AzimuthAxisProps {
  center: number;
  range: number;
  isLoading: boolean;
}

const AzimuthAxis: React.FC<AzimuthAxisProps> = ({
  center,
  range,
  isLoading,
}) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  const ticks = useMemo(
    () => buildArrayAroundCenter(STEP, center, range),
    [center, range]
  );

  const extraSpaceOnSides = useMemo(() => {
    const minRange = center - range / 2;
    const minTick = ticks[0];
    const tickOverStepOnLeft = STEP / 2;
    return minRange - (minTick - tickOverStepOnLeft);
  }, [center, range, ticks]);

  const convertToPercentage = useCallback(
    (degrees: number) => {
      return `${(100 / range) * degrees}%`;
    },
    [range]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        position: 'relative',
        width: '100%',
        height: '32px',
        userSelect: 'none',
        borderColor: color,
        marginBottom: 2,
        paddingX:
          extraSpaceOnSides >= 0 ? convertToPercentage(extraSpaceOnSides) : 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: color,
        }}
      />
      {ticks.map((tickValue, index) => {
        const isFirstOrLastItem = isFirstOrLastInList(ticks, index);
        const isMiddleItem = isMiddleInList(ticks, index);
        const isHighlight = isFirstOrLastItem || isMiddleItem;
        const isBiggerThanRange = isFirstOrLastItem && extraSpaceOnSides < 0;

        return (
          <Stack
            key={tickValue}
            alignItems="center"
            marginX="auto"
            style={{
              position: 'relative',
              width: convertToPercentage(
                STEP - (isBiggerThanRange ? Math.abs(extraSpaceOnSides) : 0)
              ),
            }}
          >
            {isHighlight && (
              <LabelAzimuthAxis value={tickValue} isLoading={isLoading} />
            )}
            <TickLine isHighlight={isHighlight} color={color} />
          </Stack>
        );
      })}
    </Box>
  );
};

export default AzimuthAxis;

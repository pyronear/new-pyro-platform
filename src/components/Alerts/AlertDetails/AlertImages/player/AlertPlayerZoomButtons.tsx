import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { IconButton, Stack } from '@mui/material';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface AlertPlayerZoomButtonsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  isZoomOutDisabled: boolean;
}

// zoom already works with scroll / pinch, these buttons make it discoverable
export const AlertPlayerZoomButtons = ({
  onZoomIn,
  onZoomOut,
  isZoomOutDisabled,
}: AlertPlayerZoomButtonsProps) => {
  const { t } = useTranslationPrefix('alerts');

  const buttons = [
    {
      label: t('buttonZoomIn'),
      icon: <ZoomInIcon />,
      onClick: onZoomIn,
      disabled: false,
    },
    {
      label: t('buttonZoomOut'),
      icon: <ZoomOutIcon />,
      onClick: onZoomOut,
      disabled: isZoomOutDisabled,
    },
  ];

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ position: 'absolute', left: 8, top: 8, zIndex: 2 }}
    >
      {buttons.map(({ label, icon, onClick, disabled }) => (
        <IconButton
          key={label}
          size="small"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          title={label}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: 'common.white',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          {icon}
        </IconButton>
      ))}
    </Stack>
  );
};

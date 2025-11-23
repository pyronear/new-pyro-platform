import HighlightOff from '@mui/icons-material/HighlightOff';
import { Box, IconButton, useTheme } from '@mui/material';

import logoLettersOrange from '@/assets/logo_letters_orange.png';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface BlinkOverlayProps {
  closeOverlay: () => void;
  hasAlert: boolean;
}

export const BlinkOverlay = ({ closeOverlay, hasAlert }: BlinkOverlayProps) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts.blinkingMode');

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: hasAlert
          ? theme.palette.error.main
          : theme.palette.primary.main,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(hasAlert && {
          animation: 'blinking 0.5s steps(1, end) infinite',
          '@keyframes blinking': {
            '0%, 100%': {
              backgroundColor: theme.palette.error.main,
            },
            '50%': {
              backgroundColor: theme.palette.common.black,
            },
          },
        }),
      }}
    >
      <Box
        component="img"
        src={logoLettersOrange}
        alt="Pyro Logo"
        sx={{
          maxWidth: '80%',
          maxHeight: '80%',
          objectFit: 'contain',
        }}
      />
      <Box position="absolute" top={32} right={32}>
        <IconButton onClick={closeOverlay} aria-label={t('iconCloseAlt')}>
          <HighlightOff sx={{ fontSize: '3rem', color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

import HighlightOff from '@mui/icons-material/HighlightOff';
import { Box, IconButton } from '@mui/material';

import logoLettersOrange from '@/assets/logo_letters_orange.png';

interface BlinkOverlayProps {
  closeOverlay: () => void;
  hasAlert: boolean;
}

export const BlinkOverlay = ({ closeOverlay, hasAlert }: BlinkOverlayProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: hasAlert ? '#FA3200' : '#0B444A',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(hasAlert && {
          animation: 'blinking 0.5s steps(1, end) infinite',
          '@keyframes blinking': {
            '0%, 100%': {
              backgroundColor: '#FA3200',
            },
            '50%': {
              backgroundColor: 'black',
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
        <IconButton onClick={closeOverlay} aria-label="Exit blinking mode">
          <HighlightOff sx={{ fontSize: '6rem', color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

import HighlightOff from '@mui/icons-material/HighlightOff';
import { Box } from '@mui/material';

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
      <HighlightOff
        onClick={closeOverlay}
        sx={{
          position: 'absolute',
          top: 32,
          right: 32,
          cursor: 'pointer',
          fontSize: '6rem',
          color: 'white',
          userSelect: 'none',
        }}
      />
    </Box>
  );
};

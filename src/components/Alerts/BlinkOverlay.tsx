import { Box } from '@mui/material';

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
        backgroundColor: hasAlert ? 'red' : 'green',
        zIndex: 100000,
      }}
    >
      <Box
        onClick={closeOverlay}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          cursor: 'pointer',
          fontSize: '2rem',
          color: 'white',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
      >
        ×
      </Box>
    </Box>
  );
};

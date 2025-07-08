import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const Loader = () => {
  return (
    <Box
      sx={{
        margin: 4,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
};

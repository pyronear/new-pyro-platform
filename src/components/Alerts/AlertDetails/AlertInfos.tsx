import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

export const AlertInfos = () => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        height: 500,
        borderRadius: 6,
        padding: 3,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      TODO
    </Paper>
  );
};

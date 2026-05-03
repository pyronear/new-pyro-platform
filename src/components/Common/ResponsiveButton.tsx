import { useTheme } from '@mui/material';
import Button, { type ButtonProps } from '@mui/material/Button';

export const ResponsiveButton = (props: ButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      {...props}
      sx={{
        [theme.breakpoints.down('sm')]: {
          '& .MuiButton-startIcon': {
            margin: 0,
          },
          '& .buttonText': {
            display: 'none',
          },
        },
      }}
    />
  );
};

export default ResponsiveButton;

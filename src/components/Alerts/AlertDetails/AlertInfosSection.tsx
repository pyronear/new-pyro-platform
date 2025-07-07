import { Paper, Typography, useTheme } from '@mui/material';

interface AlertInfosSectionType {
  title: string;
  children: React.ReactNode;
}

export const AlertInfosSection = ({
  title,
  children,
}: AlertInfosSectionType) => {
  const theme = useTheme();
  return (
    <Paper sx={{ padding: 1 }}>
      <Typography fontSize="0.85rem">{title}</Typography>
      <Typography fontSize="0.85rem" color={theme.palette.secondaryText.main}>
        {children}
      </Typography>
    </Paper>
  );
};

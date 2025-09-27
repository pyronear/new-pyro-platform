import { Typography, useTheme } from '@mui/material';

interface LiveAlertInfosSectionType {
  title: string;
  children: React.ReactNode;
}

export const LiveAlertInfosSection = ({
  title,
  children,
}: LiveAlertInfosSectionType) => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h4">{title}</Typography>
      <Typography
        variant="h4"
        fontWeight="normal"
        color={theme.palette.secondaryText.main}
      >
        {children}
      </Typography>
    </>
  );
};

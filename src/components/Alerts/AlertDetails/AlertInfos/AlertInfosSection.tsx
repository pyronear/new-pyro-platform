import { Paper, Typography, useTheme } from '@mui/material';

import { CopyToClipboard } from '@/components/copyToClipboard';

interface AlertInfosSectionType {
  title: string;
  withTextToCopy?: string;
  children: React.ReactNode;
}

export const AlertInfosSection = ({
  title,
  children,
  withTextToCopy,
}: AlertInfosSectionType) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        padding: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <div style={{ flex: 1 }}>
        <Typography variant="h4">{title}</Typography>
        <Typography
          variant="h4"
          fontWeight="normal"
          color={theme.palette.secondaryText.main}
        >
          {children}
        </Typography>
      </div>
      {withTextToCopy && <CopyToClipboard textToCopy={withTextToCopy} />}
    </Paper>
  );
};

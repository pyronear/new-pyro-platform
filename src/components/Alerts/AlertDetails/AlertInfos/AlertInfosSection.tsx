import { Paper, Stack, Typography, useTheme } from '@mui/material';

import { CopyToClipboard } from '@/components/Common/CopyToClipboard';

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
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Typography variant="h4">{title}</Typography>
          <Typography
            variant="h4"
            fontWeight="normal"
            color={theme.palette.secondaryText.main}
          >
            {children}
          </Typography>
        </Stack>

        {withTextToCopy && <CopyToClipboard textToCopy={withTextToCopy} />}
      </Stack>
    </Paper>
  );
};

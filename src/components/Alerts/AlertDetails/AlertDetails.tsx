import { Box, Grid, Typography } from '@mui/material';

import type { AlertType } from '../../../utils/alertsType';

interface AlertDetailsType {
  alert: AlertType | null;
}

export const AlertDetails = ({ alert }: AlertDetailsType) => {
  return (
    <Box padding={3}>
      <Typography variant="h1">
        Camera : Serre de barre {alert?.startedAt}
      </Typography>
      <Grid container>
        <Grid size={{ xs: 12, sm: 9 }}>TODO : camera images</Grid>
        <Grid size={{ xs: 12, sm: 3 }}>TODO : camera details</Grid>
      </Grid>
    </Box>
  );
};

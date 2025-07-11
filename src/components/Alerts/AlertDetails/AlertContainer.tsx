import { Grid } from '@mui/material';
import { useState } from 'react';

import type { AlertType } from '../../../utils/alerts';
import { AlertHeader } from './AlertHeader';
import { AlertImage } from './AlertImage';
import { AlertInfos } from './AlertsInfos';

interface AlertContainerType {
  alert: AlertType;
}

export const AlertContainer = ({ alert }: AlertContainerType) => {
  const [selectedSequence, setSelectedSequence] = useState(alert.sequences[0]);

  // TODO : fetch detections of the selected sequence

  return (
    <Grid container padding={3} spacing={3}>
      <Grid size={12}>
        <AlertHeader
          sequences={alert.sequences}
          selectedSequence={selectedSequence}
          setSelectedSequence={setSelectedSequence}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 9 }}>
        <AlertImage />
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <AlertInfos />
      </Grid>
    </Grid>
  );
};

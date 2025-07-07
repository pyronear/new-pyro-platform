import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '../../../utils/alerts';
import { AlertHeader } from './AlertHeader';
import { AlertImages } from './AlertImages';
import { AlertInfos } from './AlertInfos';

interface AlertContainerType {
  alert: AlertType;
}

export const AlertContainer = ({ alert }: AlertContainerType) => {
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceWithCameraInfoType | null>();

  useEffect(() => {
    if (alert.sequences.length > 0) {
      setSelectedSequence(alert.sequences[0]);
    }
  }, [alert]);

  // TODO : fetch detections of the selected sequence

  return (
    <>
      {selectedSequence && (
        <Grid container padding={3} spacing={3}>
          <Grid size={12}>
            <AlertHeader
              sequences={alert.sequences}
              selectedSequence={selectedSequence}
              setSelectedSequence={setSelectedSequence}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <AlertImages />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <AlertInfos />
          </Grid>
        </Grid>
      )}
    </>
  );
};

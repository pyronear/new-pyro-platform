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
  resetAlert: () => void;
}

export const AlertContainer = ({ alert, resetAlert }: AlertContainerType) => {
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
        <Grid container padding={{ xs: 1, sm: 2 }} spacing={{ xs: 1, sm: 2 }}>
          <Grid size={12}>
            <AlertHeader
              sequences={alert.sequences}
              selectedSequence={selectedSequence}
              setSelectedSequence={setSelectedSequence}
              resetAlert={resetAlert}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <AlertImages sequence={selectedSequence} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <AlertInfos sequence={selectedSequence} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

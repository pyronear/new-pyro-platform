import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '../../../utils/alerts';
import { AlertHeader } from './AlertHeader';
import { AlertImages } from './AlertImages/AlertImages';
import { AlertInfos } from './AlertInfos/AlertInfos';

interface AlertContainerType {
  isLiveMode: boolean;
  alert: AlertType;
  resetAlert: () => void;
}

export const AlertContainer = ({
  isLiveMode,
  alert,
  resetAlert,
}: AlertContainerType) => {
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceWithCameraInfoType | null>();

  useEffect(() => {
    if (alert.sequences.length > 0) {
      setSelectedSequence(alert.sequences[0]);
    }
  }, [alert]);

  return (
    <>
      {selectedSequence && (
        <Grid container padding={{ xs: 1, sm: 2 }} spacing={{ xs: 1, sm: 2 }}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <AlertHeader
              sequences={alert.sequences}
              selectedSequence={selectedSequence}
              setSelectedSequence={setSelectedSequence}
              resetAlert={resetAlert}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <></> {/** TODO : share alerts */}
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <AlertImages sequence={selectedSequence} />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <AlertInfos
              sequence={selectedSequence}
              sequences={alert.sequences}
              isLiveMode={isLiveMode}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

import { Button, Grid } from '@mui/material';
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
  invalidateAndRefreshData: () => void;
  alert: AlertType;
  resetAlert: () => void;
}

export const AlertContainer = ({
  isLiveMode,
  invalidateAndRefreshData,
  alert,
  resetAlert,
}: AlertContainerType) => {
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceWithCameraInfoType | null>(null);
  const [isBlinkingModeEnabled, setIsBlinkingModeEnabled] = useState(false);

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
              alert={alert}
              selectedSequence={selectedSequence}
              setSelectedSequence={setSelectedSequence}
              resetAlert={resetAlert}
              isLiveMode={isLiveMode}
              invalidateAndRefreshData={invalidateAndRefreshData}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Button
              variant="text"
              onClick={() => setIsBlinkingModeEnabled(!isBlinkingModeEnabled)}
            >
              {isBlinkingModeEnabled
                ? 'Switch to normal view'
                : 'Switch to blinking view'}
            </Button>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <AlertImages sequence={selectedSequence} />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <AlertInfos
              sequence={selectedSequence}
              alert={alert}
              isLiveMode={isLiveMode}
              invalidateAndRefreshData={invalidateAndRefreshData}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

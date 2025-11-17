import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '../../../utils/alerts';
import { useIsMobile } from '../../../utils/useIsMobile';
import { BlinkOverlay } from '../BlinkOverlay';
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
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('alerts');
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceWithCameraInfoType | null>(null);
  const [isBlinkingModeEnabled, setIsBlinkingModeEnabled] = useState(false);

  useEffect(() => {
    if (alert.sequences.length > 0) {
      setSelectedSequence(alert.sequences[0]);
    }
  }, [alert]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsBlinkingModeEnabled(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isBlinkingModeEnabled) {
    return (
      <BlinkOverlay
        closeOverlay={() => setIsBlinkingModeEnabled(false)}
        hasAlert={alert.sequences.length > 0}
      />
    );
  }

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
          {!isMobile && (
            <Grid size={{ xs: 12, lg: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsBlinkingModeEnabled(!isBlinkingModeEnabled)}
              >
                {t('buttonBlinkingView')}
              </Button>
            </Grid>
          )}
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

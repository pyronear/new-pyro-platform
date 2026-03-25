import ShareIcon from '@mui/icons-material/Share';
import { Chip, Grid, Snackbar, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
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
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceWithCameraInfoType | null>(null);
  const [isShareSnackbarOpen, setIsShareSnackbarOpen] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/alert/${alert.id}`;
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setIsShareSnackbarOpen(true);
    });
  };

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
          <Grid
            size={{ xs: 12, lg: 3 }}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <Chip
              icon={<ShareIcon />}
              label={t('buttonShare')}
              variant="filled"
              size="medium"
              clickable
              onClick={handleShare}
              sx={{
                '& .MuiChip-label': {
                  font: theme.typography.body1,
                },
              }}
            />
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
      <Snackbar
        open={isShareSnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setIsShareSnackbarOpen(false)}
        message={t('shareLinkCopied')}
      />
    </>
  );
};

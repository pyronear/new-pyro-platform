import ShareIcon from '@mui/icons-material/Share';
import { Button, Grid, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useTransientTooltip } from '@/utils/useTransientTooltip';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

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
  const { t } = useTranslationPrefix('alerts');
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceWithCameraInfoType | null>(null);
  const { show: showShareTooltip, tooltipProps: shareTooltipProps } =
    useTransientTooltip();

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/alert/${alert.id}`;
    void navigator.clipboard.writeText(shareUrl).then(() => {
      showShareTooltip();
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
          <Grid size={{ xs: 12, lg: 8 }}>
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
            size={{ xs: 12, lg: 4 }}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <Tooltip
              {...shareTooltipProps}
              placement="top-end"
              title={t('shareLinkCopied')}
            >
              <Button
                startIcon={<ShareIcon />}
                variant="text"
                onClick={handleShare}
              >
                {t('buttonShare')}
              </Button>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <AlertImages sequence={selectedSequence} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
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

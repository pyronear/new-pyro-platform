import ShareIcon from '@mui/icons-material/Share';
import { Chip, Grid, Tooltip, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '../../../utils/alerts';
import { useTransientTooltip } from '../../../utils/useTransientTooltip';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertHeader } from './AlertHeader';
import { AlertImages } from './AlertImages/AlertImages';
import { AlertInfos } from './AlertInfos/AlertInfos';

interface AlertContainerType {
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  alert: AlertType;
  resetAlert: () => void;
  isFullWidth?: boolean;
}

export const AlertContainer = ({
  isLiveMode,
  invalidateAndRefreshData,
  alert,
  resetAlert,
  isFullWidth = false,
}: AlertContainerType) => {
  const theme = useTheme();
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
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <AlertImages sequence={selectedSequence} maxImageHeight="60vh" />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AlertInfos
              sequence={selectedSequence}
              alert={alert}
              isLiveMode={isLiveMode}
              invalidateAndRefreshData={invalidateAndRefreshData}
              isFullWidth={isFullWidth}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

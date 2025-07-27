import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { AlertsContainer } from '../components/Alerts/AlertsContainer';
import { Loader } from '../components/Common/Loader';
import { getUnlabelledLatestSequences } from '../services/alerts';
import { getCameraList } from '../services/camera';
import { type AlertType, convertSequencesToAlerts } from '../utils/alerts';
import { useTranslationPrefix } from '../utils/useTranslationPrefix';

export const AlertsPage = () => {
  const { t } = useTranslationPrefix('alerts');

  const {
    isPending: isPendingSequences,
    isError: isErrorSequences,
    data: sequenceList,
    isSuccess: isSuccessSequences,
  } = useQuery({
    queryKey: ['unlabelledSequences'],
    queryFn: getUnlabelledLatestSequences,
    refetchOnWindowFocus: false,
  });

  const {
    isPending: isPendingCameras,
    isError: isErrorCameras,
    data: cameraList,
    isSuccess: isSuccessCameras,
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
    refetchOnWindowFocus: false,
  });

  const alerts: AlertType[] = useMemo(
    () => convertSequencesToAlerts(sequenceList ?? [], cameraList ?? []),
    [sequenceList, cameraList]
  );

  const isPending = isPendingSequences || isPendingCameras;
  const isError = isErrorSequences || isErrorCameras;
  const isSuccess = isSuccessSequences && isSuccessCameras;

  return (
    <>
      {isPending && <Loader />}
      {isError && (
        <Typography variant="body2">
          {t('errorFetchSequencesMessage')}
        </Typography>
      )}
      {isSuccess && (
        <>
          {alerts.length == 0 && (
            <Typography variant="body2">{t('noAlertsMessage')}</Typography>
          )}
          {alerts.length != 0 && <AlertsContainer alerts={alerts} />}
        </>
      )}
    </>
  );
};

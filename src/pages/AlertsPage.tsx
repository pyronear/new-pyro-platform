import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { AlertsContainer } from '../components/Alerts/AlertsContainer';
import { Loader } from '../components/Common/Loader';
import { getUnlabelledLatestSequences } from '../services/alerts';
import type { AlertType } from '../utils/alertsType';
import { useTranslationPrefix } from '../utils/useTranslationPrefix';

export const AlertsPage = () => {
  const { t } = useTranslationPrefix('alerts');

  const {
    isPending,
    isError,
    data: sequenceList,
    isSuccess,
  } = useQuery({
    queryKey: ['unlabelledSequences'],
    queryFn: getUnlabelledLatestSequences,
  });
  const alerts: AlertType[] = useMemo(() => {
    return (
      sequenceList?.map((sequence) => {
        return {
          id: sequence.id,
          startedAt: sequence.started_at,
          lastSeenAt: sequence.last_seen_at,
          detections: [],
        };
      }) ?? []
    );
  }, [sequenceList]);

  return (
    <>
      {isPending && <Loader />}
      {isError && (
        <Typography variant="body2">
          {t('errorFetchSequenceMessage')}
        </Typography>
      )}
      {isSuccess && (
        <>
          {sequenceList.length == 0 && (
            <Typography variant="body2">{t('noSequenceMessage')}</Typography>
          )}
          {sequenceList.length != 0 && <AlertsContainer alerts={alerts} />}
        </>
      )}
    </>
  );
};

import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { AlertsContainer } from '@/components/Alerts/AlertsContainer';
import { Loader } from '@/components/Common/Loader';
import { CameraListProvider } from '@/context/CameraListProvider';
import {
  getUnlabelledLatestAlerts,
  UNLABELLED_ALERTS_QUERY_KEY,
} from '@/services/alerts';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { type AlertType, mapListAlertApiToAlertType } from '@/utils/alerts';
import { isDateToday } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix.ts';

export const AlertsPage = () => {
  const { t } = useTranslationPrefix('alerts');
  const queryClient = useQueryClient();
  const {
    isFetching,
    dataUpdatedAt,
    status: statusSequences,
    data: alertList,
  } = useQuery({
    queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    queryFn: getUnlabelledLatestAlerts,
  });

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  const todayAlerts = useMemo(
    () => (alertList ?? []).filter((alert) => isDateToday(alert.started_at)),
    [alertList]
  );

  const alertsList: AlertType[] = useMemo(
    () => mapListAlertApiToAlertType(todayAlerts, cameraList ?? []),
    [todayAlerts, cameraList]
  );

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    });
  }, [queryClient]);

  const status = useMemo(() => {
    if (statusSequences == STATUS_SUCCESS && statusCameras == STATUS_SUCCESS) {
      return STATUS_SUCCESS;
    }
    if (statusSequences == STATUS_LOADING || statusCameras == STATUS_LOADING) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusSequences, statusCameras]);

  return (
    <CameraListProvider camerasList={cameraList ?? []}>
      {status == STATUS_LOADING && <Loader />}
      {status == STATUS_ERROR && (
        <Typography variant="body2">
          {t('errorFetchSequencesMessage')}
        </Typography>
      )}
      {status == STATUS_SUCCESS && (
        <AlertsContainer
          isRefreshing={isFetching}
          lastUpdate={dataUpdatedAt}
          invalidateAndRefreshData={invalidateAndRefreshData}
          alertsList={alertsList}
        />
      )}
    </CameraListProvider>
  );
};

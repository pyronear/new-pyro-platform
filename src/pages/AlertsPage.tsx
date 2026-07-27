import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { AlertsContainer } from '@/components/Alerts/AlertsContainer';
import { Loader } from '@/components/Common/Loader';
import { CameraListProvider } from '@/context/CameraListProvider';
import { getUnlabelledLatestAlerts } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { type AlertType, mapListAlertApiToAlertType } from '@/utils/alerts';
import { isDateToday } from '@/utils/dates';
import { useDetectNewSequences as useDetectNewAlerts } from '@/utils/useDetectNewSequences';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix.ts';

const ALERTS_LIST_REFRESH_INTERVAL_SECONDS =
  appConfig.getConfig().ALERTS_LIST_REFRESH_INTERVAL_SECONDS;

export const AlertsPage = () => {
  const { t } = useTranslationPrefix('alerts');
  const queryClient = useQueryClient();
  const {
    isFetching,
    dataUpdatedAt,
    status: statusSequences,
    data: alertList,
  } = useQuery({
    queryKey: ['unlabelledAlerts'],
    queryFn: getUnlabelledLatestAlerts,
    refetchInterval: ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000,
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

  const { hasNewSequence: hasNewAlert } = useDetectNewAlerts(
    todayAlerts,
    dataUpdatedAt
  );

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['unlabelledAlerts'] });
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
          hasNewSequence={hasNewAlert}
        />
      )}
    </CameraListProvider>
  );
};

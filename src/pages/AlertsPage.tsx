import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { AlertsContainer } from '@/components/Alerts/AlertsContainer';
import { getUnlabelledLatestSequences } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { type AlertType, convertSequencesToAlerts } from '@/utils/alerts';
import { useDetectNewSequences } from '@/utils/useDetectNewSequences';

const ALERTS_LIST_REFRESH_INTERVAL_SECONDS =
  appConfig.getConfig().ALERTS_LIST_REFRESH_INTERVAL_SECONDS;

export const AlertsPage = () => {
  const queryClient = useQueryClient();
  const {
    isFetching,
    dataUpdatedAt,
    status: statusSequences,
    data: sequenceList,
  } = useQuery({
    queryKey: ['unlabelledSequences'],
    queryFn: getUnlabelledLatestSequences,
    refetchInterval: ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000,
  });

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  const alertsList: AlertType[] = useMemo(
    () => convertSequencesToAlerts(sequenceList ?? [], cameraList ?? []),
    [sequenceList, cameraList]
  );

  const { hasNewSequence } = useDetectNewSequences(sequenceList, dataUpdatedAt);

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['unlabelledSequences'] });
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
    <AlertsContainer
      status={status}
      isRefreshing={isFetching}
      lastUpdate={dataUpdatedAt}
      invalidateAndRefreshData={invalidateAndRefreshData}
      alertsList={alertsList}
      hasNewSequence={hasNewSequence}
    />
  );
};

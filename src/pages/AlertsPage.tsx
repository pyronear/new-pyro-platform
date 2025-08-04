import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { AlertsContainer } from '../components/Alerts/AlertsContainer';
import { getUnlabelledLatestSequences } from '../services/alerts';
import { getCameraList } from '../services/camera';
import { type AlertType, convertSequencesToAlerts } from '../utils/alerts';

export const AlertsPage = () => {
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

  const alertsList: AlertType[] = useMemo(
    () => convertSequencesToAlerts(sequenceList ?? [], cameraList ?? []),
    [sequenceList, cameraList]
  );

  const isPending = isPendingSequences || isPendingCameras;
  const isError = isErrorSequences || isErrorCameras;
  const isSuccess = isSuccessSequences && isSuccessCameras;

  return (
    <AlertsContainer
      isError={isError}
      isPending={isPending}
      isSuccess={isSuccess}
      alertsList={alertsList}
    />
  );
};

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DEFAULT_ROUTE } from '@/App';
import { AlertContainer } from '@/components/Alerts/AlertDetails/AlertContainer';
import { Loader } from '@/components/Common/Loader';
import { getAlertById } from '@/services/alerts';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { type AlertType, mapAlertTypeApiToAlertType } from '@/utils/alerts';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

export const AlertPage = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslationPrefix('alerts');
  const isMobile = useIsMobile();

  const alertIdNumber = Number(alertId);

  const { status: statusAlert, data: alertData } = useQuery({
    queryKey: ['alert', alertIdNumber],
    queryFn: () => getAlertById(alertIdNumber),
    enabled: !isNaN(alertIdNumber),
  });

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  const alertsList: AlertType[] = useMemo(
    () =>
      mapAlertTypeApiToAlertType(
        alertData ? [alertData] : [],
        cameraList ?? []
      ),
    [alertData, cameraList]
  );
  const alert = alertsList[0];

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['alert', alertIdNumber] });
  }, [queryClient, alertIdNumber]);

  const status = useMemo(() => {
    if (statusAlert === STATUS_SUCCESS && statusCameras === STATUS_SUCCESS) {
      return STATUS_SUCCESS;
    }
    if (statusAlert === STATUS_LOADING || statusCameras === STATUS_LOADING) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusAlert, statusCameras]);

  return (
    <>
      {status === STATUS_LOADING && <Loader />}
      {status === STATUS_ERROR && (
        <Typography variant="body2">
          {t('errorFetchSequencesMessage')}
        </Typography>
      )}
      {status === STATUS_SUCCESS && alertsList.length > 0 && (
        <>
          {isMobile ? (
            <Box height={'100%'} overflow={'auto'}>
              <AlertContainer
                isLiveMode={false}
                alert={alert}
                resetAlert={() => void navigate(DEFAULT_ROUTE)}
                invalidateAndRefreshData={invalidateAndRefreshData}
              />
            </Box>
          ) : (
            <Grid container height="100%">
              <Grid size={12} height={'100%'} overflow={'auto'}>
                <AlertContainer
                  isLiveMode={false}
                  alert={alert}
                  resetAlert={() => void navigate(DEFAULT_ROUTE)}
                  invalidateAndRefreshData={invalidateAndRefreshData}
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

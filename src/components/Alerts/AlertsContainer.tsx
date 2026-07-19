import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AlertsContainerForDesktop } from '@/components/Alerts/AlertsContainerForDesktop.tsx';
import { AlertsContainerForMobile } from '@/components/Alerts/AlertsContainerForMobile.tsx';
import { type AlertType, isInTheList } from '@/utils/alerts';
import { useIsMobile } from '@/utils/useIsMobile';

import { useAlertSoundToggle } from './AlertsSound/useAlertSoundToggle';

interface AlertsContainerType {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  alertsList: AlertType[];
  hasNewSequence: boolean;
}

export const AlertsContainer = ({
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  alertsList,
  hasNewSequence,
}: AlertsContainerType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { playSound } = useAlertSoundToggle();

  const selectedAlert = useMemo(
    () =>
      alertsList.find(
        (alert) => alert.id.toString() === searchParams.get('alert')
      ) ?? null,
    [alertsList, searchParams]
  );

  const setSelectedAlert = useCallback(
    (alert: AlertType) => {
      setSearchParams({ alert: alert.id.toString() });
    },
    [setSearchParams]
  );

  const resetSelectedAlert = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  useEffect(() => {
    if (hasNewSequence) {
      playSound();
    }
  }, [hasNewSequence, playSound]);

  useEffect(() => {
    // Default : initial state or if the list changes and the alert doesn't exist anymore
    if (!selectedAlert || !isInTheList(alertsList, selectedAlert)) {
      // In mobile, nothing is selected
      // In computer mode, the first in the list is selected
      if (isMobile || alertsList.length == 0) {
        resetSelectedAlert();
      } else if (alertsList.length > 0) {
        setSelectedAlert(alertsList[0]);
      }
    } else if (isInTheList(alertsList, selectedAlert)) {
      // If the selected alert has changed, its data is updated
      const indexSelectedAlert = alertsList.findIndex(
        (a) => a.id === selectedAlert.id
      );
      setSelectedAlert(alertsList[indexSelectedAlert]);
    }
  }, [
    alertsList,
    isMobile,
    resetSelectedAlert,
    selectedAlert,
    setSelectedAlert,
  ]);

  return (
    <>
      {isMobile ? (
        <AlertsContainerForMobile
          alertsList={alertsList}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
          resetSelectedAlert={resetSelectedAlert}
          lastUpdate={lastUpdate}
          isRefreshing={isRefreshing}
          invalidateAndRefreshData={invalidateAndRefreshData}
        />
      ) : (
        <AlertsContainerForDesktop
          alertsList={alertsList}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
          resetSelectedAlert={resetSelectedAlert}
          lastUpdate={lastUpdate}
          isRefreshing={isRefreshing}
          invalidateAndRefreshData={invalidateAndRefreshData}
        />
      )}
    </>
  );
};

import { Box, useTheme } from '@mui/material';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import {
  type AlertType,
  extractCameraListFromAlert,
  formatAzimuth,
  formatPosition,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';
import { formatIsoToDateTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveAlertInfosSection } from './LiveAlertInfosSection';

interface SelectionCameraProps {
  sites: SiteType[];
  selectedCamera: CameraFullInfosType | null;
  changeCamera: (newSite: SiteType, newCameraId: number | null) => void;
  alert: AlertType;
  currentSequence?: SequenceWithCameraInfoType;
}

export const SelectionCameraWithAlert = ({
  sites,
  selectedCamera,
  changeCamera,
  alert,
  currentSequence,
}: SelectionCameraProps) => {
  const { t } = useTranslationPrefix('alerts');
  const theme = useTheme();
  const cameraList = extractCameraListFromAlert(alert);

  // TODO : to remove, once we receive sites from API
  const getSiteByCameraId = (cameraId: number) => {
    const cameraName = cameraList.find((camera) => camera.id == cameraId)?.name;
    return cameraName
      ? sites.find((site) => cameraName.startsWith(site.id))
      : null;
  };

  return (
    <>
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>
        <CamerasListSelectable
          cameras={cameraList}
          selectedCameraId={selectedCamera?.id ?? null}
          setSelectedCameraId={(newCameraId) => {
            const newSite = getSiteByCameraId(newCameraId);
            if (newSite) {
              changeCamera(newSite, newCameraId);
            }
          }}
        />
      </div>
      {currentSequence && (
        <Box
          border={`1px solid ${theme.palette.grey[400]}`}
          p={1.5}
          borderRadius={1}
        >
          <LiveAlertInfosSection title={t('subtitleDate')}>
            {formatIsoToDateTime(currentSequence.startedAt)}
          </LiveAlertInfosSection>
          <LiveAlertInfosSection title={t('subtitleAzimuth')}>
            {formatAzimuth(currentSequence.coneAzimuth, 1)}
          </LiveAlertInfosSection>
          <LiveAlertInfosSection title={t('subtitleCameraLocalisation')}>
            {formatPosition(
              currentSequence.camera?.lat,
              currentSequence.camera?.lon
            )}
          </LiveAlertInfosSection>
        </Box>
      )}
    </>
  );
};

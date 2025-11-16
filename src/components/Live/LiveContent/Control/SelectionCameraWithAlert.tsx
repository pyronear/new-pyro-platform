import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import {
  type AlertType,
  extractCameraListFromAlert,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';

import { LiveAlertInfos } from './LiveAlertInfos';

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
  const cameraList = extractCameraListFromAlert(alert);
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
      {currentSequence && <LiveAlertInfos sequence={currentSequence} />}
    </>
  );
};

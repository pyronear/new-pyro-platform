import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useEffect } from 'react';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import CamerasMap from '@/components/Dashboard/CamerasMap';
import { moveCameraToAAzimuth } from '@/services/live';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';
import { getMoveToAzimuth } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveAlertInfos } from './AlertInfos/LiveAlertInfos';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType | null;
  setSelectedSite: (newSite: SiteType | null) => void;
  selectedCamera: CameraFullInfosType | null;
  setSelectedCameraId: (newCameraId: number | null) => void;
  targetSequence?: SequenceWithCameraInfoType;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  setSelectedSite,
  selectedCamera,
  setSelectedCameraId,
  targetSequence,
}: LiveControlPanelProps) => {
  const { t } = useTranslationPrefix('live');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSite(sites.find((s) => s.id == event.target.value) ?? null);
  };

  useEffect(() => {
    if (targetSequence?.azimuth && selectedCamera?.ip) {
      const moveToDo = getMoveToAzimuth(
        targetSequence.azimuth,
        selectedCamera.azimuths ?? [],
        selectedCamera.poses ?? []
      );
      if (moveToDo) {
        void moveCameraToAAzimuth(
          selectedCamera.ip,
          moveToDo.pose,
          moveToDo.diffAzimuth,
          moveToDo.direction
        );
      }
    }
  }, [selectedCamera, targetSequence?.azimuth]);

  return (
    <Stack spacing={1} height="100%">
      {targetSequence && (
        <div style={{ marginBottom: 8 }}>
          <LiveAlertInfos sequence={targetSequence} />
        </div>
      )}
      <FormControl fullWidth>
        <InputLabel>{t('siteField')}</InputLabel>
        <Select
          value={selectedSite?.id}
          label={t('siteField')}
          onChange={handleChange}
          sx={{ boxShadow: 'none' }}
        >
          {sites.map((s) => (
            <MenuItem value={s.id} key={s.id}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>
        <CamerasListSelectable
          cameras={selectedSite?.cameras ?? []}
          selectedCameraId={selectedCamera?.id ?? null}
          setSelectedCameraId={setSelectedCameraId}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <CamerasMap
          cameras={selectedCamera ? [selectedCamera] : []}
          minHeight="200px"
        />
      </div>
    </Stack>
  );
};

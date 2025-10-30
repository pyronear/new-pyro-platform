import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import type { AlertType } from '@/utils/alerts';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveAlertInfos } from './AlertInfos/LiveAlertInfos';
import LiveMap from './LiveMap';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType | null;
  setSelectedSite: (newSite: SiteType | null) => void;
  selectedCamera: CameraFullInfosType | null;
  setSelectedCameraId: (newCameraId: number | null) => void;
  alert?: AlertType;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  setSelectedSite,
  selectedCamera,
  setSelectedCameraId,
  alert,
}: LiveControlPanelProps) => {
  const { t } = useTranslationPrefix('live');
  const hasAlert = !!alert;
  const currentSequence = alert?.sequences.find(
    (seq) => seq.camera?.id === selectedCamera?.id
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSite(sites.find((s) => s.id == event.target.value) ?? null);
  };

  return (
    <Stack spacing={1} height="100%">
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
      {hasAlert && currentSequence && (
        <LiveAlertInfos sequence={currentSequence} />
      )}
      <div style={{ flexGrow: 1 }}>
        {selectedCamera && (
          <LiveMap camera={selectedCamera} sequence={currentSequence} />
        )}
      </div>
    </Stack>
  );
};

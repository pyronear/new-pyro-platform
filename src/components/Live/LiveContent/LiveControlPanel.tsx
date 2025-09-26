import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import CamerasMap from '@/components/Dashboard/CamerasMap';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType | null;
  setSelectedSite: (newSite: SiteType | null) => void;
  selectedCamera: CameraFullInfosType | null;
  setSelectedCameraId: (newCameraId: number | null) => void;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  setSelectedSite,
  selectedCamera,
  setSelectedCameraId,
}: LiveControlPanelProps) => {
  const { t } = useTranslationPrefix('live');

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

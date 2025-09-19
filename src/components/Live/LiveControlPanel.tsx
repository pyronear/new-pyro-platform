import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import CamerasMap from '../Dashboard/CamerasMap';
import type { SiteType } from './useDataSitesLive';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType | null;
  setSelectedSite: (newSite: SiteType | null) => void;
  selectedCameraId: number | null;
  setSelectedCameraId: (newCameraId: number | null) => void;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  setSelectedSite,
  selectedCameraId,
  setSelectedCameraId,
}: LiveControlPanelProps) => {
  const { t } = useTranslationPrefix('live');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSite(sites.find((s) => s.id == event.target.value) ?? null);
  };

  return (
    <Stack direction="column" p={2} spacing={1}>
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
          selectedCameraId={selectedCameraId}
          setSelectedCameraId={setSelectedCameraId}
        />
      </div>
      <CamerasMap cameras={selectedSite?.cameras ?? []} height="300px" />
    </Stack>
  );
};

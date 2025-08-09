import VideocamIcon from '@mui/icons-material/Videocam';
import {
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { CameraName } from '../Common/CameraName';
import CamerasMap from '../Dashboard/CamerasMap';
import type { SiteType } from './useDataLive';

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

      <List sx={{ maxHeight: '200px', overflow: 'auto' }}>
        {selectedSite?.cameras.map((camera) => (
          <ListItem disablePadding key={camera.id}>
            <ListItemButton
              selected={camera.id == selectedCameraId}
              onClick={() => setSelectedCameraId(camera.id)}
            >
              {camera.id == selectedCameraId && (
                <ListItemIcon>
                  <VideocamIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText inset={camera.id != selectedCameraId}>
                <CameraName
                  name={camera.name}
                  angle_of_view={camera.angle_of_view}
                />
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <CamerasMap cameras={selectedSite?.cameras ?? []} height="300px" />
    </Stack>
  );
};

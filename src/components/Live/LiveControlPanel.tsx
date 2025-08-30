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

import type { CameraFullInfosType } from '@/utils/camera';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { CameraName } from '../Common/CameraName';
import CamerasMap from '../Dashboard/CamerasMap';
import type { SiteType } from './useDataSitesLive';

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
              selected={camera.id == selectedCamera?.id}
              onClick={() => setSelectedCameraId(camera.id)}
            >
              {camera.id == selectedCamera?.id && (
                <ListItemIcon>
                  <VideocamIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText inset={camera.id != selectedCamera?.id}>
                <CameraName
                  name={camera.name}
                  angle_of_view={camera.angle_of_view}
                />
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <CamerasMap
        cameras={selectedCamera ? [selectedCamera] : []}
        height="300px"
      />
    </Stack>
  );
};

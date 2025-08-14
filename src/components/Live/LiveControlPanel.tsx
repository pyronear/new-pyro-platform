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

import type { CameraType } from '../../services/camera';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { CameraName } from '../Common/CameraName';
import type { SiteType } from './ControlAccessLiveContainer';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType | null;
  setSelectedSite: (newSite: SiteType | null) => void;
  selectedCamera: CameraType | null;
  setSelectedCamera: (newCamera: CameraType | null) => void;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  setSelectedSite,
  selectedCamera,
  setSelectedCamera,
}: LiveControlPanelProps) => {
  const { t } = useTranslationPrefix('live');
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSite(sites.find((s) => s.id == event.target.value) ?? null);
  };
  console.log(selectedSite);

  return (
    <Stack direction="column" p={2} spacing={1} alignItems="center">
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

      <List>
        {selectedSite?.cameras.map((c) => (
          <ListItem disablePadding key={c.id}>
            <ListItemButton
              selected={c.id == selectedCamera?.id}
              onClick={() => setSelectedCamera(c)}
            >
              {c.id == selectedCamera?.id && (
                <ListItemIcon>
                  <VideocamIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText inset={c.id != selectedCamera?.id}>
                <CameraName name={c.name} angle_of_view={c.angle_of_view} />
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

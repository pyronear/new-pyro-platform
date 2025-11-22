import LogoutIcon from '@mui/icons-material/Logout';
import {
  Button,
  Divider,
  Menu,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/context/useAuth';
import { usePreferences } from '@/context/usePreferences';

import { AlertVolumeToggle } from './AlertVolumeToggle';

interface PreferencesMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

export const PreferencesMenu: React.FC<PreferencesMenuProps> = ({
  anchorEl,
  onClose,
}) => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = usePreferences();
  const { logout } = useAuth();

  const handleAudioAlertsToggle = () => {
    updatePreferences({
      audio: { alertsEnabled: !preferences.audio.alertsEnabled },
    });
  };

  const handleMapBaseLayerChange = (
    _: React.MouseEvent<HTMLElement>,
    value: 'osm' | 'ign' | 'satellite' | null
  ) => {
    if (value !== null) {
      updatePreferences({ map: { baseLayer: value } });
    }
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography>{t('preferences.mapBaseLayer')}</Typography>
            <ToggleButtonGroup
              value={preferences.map.baseLayer}
              exclusive
              onChange={handleMapBaseLayerChange}
            >
              <ToggleButton value="osm">
                🗺️ {t('preferences.mapOsm')}
              </ToggleButton>
              <ToggleButton value="ign" disabled>
                🍄‍🟫 {t('preferences.mapIgn')}
              </ToggleButton>
              <ToggleButton value="satellite" disabled>
                🌌 {t('preferences.mapSatellite')}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography>{t('preferences.enableAudioAlerts')}</Typography>
            <AlertVolumeToggle
              isActive={preferences.audio.alertsEnabled}
              onToggle={handleAudioAlertsToggle}
            />
          </Stack>

          {
            <>
              <Divider />
              <Button
                onClick={logout}
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                fullWidth
              >
                {t('login.logout')}
              </Button>
            </>
          }
        </Stack>
      </Menu>
    </>
  );
};

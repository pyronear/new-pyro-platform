import CloseIcon from '@mui/icons-material/Close';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import TerrainIcon from '@mui/icons-material/Terrain';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { type BaseLayerType, useMapLayers } from '@/utils/useMapLayers';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { DfciGridOverlay } from './DfciGridOverlay';

interface LayerButtonProps {
  icon: React.ReactNode;
  label: string;
}

const LayerButton = ({ icon, label }: LayerButtonProps) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    width="100%"
    justifyContent="flex-start"
  >
    {icon}
    <Typography variant="body2">{label}</Typography>
  </Stack>
);

interface MapLayerControlProps {
  showDfciToggle?: boolean;
}

export const MapLayerControl = ({
  showDfciToggle = true,
}: MapLayerControlProps) => {
  const { t } = useTranslationPrefix('map');
  const { t: tPrefs } = useTranslationPrefix('preferences');
  const { baseLayer, updateBaseLayer } = useMapLayers();
  const [expanded, setExpanded] = useState(false);
  const [dfciEnabled, setDfciEnabled] = useState(false);

  const handleBaseLayerChange = (
    _: React.MouseEvent<HTMLElement>,
    value: BaseLayerType | null
  ) => {
    if (value !== null) {
      updateBaseLayer(value);
    }
  };

  return (
    <>
      <DfciGridOverlay visible={dfciEnabled} />

      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 50,
          zIndex: 1000,
        }}
      >
        {!expanded ? (
          <IconButton
            onClick={() => setExpanded(true)}
            aria-label={t('layerControl')}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <LayersIcon />
          </IconButton>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minWidth: 220,
              backgroundColor: 'white',
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4">{t('layerControl')}</Typography>
                <IconButton size="small" onClick={() => setExpanded(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {t('baseLayer')}
                </Typography>
                <ToggleButtonGroup
                  value={baseLayer}
                  exclusive
                  onChange={handleBaseLayerChange}
                  orientation="vertical"
                  fullWidth
                  size="small"
                >
                  <ToggleButton value="osm">
                    <LayerButton
                      icon={<MapIcon fontSize="small" />}
                      label={tPrefs('mapOsm')}
                    />
                  </ToggleButton>
                  <ToggleButton value="ign">
                    <LayerButton
                      icon={<TerrainIcon fontSize="small" />}
                      label={tPrefs('mapIgn')}
                    />
                  </ToggleButton>
                  <ToggleButton value="satellite">
                    <LayerButton
                      icon={<SatelliteAltIcon fontSize="small" />}
                      label={tPrefs('mapSatellite')}
                    />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {showDfciToggle && (
                <>
                  <Divider />
                  <Stack spacing={1} useFlexGap>
                    <Typography variant="caption" color="text.secondary">
                      {t('overlays')}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={dfciEnabled}
                          onChange={(e) => setDfciEnabled(e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Typography sx={{ m: 0 }} variant="body2">
                          {t('dfciGrid')}
                        </Typography>
                      }
                    />
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
        )}
      </Box>
    </>
  );
};

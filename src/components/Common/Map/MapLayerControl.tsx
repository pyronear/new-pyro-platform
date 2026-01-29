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
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      width="100%"
                      justifyContent="flex-start"
                    >
                      <MapIcon fontSize="small" />
                      <Typography variant="body2">
                        {tPrefs('mapOsm')}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="ign">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      width="100%"
                      justifyContent="flex-start"
                    >
                      <TerrainIcon fontSize="small" />
                      <Typography variant="body2">
                        {tPrefs('mapIgn')}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="satellite">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      width="100%"
                      justifyContent="flex-start"
                    >
                      <SatelliteAltIcon fontSize="small" />
                      <Typography variant="body2">
                        {tPrefs('mapSatellite')}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {showDfciToggle && (
                <>
                  <Divider />
                  <Stack spacing={1}>
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

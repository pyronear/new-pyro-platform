import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { BD_FORET_LEGEND_URL } from '@/utils/useMapLayers';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

/**
 * Floating legend for the BD Forêt overlay, shown in the bottom-left corner of
 * the map while the overlay is on. It stays visible when the layer control is
 * closed, and can be collapsed to its title bar.
 */
export const BdForetLegend = () => {
  const { t } = useTranslationPrefix('map');
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scrolling or clicking the legend must not zoom or pan the map underneath.
  useEffect(() => {
    if (!containerRef.current) return;
    L.DomEvent.disableScrollPropagation(containerRef.current);
    L.DomEvent.disableClickPropagation(containerRef.current);
  }, []);

  return (
    <Paper
      ref={containerRef}
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 1000,
        width: 250,
        maxWidth: 'calc(100% - 20px)',
        maxHeight: 'calc(100% - 80px)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        cursor: 'default',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 1.5, pr: 0.5, py: 0.5 }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ m: 0 }}>
          {t('bdForestLegend')}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={t(open ? 'hideLegend' : 'showLegend')}
          aria-expanded={open}
        >
          {open ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ExpandLessIcon fontSize="small" />
          )}
        </IconButton>
      </Stack>

      {open && (
        <>
          <Box sx={{ overflowY: 'auto', maxHeight: 260, px: 0.5 }}>
            <Box
              component="img"
              src={BD_FORET_LEGEND_URL}
              alt={t('bdForestLegend')}
              sx={{ display: 'block', width: '100%' }}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ m: 0, px: 1.5, py: 0.75, lineHeight: 1.3 }}
          >
            {t('bdForestDataAge')}
          </Typography>
        </>
      )}
    </Paper>
  );
};

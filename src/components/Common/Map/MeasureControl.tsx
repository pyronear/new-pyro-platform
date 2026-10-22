import CloseIcon from '@mui/icons-material/Close';
import StraightenIcon from '@mui/icons-material/Straighten';
import { Box, GlobalStyles, IconButton, useTheme } from '@mui/material';
import L, { type LatLng } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import {
  CircleMarker,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

const formatDistance = (meters: number, language: string) =>
  meters < 1000
    ? `${Math.round(meters).toLocaleString(language)} m`
    : `${(meters / 1000).toLocaleString(language, {
        maximumFractionDigits: meters < 10000 ? 2 : 1,
      })} km`;

const MEASURING_CLASS = 'measuring';

// Markers don't bubble their clicks to the map (they open their popup instead),
// so while measuring, interactive layers let the pointer through to the map.
const measuringStyles = {
  [`.leaflet-container.${MEASURING_CLASS} .leaflet-interactive`]: {
    pointerEvents: 'none !important',
  },
};
const GlobalMeasuringStyles = () => <GlobalStyles styles={measuringStyles} />;

interface MeasureToolProps {
  onExit: () => void;
}

// Mounted only while measurement mode is on, so its cleanup restores the map
// (double-click zoom, cursor, layer interactivity) as soon as the user leaves
// the mode.
const MeasureTool = ({ onExit }: MeasureToolProps) => {
  const theme = useTheme();
  const { i18n } = useTranslationPrefix('map');
  const map = useMap();
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [cursor, setCursor] = useState<LatLng | null>(null);

  useMapEvents({
    click: (e) => {
      // First click, or a click after a completed measurement: start a new one
      if (start === null || end !== null) {
        setStart(e.latlng);
        setEnd(null);
        setCursor(e.latlng);
      } else {
        setEnd(e.latlng);
      }
    },
    mousemove: (e) => {
      if (start !== null && end === null) {
        setCursor(e.latlng);
      }
    },
  });

  useEffect(() => {
    const container = map.getContainer();
    // Two quick clicks would otherwise zoom the map instead of placing points
    map.doubleClickZoom.disable();
    container.style.cursor = 'crosshair';
    L.DomUtil.addClass(container, MEASURING_CLASS);
    map.closePopup();

    // Capture phase on window so Escape leaves measurement mode before any
    // other Escape handler (e.g. AlertMap exiting fullscreen) sees it.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      map.doubleClickZoom.enable();
      container.style.cursor = '';
      L.DomUtil.removeClass(container, MEASURING_CLASS);
    };
  }, [map, onExit]);

  const target = end ?? cursor;
  if (start === null || target === null) {
    return null;
  }

  const color = theme.palette.primary.main;
  const pointStyle = {
    color,
    weight: 2,
    fillColor: 'white',
    fillOpacity: 1,
  };

  return (
    <>
      <Polyline
        positions={[start, target]}
        interactive={false}
        pathOptions={{
          color,
          weight: 3,
          // Dashed while the end point follows the mouse, solid once placed
          dashArray: end === null ? '6 6' : undefined,
        }}
      />
      <CircleMarker
        center={start}
        radius={4}
        interactive={false}
        pathOptions={pointStyle}
      />
      <CircleMarker
        center={target}
        radius={4}
        interactive={false}
        pathOptions={pointStyle}
      >
        <Tooltip permanent direction="top" offset={[0, -8]}>
          {formatDistance(start.distanceTo(target), i18n.language)}
        </Tooltip>
      </CircleMarker>
    </>
  );
};

export const MeasureControl = () => {
  const { t } = useTranslationPrefix('map');
  const [active, setActive] = useState(false);
  const exitMeasurement = useCallback(() => setActive(false), []);

  return (
    <>
      <GlobalMeasuringStyles />
      {active && <MeasureTool onExit={exitMeasurement} />}

      <Box
        // Keep clicks on the button from reaching the map (and placing a point)
        ref={(element: HTMLDivElement | null) => {
          if (element) L.DomEvent.disableClickPropagation(element);
        }}
        sx={{
          position: 'absolute',
          top: 60,
          right: 50,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => setActive((previous) => !previous)}
          aria-label={active ? t('stopMeasurement') : t('measureDistance')}
          aria-pressed={active}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          {active ? <CloseIcon color="error" /> : <StraightenIcon />}
        </IconButton>
      </Box>
    </>
  );
};

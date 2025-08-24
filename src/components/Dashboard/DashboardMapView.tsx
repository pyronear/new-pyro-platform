import { Grid, Stack } from '@mui/material';
import type {
  LatLngTuple,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import type { CameraType } from '../../services/camera';
import { useIsMobile } from '../../utils/useIsMobile';
import { CameraCard } from './CameraCard';
import CamerasMap from './CamerasMap';

interface ViewMapProps {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[];
}

export const DashboardMapView = ({ cameraList }: ViewMapProps) => {
  const isMobile = useIsMobile();
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  const markerRefs = useRef(new Map<number, LeafletMarker>());
  const cardRefs = useRef(new Map<number, HTMLDivElement>());

  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  useEffect(() => {
    const selectedCamera = cameraList.find(({ id }) => id === selectedCameraId);
    if (mapRef === null || selectedCamera === undefined) return;

    const coords: LatLngTuple = [selectedCamera.lat, selectedCamera.lon];
    const options = { duration: 0.4 };
    mapRef.flyTo(coords, mapRef.getZoom(), options);

    const marker = markerRefs.current.get(selectedCamera.id);
    if (marker !== undefined) marker.openPopup();
    const el = cardRefs.current.get(selectedCamera.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedCameraId, mapRef, cameraList]);

  return (
    <Stack direction={isMobile ? 'column-reverse' : 'row'} height="100%">
      <Grid
        size={!isMobile && 3}
        p={{ xs: 1, sm: 2 }}
        flex={1}
        sx={{
          overflowY: 'auto',
        }}
      >
        <Stack spacing={{ xs: 1, sm: 2 }} height={'100%'}>
          {cameraList.map((camera) => (
            <CameraCard
              key={camera.id}
              camera={camera}
              isHorizontal
              isSelected={camera.id === selectedCameraId}
              setSelected={() => setSelectedCameraId(camera.id)}
              ref={(el: HTMLDivElement | null) => {
                if (el) cardRefs.current.set(camera.id, el);
                else cardRefs.current.delete(camera.id);
              }}
            />
          ))}
        </Stack>
      </Grid>
      <Grid size={!isMobile && 9} p={{ xs: 1, sm: 2 }} flex={2}>
        {cameraList.length > 0 && (
          <CamerasMap
            cameras={cameraList}
            setMapRef={setMapRef}
            markerRefs={markerRefs}
            setSelectedCameraId={setSelectedCameraId}
          />
        )}
      </Grid>
    </Stack>
  );
};

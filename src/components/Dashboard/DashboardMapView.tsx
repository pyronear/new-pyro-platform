import { Grid, Stack } from '@mui/material';
import type {
  LatLngTuple,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import type { CameraType } from '../../services/camera';
import { useIsMobile } from '../../utils/useIsMobile';
import { CameraCard } from './CameraCard/CameraCard';
import CamerasMap from './CamerasMap';
import { MobileDashboardMapView } from './MobileDashboardMapView';

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

    // flyTo center of the map
    const coords: LatLngTuple = [selectedCamera.lat, selectedCamera.lon];
    const options = { duration: 0.4 };
    mapRef.flyTo(coords, mapRef.getZoom(), options);

    // Open marker of selected camera inside the map
    const marker = markerRefs.current.get(selectedCamera.id);
    if (marker !== undefined) marker.openPopup();

    // Scroll to selected camera card in the left pane
    const el = cardRefs.current.get(selectedCamera.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedCameraId, mapRef, cameraList]);

  if (isMobile) {
    return (
      <MobileDashboardMapView
        cameraList={cameraList}
        selectedCameraId={selectedCameraId}
        setMapRef={setMapRef}
        markerRefs={markerRefs}
        cardRefs={cardRefs}
        onSelectCamera={setSelectedCameraId}
      />
    );
  }

  return (
    <Stack direction="row" height="100%">
      <Grid p={{ xs: 1, sm: 2 }} flex={1} size={3} sx={{ overflowY: 'auto' }}>
        <Stack spacing={{ xs: 1, sm: 2 }} height={'100%'}>
          {cameraList.map((camera) => (
            <CameraCard
              key={camera.id}
              camera={camera}
              isSelectable
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
      <Grid p={{ xs: 1, sm: 2 }} flex={2} size={9}>
        {cameraList.length > 0 && (
          <CamerasMap
            cameras={cameraList}
            selectedCameraId={selectedCameraId}
            setMapRef={setMapRef}
            markerRefs={markerRefs}
            onClickOnMarker={setSelectedCameraId}
          />
        )}
      </Grid>
    </Stack>
  );
};

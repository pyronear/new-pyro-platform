import { Box, Grid, Stack } from '@mui/material';
import type {
  LatLngTuple,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import { type PointerEvent, useEffect, useMemo, useRef, useState } from 'react';

import type { CameraType } from '../../services/camera';
import { useIsMobile } from '../../utils/useIsMobile';
import { CameraCard } from './CameraCard/CameraCard';
import CamerasMap from './CamerasMap';

interface ViewMapProps {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[];
}

type MobileDrawerPosition = 'peek' | 'half' | 'full';

const MOBILE_DRAWER_PEEK_HEIGHT = 64;
const MOBILE_DRAWER_FULL_TOP_OFFSET = 48;

const getMobileDrawerSnapHeights = (containerHeight: number) => {
  const availableHeight = Math.max(containerHeight, 320);
  const peek = Math.min(MOBILE_DRAWER_PEEK_HEIGHT, availableHeight);
  const full = Math.max(peek, availableHeight - MOBILE_DRAWER_FULL_TOP_OFFSET);
  const half = Math.min(
    full,
    Math.max(peek, Math.round(availableHeight * 0.5))
  );

  return { peek, half, full };
};

export const DashboardMapView = ({ cameraList }: ViewMapProps) => {
  const isMobile = useIsMobile();
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  const mobileMapContainerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef(new Map<number, LeafletMarker>());
  const cardRefs = useRef(new Map<number, HTMLDivElement>());
  const drawerDragRef = useRef<{
    currentHeight: number;
    startHeight: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);
  const skipDrawerClickRef = useRef(false);

  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  const [mobileMapHeight, setMobileMapHeight] = useState(0);
  const [drawerPosition, setDrawerPosition] =
    useState<MobileDrawerPosition>('half');
  const mobileDrawerSnapHeights = useMemo(
    () => getMobileDrawerSnapHeights(mobileMapHeight),
    [mobileMapHeight]
  );
  const [mobileDrawerHeight, setMobileDrawerHeight] = useState(
    mobileDrawerSnapHeights.half
  );

  useEffect(() => {
    if (!isMobile || mobileMapContainerRef.current === null) return;

    const container = mobileMapContainerRef.current;
    const updateHeight = () => {
      setMobileMapHeight(container.clientHeight);
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setMobileDrawerHeight(mobileDrawerSnapHeights[drawerPosition]);
    }
  }, [drawerPosition, isMobile, mobileDrawerSnapHeights]);

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

  const selectCamera = (cameraId: number) => {
    setSelectedCameraId(cameraId);
    if (isMobile && drawerPosition === 'peek') {
      setDrawerPosition('half');
    }
  };

  const snapMobileDrawer = (height: number) => {
    const entries = Object.entries(mobileDrawerSnapHeights) as [
      MobileDrawerPosition,
      number,
    ][];
    const [closestPosition] = entries.reduce((closest, current) =>
      Math.abs(current[1] - height) < Math.abs(closest[1] - height)
        ? current
        : closest
    );

    setDrawerPosition(closestPosition);
  };

  const handleDrawerPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    drawerDragRef.current = {
      currentHeight: mobileDrawerHeight,
      startHeight: mobileDrawerHeight,
      startY: event.clientY,
      hasMoved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDrawerPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = drawerDragRef.current;
    if (drag === null) return;

    const distance = drag.startY - event.clientY;
    const nextHeight = Math.min(
      mobileDrawerSnapHeights.full,
      Math.max(mobileDrawerSnapHeights.peek, drag.startHeight + distance)
    );

    if (Math.abs(distance) > 4) {
      drag.hasMoved = true;
    }

    drag.currentHeight = nextHeight;
    setMobileDrawerHeight(nextHeight);
  };

  const handleDrawerPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = drawerDragRef.current;
    if (drag === null) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    drawerDragRef.current = null;
    skipDrawerClickRef.current = drag.hasMoved;
    snapMobileDrawer(drag.currentHeight);
  };

  const handleDrawerClick = () => {
    if (skipDrawerClickRef.current) {
      skipDrawerClickRef.current = false;
      return;
    }

    const nextPosition: Record<MobileDrawerPosition, MobileDrawerPosition> = {
      peek: 'half',
      half: 'full',
      full: 'peek',
    };
    setDrawerPosition(nextPosition[drawerPosition]);
  };

  if (isMobile) {
    return (
      <Box p={1} height="100%">
        <Box
          ref={mobileMapContainerRef}
          height="100%"
          overflow="hidden"
          position="relative"
        >
          {cameraList.length > 0 && (
            <CamerasMap
              cameras={cameraList}
              selectedCameraId={selectedCameraId}
              setMapRef={setMapRef}
              markerRefs={markerRefs}
              onClickOnMarker={selectCamera}
            />
          )}
          <Box
            sx={(theme) => ({
              bgcolor: theme.palette.background.paper,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              bottom: 0,
              boxShadow: theme.shadows[8],
              display: 'flex',
              flexDirection: 'column',
              height: mobileDrawerHeight,
              left: 0,
              overflow: 'hidden',
              position: 'absolute',
              right: 0,
              transition:
                drawerDragRef.current === null
                  ? theme.transitions.create('height', {
                      duration: theme.transitions.duration.shortest,
                    })
                  : undefined,
              zIndex: 1000,
            })}
          >
            <Box
              aria-label="Resize camera list"
              component="button"
              onClick={handleDrawerClick}
              onPointerCancel={handleDrawerPointerUp}
              onPointerDown={handleDrawerPointerDown}
              onPointerMove={handleDrawerPointerMove}
              onPointerUp={handleDrawerPointerUp}
              sx={(theme) => ({
                all: 'unset',
                alignItems: 'center',
                boxSizing: 'border-box',
                cursor: 'grab',
                display: 'flex',
                flexShrink: 0,
                height: MOBILE_DRAWER_PEEK_HEIGHT,
                justifyContent: 'center',
                touchAction: 'none',
                '&:active': {
                  cursor: 'grabbing',
                },
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: -4,
                },
              })}
              type="button"
            >
              <Box
                sx={(theme) => ({
                  bgcolor: theme.palette.text.disabled,
                  borderRadius: 999,
                  height: 4,
                  width: 48,
                })}
              />
            </Box>
            <Box flex={1} overflow="auto" px={1} pb={1}>
              <Stack spacing={1}>
                {cameraList.map((camera) => (
                  <CameraCard
                    key={camera.id}
                    camera={camera}
                    isSelectable
                    isSelected={camera.id === selectedCameraId}
                    setSelected={() => selectCamera(camera.id)}
                    ref={(el: HTMLDivElement | null) => {
                      if (el) cardRefs.current.set(camera.id, el);
                      else cardRefs.current.delete(camera.id);
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
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
              setSelected={() => selectCamera(camera.id)}
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
            onClickOnMarker={selectCamera}
          />
        )}
      </Grid>
    </Stack>
  );
};

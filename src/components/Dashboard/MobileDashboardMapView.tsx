import { Box, Stack } from '@mui/material';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { type PointerEvent, type RefObject, useRef, useState } from 'react';

import type { CameraType } from '../../services/camera';
import { CameraCard } from './CameraCard/CameraCard';
import CamerasMap from './CamerasMap';

interface MobileDashboardMapViewProps {
  cameraList: CameraType[];
  selectedCameraId: number | null;
  setMapRef: (map: LeafletMap) => void;
  markerRefs: RefObject<Map<number, LeafletMarker>>;
  cardRefs: RefObject<Map<number, HTMLDivElement>>;
  onSelectCamera: (cameraId: number) => void;
}

type MobileDrawerPosition = 'peek' | 'half' | 'full';

type DrawerSnapHeights = Record<MobileDrawerPosition, number>;

const MOBILE_DRAWER_PEEK_HEIGHT = 64;
const MOBILE_DRAWER_FULL_TOP_OFFSET = 48;

const drawerHeights: Record<MobileDrawerPosition, string> = {
  peek: `${MOBILE_DRAWER_PEEK_HEIGHT}px`,
  half: '50%',
  full: `calc(100% - ${MOBILE_DRAWER_FULL_TOP_OFFSET}px)`,
};

const getDrawerSnapHeights = (containerHeight: number): DrawerSnapHeights => {
  const peek = Math.min(MOBILE_DRAWER_PEEK_HEIGHT, containerHeight);
  const full = Math.max(peek, containerHeight - MOBILE_DRAWER_FULL_TOP_OFFSET);
  const half = Math.min(
    full,
    Math.max(peek, Math.round(containerHeight * 0.5))
  );

  return { peek, half, full };
};

const getClosestDrawerPosition = (
  height: number,
  snapHeights: DrawerSnapHeights
): MobileDrawerPosition =>
  (Object.entries(snapHeights) as [MobileDrawerPosition, number][]).reduce(
    (closest, current) =>
      Math.abs(current[1] - height) < Math.abs(closest[1] - height)
        ? current
        : closest
  )[0];

export const MobileDashboardMapView = ({
  cameraList,
  selectedCameraId,
  setMapRef,
  markerRefs,
  cardRefs,
  onSelectCamera,
}: MobileDashboardMapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const drawerDragRef = useRef<{
    currentHeight: number;
    startHeight: number;
    startY: number;
    snapHeights: DrawerSnapHeights;
    hasMoved: boolean;
  } | null>(null);
  const skipDrawerClickRef = useRef(false);
  const [drawerPosition, setDrawerPosition] =
    useState<MobileDrawerPosition>('half');
  const [dragHeight, setDragHeight] = useState<number | null>(null);

  const selectCamera = (cameraId: number) => {
    onSelectCamera(cameraId);
    if (drawerPosition === 'peek') setDrawerPosition('half');
  };

  const handleDrawerPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const containerHeight = mapContainerRef.current?.clientHeight ?? 0;
    const snapHeights = getDrawerSnapHeights(containerHeight);
    const startHeight = snapHeights[drawerPosition];

    drawerDragRef.current = {
      currentHeight: startHeight,
      startHeight,
      startY: event.clientY,
      snapHeights,
      hasMoved: false,
    };
    setDragHeight(startHeight);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDrawerPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = drawerDragRef.current;
    if (drag === null) return;

    const distance = drag.startY - event.clientY;
    const nextHeight = Math.min(
      drag.snapHeights.full,
      Math.max(drag.snapHeights.peek, drag.startHeight + distance)
    );

    if (Math.abs(distance) > 4) drag.hasMoved = true;

    drag.currentHeight = nextHeight;
    setDragHeight(nextHeight);
  };

  const finishDrawerDrag = (
    event: PointerEvent<HTMLButtonElement>,
    skipNextClick: boolean
  ) => {
    const drag = drawerDragRef.current;
    if (drag === null) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    drawerDragRef.current = null;
    skipDrawerClickRef.current = skipNextClick && drag.hasMoved;
    setDrawerPosition(
      getClosestDrawerPosition(drag.currentHeight, drag.snapHeights)
    );
    setDragHeight(null);
  };

  const handleDrawerPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    finishDrawerDrag(event, true);
  };

  const handleDrawerPointerCancel = (
    event: PointerEvent<HTMLButtonElement>
  ) => {
    finishDrawerDrag(event, false);
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

  return (
    <Box p={1} height="100%">
      <Box
        ref={mapContainerRef}
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
            height: dragHeight ?? drawerHeights[drawerPosition],
            left: 0,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            transition:
              dragHeight === null
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
            onPointerCancel={handleDrawerPointerCancel}
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
};

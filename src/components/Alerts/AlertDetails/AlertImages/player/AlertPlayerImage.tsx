import { useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MiniMap,
  type ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

import {
  type BoundingBox,
  parseBboxCoords,
  parseDetectionBox,
} from '@/utils/detections.ts';

import { useAlertPlayer } from '../context/useAlertPlayer';

interface AlertPlayerImageProps {
  displayBbox: boolean;
  displayCrop: boolean;
}

const MINIMUM_ZOOM_AMOUNT_TO_DISPLAY_MINIMAP = 1.4;

export const AlertPlayerImage = ({
  displayBbox,
  displayCrop,
}: AlertPlayerImageProps) => {
  const { sequenceId, selectedDetection } = useAlertPlayer();

  const theme = useTheme();
  const wrapperRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
  const shouldResetTransform = useRef(false);

  // Place the crop preview opposite the detection so it never sits on top of it
  const cropOnLeft = useMemo(() => {
    const coords = parseBboxCoords(selectedDetection.bbox);
    if (!coords) {
      return true;
    }
    const centerX = (coords.x1 + coords.x2) / 2;
    return centerX > 0.5;
  }, [selectedDetection.bbox]);

  // Reset image position & zoom whenever the user switches alert
  // This reset will happen once the new image has loaded to avoid glitchy looking behaviour
  useEffect(() => {
    shouldResetTransform.current = true;
  }, [sequenceId]);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const handleImageLoad = () => {
    if (imgRef.current) {
      setCurrentBox(parseDetectionBox(selectedDetection));
    }
    if (shouldResetTransform.current) {
      if (wrapperRef.current !== null) {
        wrapperRef.current.resetTransform(0);
        shouldResetTransform.current = false;
      }
    }
  };

  // Do not display the mini map if the user is not zoomed in enough
  const [shouldDisplayMiniMap, setShouldDisplayMiniMap] = useState(false);
  const updateMiniMapDisplay = () => {
    setShouldDisplayMiniMap(
      wrapperRef.current !== null &&
        wrapperRef.current.instance.transformState.scale >
          MINIMUM_ZOOM_AMOUNT_TO_DISPLAY_MINIMAP
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        justifyItems: 'center',
      }}
    >
      <TransformWrapper
        limitToBounds
        centerZoomedOut
        alignmentAnimation={{
          sizeX: 0,
          sizeY: 0,
        }}
        ref={wrapperRef}
        onTransformed={updateMiniMapDisplay}
      >
        {shouldDisplayMiniMap && (
          <div
            style={{
              position: 'absolute',
              right: 20,
              top: 20,
            }}
          >
            <MiniMap
              width={100}
              height={100}
              borderColor={theme.palette.secondary.dark}
            >
              <img
                src={selectedDetection.url}
                style={{
                  maxWidth: '100%',
                  opacity: 0.5,
                }}
              />
            </MiniMap>
          </div>
        )}

        {displayCrop && selectedDetection.crop_url && (
          <img
            src={selectedDetection.crop_url}
            alt=""
            style={{
              position: 'absolute',
              bottom: 20,
              ...(cropOnLeft ? { left: 20 } : { right: 20 }),
              width: 150,
              zIndex: 2,
              border: `2px solid ${theme.palette.secondary.dark}`,
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
              backgroundColor: theme.palette.background.paper,
            }}
          />
        )}

        <TransformComponent>
          <img
            ref={imgRef}
            src={selectedDetection.url}
            style={{ maxWidth: '100%', maxHeight: '60vh' }}
            onLoad={handleImageLoad}
          />
          {displayBbox && currentBox && (
            <div
              style={{
                position: 'absolute',
                ...currentBox,
                border: `2px solid ${theme.palette.error.main}`,
                borderRadius: '2px',
                boxSizing: 'content-box',
              }}
            />
          )}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

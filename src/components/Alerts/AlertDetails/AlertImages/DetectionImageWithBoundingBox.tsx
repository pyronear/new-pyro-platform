import { useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  MiniMap,
  type ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

import type { DetectionType } from '@//services/alerts';

const MINIMUM_ZOOM_AMOUNT_TO_DISPLAY_MINIMAP = 1.4;

const parseDetectionBox = (
  detection: DetectionType | null
): BoundingBox | null => {
  if (detection === null) {
    return null;
  }

  const match = /\(([^)]+)\)/.exec(detection.bboxes);
  if (!match) {
    return null;
  }

  const [x1, y1, x2, y2] = match[1].split(',').map(parseFloat);
  return {
    left: `${100 * x1}%`,
    top: `${100 * y1}%`,
    width: `${100 * (x2 - x1)}%`,
    height: `${100 * (y2 - y1)}%`,
  };
};

interface BoundingBox {
  left: string;
  top: string;
  width: string;
  height: string;
}

interface DetectionImageWithBoundingBoxProps {
  displayBbox: boolean;
  selectedDetection: DetectionType;
  sequenceId: number;
}

export const DetectionImageWithBoundingBox = ({
  displayBbox,
  selectedDetection,
  sequenceId,
}: DetectionImageWithBoundingBoxProps) => {
  const theme = useTheme();
  const wrapperRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
  const shouldResetTransform = useRef(false);

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

        <TransformComponent>
          <img
            ref={imgRef}
            src={selectedDetection.url}
            style={{ maxWidth: '100%' }}
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

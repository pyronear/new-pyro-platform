import { useCallback, useRef, useState } from 'react';

import type { DetectionType } from '../../../services/alerts';

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
  selectedDetection: DetectionType;
  sequenceId: number;
}

export const DetectionImageWithBoundingBox = ({
  selectedDetection,
  sequenceId,
}: DetectionImageWithBoundingBoxProps) => {
  const theme = useTheme();
  const wrapperRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
  const [shouldResetTransform, setShouldResetTransform] = useState(false);

  // Reset image position & zoom whenever the user switches alert
  // This reset will happen once the new image has loaded to avoid glitchy looking behaviour
  useEffect(() => {
    setShouldResetTransform(true);
  }, [sequenceId]);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const handleImageLoad = () => {
    if (imgRef.current) {
      setCurrentBox(parseDetectionBox(selectedDetection));
    }
    if (shouldResetTransform) {
      if (wrapperRef.current !== null) {
        wrapperRef.current.resetTransform(0);
        setShouldResetTransform(false);
      }
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imgRef}
        src={selectedDetection.url}
        style={{ maxWidth: '100%' }}
        onLoad={handleImageLoad}
      />
      {currentBox && (
        <div
          style={{
            position: 'absolute',
            ...currentBox,
            border: '2px solid red',
            boxSizing: 'content-box',
          }}
        />
      )}
    </div>
  );
};

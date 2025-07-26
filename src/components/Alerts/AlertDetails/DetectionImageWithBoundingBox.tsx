import { useCallback, useRef, useState } from 'react';

import type { DetectionType } from '../../../services/alerts';

interface BoundingBox {
  left: string;
  top: string;
  width: string;
  height: string;
}

interface DetectionImageWithBoundingBoxProps {
  selectedDetection: DetectionType;
}

export const DetectionImageWithBoundingBox = ({
  selectedDetection,
}: DetectionImageWithBoundingBoxProps) => {
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);

  const parseDetectionBox = useCallback(
    (detection: DetectionType | null): BoundingBox | null => {
      if (detection === null) return null;
      const match = /\(([^)]+)\)/.exec(detection.bboxes);
      if (!match) return null;

      const [x1, y1, x2, y2] = match[1].split(',').map(parseFloat);
      return {
        left: `${100 * x1}%`,
        top: `${100 * y1}%`,
        width: `${100 * (x2 - x1)}%`,
        height: `${100 * (y2 - y1)}%`,
      };
    },
    []
  );

  const imgRef = useRef<HTMLImageElement | null>(null);
  const handleImageLoad = () => {
    if (imgRef.current) {
      setCurrentBox(parseDetectionBox(selectedDetection));
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

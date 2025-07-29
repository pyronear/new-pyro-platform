import type { DebouncedFuncLeading } from 'lodash';
import throttle from 'lodash/throttle';
import {
  type MouseEventHandler,
  useCallback,
  useRef,
  useState,
  type WheelEventHandler,
} from 'react';

import type { DetectionType } from '../../../services/alerts';

interface BoundingBox {
  left: string;
  top: string;
  width: string;
  height: string;
}

interface DetectionImageWithBoundingBoxProps {
  selectedDetection: DetectionType;
  displayBoundingBox: boolean;
}

export const DetectionImageWithBoundingBox = ({
  selectedDetection,
  displayBoundingBox,
}: DetectionImageWithBoundingBoxProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentBoundingBox, setCurrentBoundingBox] =
    useState<BoundingBox | null>(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [originPosition, setOriginPosition] = useState({ top: 0, left: 0 });
  const [currentPosition, setCurrentPosition] = useState({ top: 0, left: 0 });
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });

  const startDrag: MouseEventHandler = (e) => {
    e.preventDefault();
    if (imgContainerRef.current === null) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    setDragging(true);
    setDragOrigin({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCurrentPosition(originPosition);
    // console.log('START:', {
    //   x: e.clientX - rect.left,
    //   y: e.clientY - rect.top,
    //   e,
    //   rect,
    // });
  };

  const stopDrag = () => {
    setDragging(false);
    setOriginPosition(currentPosition);
  };

  const onDrag: DebouncedFuncLeading<MouseEventHandler> = throttle((e) => {
    if (!dragging || imgContainerRef.current === null) return;

    const rect = imgContainerRef.current.getBoundingClientRect();
    const newLeft =
      originPosition.left + (e.clientX - rect.left - dragOrigin.x);
    const newTop = originPosition.top + (e.clientY - rect.top - dragOrigin.y);

    setCurrentPosition({
      left: newLeft,
      top: newTop,
    });
    // console.log({
    //   currentScale,
    //   left: newLeft,
    //   top: newTop,
    //   rectL: rect.left,
    //   rectT: rect.top,
    // });
  }, 200);

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

  const throttledWheel = useRef(
    throttle(
      (
        e: WheelEvent & { wheelDelta: number },
        imgContainer: HTMLDivElement
      ) => {
        // const rect = imgContainer.getBoundingClientRect();
        // const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top;
        // console.log(
        //   `Wheel on image at x: ${x}/${rect.width}, y: ${y}/${rect.height}`,
        //   {
        //     delta: e.wheelDelta,
        //     e,
        //   }
        // );
        if (e.deltaY < 0) {
          setCurrentScale((scale) => scale * 1.5);
        } else {
          setCurrentScale((scale) => Math.max(1, scale / 1.5));
        }
      },
      30,
      { trailing: false, leading: true }
    )
  );

  const handleWheel: WheelEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // @ts-expect-error ozihfgzeo ghzo^ghz^oeig
    throttledWheel.current(e, imgContainerRef.current);
  };

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (img === null) return;

    setCurrentBoundingBox(parseDetectionBox(selectedDetection));
  };

  return (
    <div
      ref={imgContainerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onWheel={handleWheel}
    >
      <img
        ref={imgRef}
        src={selectedDetection.url}
        style={{
          maxWidth: '100%',
          position: 'relative',
          transform: `scale(${currentScale})`,
          transformOrigin: 'top left',
          left: currentPosition.left,
          top: currentPosition.top,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        onLoad={handleImageLoad}
      />
      {currentBoundingBox && displayBoundingBox && (
        <div
          style={{
            position: 'absolute',
            ...currentBoundingBox,
            border: '2px solid red',
            boxSizing: 'content-box',
          }}
        />
      )}
    </div>
  );
};

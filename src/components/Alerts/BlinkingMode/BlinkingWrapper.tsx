import { type ReactNode, useEffect, useState } from 'react';

import { BlinkOverlay } from './BlinkOverlay';

interface BlinkingWrapperProps {
  hasAlert: boolean;
  children: (onClick: () => void) => ReactNode;
}

export const BlinkingWrapper = ({
  hasAlert,
  children,
}: BlinkingWrapperProps) => {
  const [isBlinkingModeEnabled, setIsBlinkingModeEnabled] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsBlinkingModeEnabled(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {children(() => setIsBlinkingModeEnabled(!isBlinkingModeEnabled))}
      {isBlinkingModeEnabled && (
        <BlinkOverlay
          closeOverlay={() => setIsBlinkingModeEnabled(false)}
          hasAlert={hasAlert}
        />
      )}
    </>
  );
};

import { useCallback, useEffect, useState } from 'react';

const TIME_DISPLAY_TOOLTIP_IN_MS = 1000;

/**
 * Manages a controlled tooltip that opens on demand and auto-hides
 * after TIME_DISPLAY_TOOLTIP_IN_MS. Useful for click-feedback tooltips
 * (e.g. "copied to clipboard").
 */
export const useTransientTooltip = () => {
  const [open, setOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const show = useCallback(() => {
    setOpen(true);
    setTimeoutId(
      window.setTimeout(() => setOpen(false), TIME_DISPLAY_TOOLTIP_IN_MS)
    );
  }, []);

  const tooltipProps = {
    open,
    onClose: () => setOpen(false),
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true,
  };

  return { show, tooltipProps };
};

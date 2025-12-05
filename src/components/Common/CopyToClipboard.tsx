import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface props {
  textToCopy: string;
}

export const CopyToClipboard = (props: props) => {
  const { textToCopy } = props;
  const [openTooltip, setOpenTooltip] = useState(false);
  const [timeoutTooltip, setTimeoutTooltip] = useState<number | null>(null);
  const { t } = useTranslationPrefix('alerts');

  useEffect(() => {
    return () => {
      if (timeoutTooltip) {
        clearTimeout(timeoutTooltip);
      }
    };
  }, [timeoutTooltip]);

  async function handleCopy() {
    setOpenTooltip(true);
    setTimeoutTooltip(window.setTimeout(() => setOpenTooltip(false), 1000));
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }
  return (
    <Tooltip
      onClose={() => setOpenTooltip(false)}
      open={openTooltip}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement="top-end"
      title={t('copyText')}
    >
      <IconButton onClick={() => void handleCopy()}>
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';

import { useTransientTooltip } from '@/utils/useTransientTooltip';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface props {
  textToCopy: string;
}

export const CopyToClipboard = (props: props) => {
  const { textToCopy } = props;
  const { t } = useTranslationPrefix('alerts');
  const { show, tooltipProps } = useTransientTooltip();

  async function handleCopy() {
    show();
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  return (
    <Tooltip {...tooltipProps} placement="top-end" title={t('copyText')}>
      <IconButton onClick={() => void handleCopy()}>
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

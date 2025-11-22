import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';

interface props {
  textToCopy: string;
}

export const CopyToClipboard = (props: props) => {
  const { textToCopy } = props;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }
  return (
    <IconButton onClick={() => void handleCopy()}>
      <ContentCopyIcon fontSize="small" />
    </IconButton>
  );
};

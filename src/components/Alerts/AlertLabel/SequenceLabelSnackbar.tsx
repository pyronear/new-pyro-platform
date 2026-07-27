import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { SNACKBAR_AUTO_HIDE_DURATION_MS } from '@/utils/snackbar';

interface SequenceLabelSnackbarProps {
  open: boolean;
  handleClose: () => void;
  isSuccess: boolean | null;
  message: string;
}

export const SequenceLabelSnackbar = ({
  open,
  handleClose,
  isSuccess,
  message,
}: SequenceLabelSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION_MS}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={isSuccess ? 'success' : 'error'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

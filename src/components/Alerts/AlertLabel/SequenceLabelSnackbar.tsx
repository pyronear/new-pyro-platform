import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface SequenceLabelSnackbarProps {
  open: boolean;
  handleClose: () => void;
  isSuccess: boolean | null;
  message: string;
}

const DURATION_SNACKBAR_MS = 5000;

export const SequenceLabelSnackbar = ({
  open,
  handleClose,
  isSuccess,
  message,
}: SequenceLabelSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={DURATION_SNACKBAR_MS}
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

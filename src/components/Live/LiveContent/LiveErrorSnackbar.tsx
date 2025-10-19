import { Alert, Snackbar } from '@mui/material';

import { useActionsOnCamera } from '../context/useActionsOnCamera';

const DURATION_SNACKBAR_IN_MS = 5000;

export const LiveErrorSnackbar = () => {
  const { errorStreamingAction, resetErrorOnAction } = useActionsOnCamera();
  return (
    <Snackbar
      open={!!errorStreamingAction}
      autoHideDuration={DURATION_SNACKBAR_IN_MS}
      onClose={resetErrorOnAction}
    >
      <Alert
        onClose={resetErrorOnAction}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {errorStreamingAction}
      </Alert>
    </Snackbar>
  );
};

export default LiveErrorSnackbar;

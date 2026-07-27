import { Alert, Snackbar } from '@mui/material';

import { SNACKBAR_AUTO_HIDE_DURATION_MS } from '@/utils/snackbar';

import { useActionsOnCamera } from '../context/useActionsOnCamera';

export const LiveErrorSnackbar = () => {
  const { errorStreamingAction, resetErrorOnAction } = useActionsOnCamera();
  return (
    <Snackbar
      open={!!errorStreamingAction}
      autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION_MS}
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

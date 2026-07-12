import LinkOffIcon from '@mui/icons-material/LinkOff';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { unmatchSequenceFromAlert } from '@/services/alerts';
import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface SequenceUnmatchContainerProps {
  alert: AlertType;
  sequence: SequenceWithCameraInfoType;
  invalidateAndRefreshData: () => void;
}

const DURATION_SNACKBAR_MS = 5000;

export const SequenceUnmatchContainer = ({
  alert,
  sequence,
  invalidateAndRefreshData,
}: SequenceUnmatchContainerProps) => {
  const { t } = useTranslationPrefix('alerts');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<
    'success' | 'error' | null
  >(null);

  const unmatchMutation = useMutation({
    mutationFn: async () => {
      const isUnmatched = await unmatchSequenceFromAlert(sequence.id, alert.id);

      if (!isUnmatched) {
        throw new Error('INVALID_API_RESPONSE');
      }
    },
    onSuccess: () => {
      invalidateAndRefreshData();
      setIsDialogOpen(false);
      setSnackbarStatus('success');
    },
    onError: () => {
      setSnackbarStatus('error');
    },
  });

  if (alert.sequences.length <= 1) {
    return null;
  }

  const cameraName = sequence.camera?.name ?? t('defaultCameraName');
  const isPending = unmatchMutation.isPending;
  const closeDialog = () => {
    if (!isPending) {
      setIsDialogOpen(false);
    }
  };
  const closeSnackbar = () => setSnackbarStatus(null);

  return (
    <>
      <Button
        color="error"
        variant="outlined"
        startIcon={<LinkOffIcon />}
        onClick={() => setIsDialogOpen(true)}
      >
        {t('unmatch.button')}
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        disableEscapeKeyDown={isPending}
      >
        <DialogTitle>{t('unmatch.title', { cameraName })}</DialogTitle>
        <DialogContent dividers>
          <Typography>{t('unmatch.description')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={isPending}>
            {t('unmatch.buttonCancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => unmatchMutation.mutate()}
            disabled={isPending}
          >
            {t(isPending ? 'unmatch.buttonLoading' : 'unmatch.buttonConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarStatus !== null}
        autoHideDuration={DURATION_SNACKBAR_MS}
        onClose={closeSnackbar}
      >
        <Alert
          severity={snackbarStatus ?? 'error'}
          variant="filled"
          onClose={closeSnackbar}
          sx={{ width: '100%' }}
        >
          {t(
            snackbarStatus === 'success' ? 'unmatch.success' : 'unmatch.error'
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

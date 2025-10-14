import { Alert, Dialog, DialogContent, Snackbar } from '@mui/material';
import { type ReactNode, useState } from 'react';

import type { SequenceWithCameraInfoType } from '@/utils/alerts';

import { useStreamingActions } from './hooks/useStreamingActions';
import { LiveContainer } from './LiveContainer';

interface ModalLiveWrapperProps {
  cameraName: string;
  sequence?: SequenceWithCameraInfoType;
  children: (onClick: () => void) => ReactNode;
}

const DURATION_SNACKBAR_IN_MS = 5000;

export const ModalLiveWrapper = ({
  cameraName,
  sequence,
  children,
}: ModalLiveWrapperProps) => {
  const [openLive, setOpenLive] = useState(false);

  // Created here to keep the queue intact when the modal is closed
  const {
    addStreamingAction,
    isStreamingTimeout,
    resetErrorOnAction,
    errorStreamingAction,
    statusStreamingVideo,
  } = useStreamingActions();

  const handleClose = (
    _event: never,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
    // To prevent from closing the dialog by clicking on the backdrop (= background around the dialog)
    if (reason !== 'backdropClick') {
      setOpenLive(false);
    }
  };
  const handleOpen = () => setOpenLive(true);

  return (
    <>
      {children(handleOpen)}
      <Dialog open={openLive} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent
          sx={{
            padding: 0,
            minHeight: '90vh',
            '& > .MuiStack-root': {
              minHeight: '90vh',
            },
          }}
        >
          <LiveContainer
            onClose={() => setOpenLive(false)}
            cameraName={cameraName}
            sequence={sequence}
            addStreamingAction={addStreamingAction}
            statusStreamingVideo={statusStreamingVideo}
            isStreamingTimeout={isStreamingTimeout}
          />
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
        </DialogContent>
      </Dialog>
    </>
  );
};

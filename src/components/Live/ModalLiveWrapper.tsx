import { Dialog, DialogContent } from '@mui/material';
import { type ReactNode, useState } from 'react';

import { useStreamingVideo } from './hooks/useStreamingVideo';
import { LiveContainer } from './LiveContainer';

interface ModalLiveWrapperProps {
  cameraName: string;
  children: (onClick: () => void) => ReactNode;
}

export const ModalLiveWrapper = ({
  cameraName,
  children,
}: ModalLiveWrapperProps) => {
  const [openLive, setOpenLive] = useState(false);
  // Created here to keep the queue intact when the modal is closed
  const { startStreamingVideo, stopStreamingVideo, statusStreamingVideo } =
    useStreamingVideo();

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
            targetCameraName={cameraName}
            startStreamingVideo={startStreamingVideo}
            stopStreamingVideo={stopStreamingVideo}
            statusStreamingVideo={statusStreamingVideo}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

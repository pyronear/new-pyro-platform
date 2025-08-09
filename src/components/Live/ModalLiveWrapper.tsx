import { Dialog, DialogContent } from '@mui/material';
import { type ReactNode, useState } from 'react';

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

  const handleClose = (
    _event: never,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
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
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

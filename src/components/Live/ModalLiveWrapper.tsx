import { Dialog, Stack } from '@mui/material';
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

  const handleClose = () => setOpenLive(false);
  const handleOpen = () => setOpenLive(true);

  return (
    <>
      {children(handleOpen)}
      <Dialog open={openLive} onClose={handleClose} maxWidth="lg" fullWidth>
        <Stack
          sx={{
            minHeight: '50vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LiveContainer onClose={handleClose} targetCameraName={cameraName} />
        </Stack>
      </Dialog>
    </>
  );
};

import { Dialog, DialogContent, useTheme } from '@mui/material';
import { type ReactNode, useState } from 'react';

import type { AlertType } from '@/utils/alerts';

import { ActionsOnCameraContextProvider } from './context/ActionsOnCameraProvider';
import { LiveContainer } from './LiveContainer';

interface ModalLiveWrapperProps {
  cameraName: string;
  alert?: AlertType;
  children: (onClick: () => void) => ReactNode;
}

export const ModalLiveWrapper = ({
  cameraName,
  alert,
  children,
}: ModalLiveWrapperProps) => {
  const [openLive, setOpenLive] = useState(false);
  const theme = useTheme();

  // Created here to keep the queue intact when the modal is closed

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
      <ActionsOnCameraContextProvider>
        <Dialog
          open={openLive}
          onClose={handleClose}
          fullScreen
          sx={{
            '.MuiDialog-paper': {
              background: theme.palette.background.default,
            },
          }}
        >
          <DialogContent sx={{ padding: 0 }}>
            <LiveContainer
              onClose={() => setOpenLive(false)}
              cameraName={cameraName}
              alert={alert}
            />
          </DialogContent>
        </Dialog>
      </ActionsOnCameraContextProvider>
    </>
  );
};

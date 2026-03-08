import { type ReactNode, useState } from 'react';

import type { CameraType } from '@/services/camera';

import { DashboardOcclusionMaskModal } from './DashboardOcclusionMaskModal';

interface ModalOcclusionMaskWrapperProps {
  camera: CameraType;
  children: (onClick: () => void) => ReactNode;
}

export const ModalOcclusionMaskWrapper = ({
  camera,
  children,
}: ModalOcclusionMaskWrapperProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children(() => setOpen(true))}
      <DashboardOcclusionMaskModal
        open={open}
        onClose={() => setOpen(false)}
        camera={camera}
      />
    </>
  );
};

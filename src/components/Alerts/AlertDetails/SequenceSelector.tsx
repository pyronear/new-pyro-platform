import CachedIcon from '@mui/icons-material/Cached';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Popover } from '@mui/material';
import { type Dispatch, type SetStateAction, useState } from 'react';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface SequenceSelectorProps {
  sequences: SequenceWithCameraInfoType[];
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: Dispatch<
    SetStateAction<SequenceWithCameraInfoType | null>
  >;
}

export const SequenceSelector = ({
  selectedSequence,
  sequences,
  setSelectedSequence,
}: SequenceSelectorProps) => {
  const { t } = useTranslationPrefix('alerts');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="text"
        onClick={handleClick}
        color="secondary"
        startIcon={<CachedIcon />}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        {t('buttonChangeSequence')}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <CamerasListSelectable
          cameras={sequences
            .map((sequence) => sequence.camera)
            .filter((cameraNullable) => !!cameraNullable)}
          selectedCameraId={selectedSequence.camera?.id ?? null}
          setSelectedCameraId={(newCameraId: number) => {
            const newSelectedSequence = sequences.find(
              (sequence) => sequence.camera?.id === newCameraId
            );
            if (newSelectedSequence) {
              setSelectedSequence(newSelectedSequence);
            }
          }}
        />
      </Popover>
    </>
  );
};

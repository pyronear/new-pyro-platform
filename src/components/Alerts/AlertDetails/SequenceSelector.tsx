import CachedIcon from '@mui/icons-material/Cached';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, List, Popover } from '@mui/material';
import { type Dispatch, type SetStateAction, useState } from 'react';

import { CameraName } from '@/components/Common/Camera/CameraName';
import SelectableItemList from '@/components/Common/Camera/SelectableItemList';
import {
  type AlertType,
  getSequenceBySequenceId,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface SequenceSelectorProps {
  alert: AlertType;
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: Dispatch<
    SetStateAction<SequenceWithCameraInfoType | null>
  >;
}

export const SequenceSelector = ({
  selectedSequence,
  alert,
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

  const selectSequence = (newSequenceId: number) => {
    const newSelectedSequence = getSequenceBySequenceId(alert, newSequenceId);
    if (newSelectedSequence) {
      setSelectedSequence(newSelectedSequence);
    }
  };

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
        <List>
          {alert.sequences.map((sequence) => (
            <SelectableItemList
              selected={sequence.id == selectedSequence.id}
              itemId={sequence.id}
              onClick={selectSequence}
              key={sequence.id}
            >
              {sequence.camera && (
                <CameraName
                  camera={sequence.camera}
                  azimuth={sequence.azimuth}
                />
              )}
            </SelectableItemList>
          ))}
        </List>
      </Popover>
    </>
  );
};

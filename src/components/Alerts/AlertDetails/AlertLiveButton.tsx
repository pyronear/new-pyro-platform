import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { ControlAccessLiveContainer } from '../../Live/ControlAccessLiveContainer';

export const AlertLiveButton = () => {
  const { t } = useTranslationPrefix('alerts');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        startIcon={<SportsEsportsIcon />}
        sx={{
          '&.Mui-disabled': {
            background: '#c6c2c2',
            color: '#575757',
          },
        }}
        onClick={() => setOpen(true)}
      >
        {t('buttonInvestigate')}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ControlAccessLiveContainer />
      </Modal>
    </>
  );
};

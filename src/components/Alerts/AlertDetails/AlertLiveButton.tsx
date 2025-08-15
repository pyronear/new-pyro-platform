import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { LiveContainer } from '../../Live/LiveContainer';

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
        <Box
          minHeight={300}
          minWidth={'80%'}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
          }}
        >
          <LiveContainer onClose={() => setOpen(false)} />
        </Box>
      </Modal>
    </>
  );
};

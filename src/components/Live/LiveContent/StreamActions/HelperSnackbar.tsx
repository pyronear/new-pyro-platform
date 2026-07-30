import { Alert, Snackbar, Typography } from '@mui/material';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix.ts';

interface HelperSnackbarProps {
  open: boolean;
  handleClose: () => void;
}

export const HelperSnackbar = ({ open, handleClose }: HelperSnackbarProps) => {
  const { t } = useTranslationPrefix('live');

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      sx={{
        '&.MuiSnackbar-root': { position: 'absolute', left: 0, bottom: 0 },
      }}
    >
      <Alert severity="info" onClose={handleClose}>
        <Typography>{t('clickToMoveHint')}</Typography>
      </Alert>
    </Snackbar>
  );
};

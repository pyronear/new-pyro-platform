import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { HistoryExportModal } from './HistoryExportModal';

export const HistoryExport = () => {
  const { t } = useTranslationPrefix('history.export');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack spacing={1}>
        <Typography variant="h2">{t('title')}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          {t('button')}
        </Button>
      </Stack>
      <HistoryExportModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

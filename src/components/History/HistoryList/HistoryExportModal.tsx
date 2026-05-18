import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import i18n from '@/i18n';
import { exportAlerts } from '@/services/alerts';
import {
  formatDateToApi,
  getLocalizedDateFormat,
  getNowMinusOneYear,
} from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface HistoryExportModalType {
  open: boolean;
  onClose: () => void;
}

const triggerCsvDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const HistoryExportModal = ({
  open,
  onClose,
}: HistoryExportModalType) => {
  const { t } = useTranslationPrefix('history.export');
  const oneYearAgo = getNowMinusOneYear();
  const [fromDate, setFromDate] = useState<PickerValue>(null);
  const [toDate, setToDate] = useState<PickerValue>(null);

  const { mutate, reset, isPending, isError } = useMutation({
    mutationFn: ({
      fromDateStr,
      toDateStr,
    }: {
      fromDateStr: string;
      toDateStr: string;
    }) => exportAlerts(fromDateStr, toDateStr),
    onSuccess: (blob, { fromDateStr, toDateStr }) => {
      triggerCsvDownload(blob, `alerts-${fromDateStr}-to-${toDateStr}.csv`);
      onClose();
    },
  });

  useEffect(() => {
    if (open) {
      setFromDate(null);
      setToDate(null);
      reset();
    }
  }, [open, reset]);

  const handleConfirm = () => {
    if (!fromDate || !toDate) return;
    mutate({
      fromDateStr: formatDateToApi(fromDate),
      toDateStr: formatDateToApi(toDate),
    });
  };

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const dateFormat = getLocalizedDateFormat(i18n.language);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('modal.title')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2">{t('modal.description')}</Typography>
          <DatePicker
            label={t('modal.fromDate')}
            sx={{ width: '100%' }}
            disableFuture
            minDate={oneYearAgo}
            maxDate={toDate ?? undefined}
            value={fromDate}
            onChange={setFromDate}
            format={dateFormat}
          />
          <DatePicker
            label={t('modal.toDate')}
            sx={{ width: '100%' }}
            disableFuture
            minDate={fromDate ?? oneYearAgo}
            value={toDate}
            onChange={setToDate}
            format={dateFormat}
          />
          {isError && (
            <Alert severity="error" sx={{ margin: 0 }}>
              {t('modal.errorMessage')}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {t('modal.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!fromDate || !toDate}
          loading={isPending}
        >
          {t('modal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

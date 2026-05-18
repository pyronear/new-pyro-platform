import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';

import i18n from '@/i18n';
import { exportAlertsCsv } from '@/services/alerts';
import { getDateFormat } from '@/utils/dateFormat';
import { formatDateToApi, getNowMinusOneYear } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

const triggerCsvDownload = (
  blob: Blob,
  filename: string,
  documentRef: Document = document
) => {
  const url = URL.createObjectURL(blob);
  const link = documentRef.createElement('a');
  link.href = url;
  link.download = filename;
  documentRef.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const HistoryExportCsv = () => {
  const { t } = useTranslationPrefix('history.export');
  const oneYearAgo = getNowMinusOneYear();
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<DateTime | null>(null);
  const [toDate, setToDate] = useState<DateTime | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isDateRangeInvalid = useMemo(
    () => !!fromDate && !!toDate && toDate < fromDate,
    [fromDate, toDate]
  );

  const isDownloadDisabled =
    !fromDate || !toDate || isDateRangeInvalid || isDownloading;

  const handleClose = () => {
    if (!isDownloading) {
      setIsOpen(false);
      setHasError(false);
    }
  };

  const handleDownload = async () => {
    if (!fromDate || !toDate || isDateRangeInvalid) {
      return;
    }

    setIsDownloading(true);
    setHasError(false);

    const formattedFromDate = formatDateToApi(fromDate);
    const formattedToDate = formatDateToApi(toDate);

    try {
      const response = await exportAlertsCsv(
        formattedFromDate,
        formattedToDate
      );

      triggerCsvDownload(
        response.data,
        `alerts_${formattedFromDate}_${formattedToDate}.csv`
      );
      setIsOpen(false);
    } catch {
      setHasError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Stack spacing={1}>
        <Typography variant="h3">{t('title')}</Typography>
        <Typography variant="subtitle2">{t('description')}</Typography>
        <Button variant="outlined" onClick={() => setIsOpen(true)}>
          {t('button')}
        </Button>
      </Stack>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{t('modalTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <Typography variant="subtitle1">{t('modalDescription')}</Typography>
            <DatePicker
              label={t('fromDateField')}
              disableFuture
              minDate={oneYearAgo}
              maxDate={toDate ?? undefined}
              value={fromDate}
              onChange={setFromDate}
              format={getDateFormat(i18n.language)}
            />
            <DatePicker
              label={t('toDateField')}
              disableFuture
              minDate={fromDate ?? oneYearAgo}
              value={toDate}
              onChange={setToDate}
              format={getDateFormat(i18n.language)}
            />
            {isDateRangeInvalid && (
              <Typography color="error">{t('dateRangeError')}</Typography>
            )}
            {hasError && (
              <Typography color="error">{t('downloadError')}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDownloading}>
            {t('cancelButton')}
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleDownload()}
            loading={isDownloading}
            disabled={isDownloadDisabled}
          >
            {t('downloadButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

import { Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { useState } from 'react';

import i18n from '@/i18n';
import { getLocalizedDateFormat, getNowMinusOneYear } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import type { FiltersType } from '../../../utils/history';

interface HistoryFiltersType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

export const HistoryFilters = ({ filters, setFilters }: HistoryFiltersType) => {
  const { t } = useTranslationPrefix('history');
  const oneYearAgo = getNowMinusOneYear();
  const [currentValue, setCurrentValue] = useState<PickerValue>(filters.date);

  return (
    <Stack spacing={1}>
      <Typography variant="h2">{t('title')}</Typography>
      {/* Properly localized DatePicker thanks to DateLocalizationProvider in App.tsxs */}
      <DatePicker
        label={t('dateField')}
        sx={{ width: '100%' }}
        disableFuture
        minDate={oneYearAgo}
        value={currentValue}
        onChange={setCurrentValue}
        onAccept={(newValue, context) => {
          if (context.source === 'view') {
            // Triggers only if a date is selected with the calendar modal
            setFilters({
              ...filters,
              date: newValue,
            });
          }
        }}
        slotProps={{
          textField: {
            onBlur: () =>
              setFilters({
                ...filters,
                date: currentValue,
              }),
          },
        }}
        format={getLocalizedDateFormat(i18n.language)}
      />
    </Stack>
  );
};

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { useState } from 'react';

import i18n from '@/i18n';
import { getDateFormat } from '@/utils/dateFormat';
import { getNowMinusOneYear } from '@/utils/dates';
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
    // Properly localized DatePicker thanks to DateLocalizationProvider in App.tsxs
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
      format={getDateFormat(i18n.language)}
    />
  );
};

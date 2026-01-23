import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { useState } from 'react';

import i18n from '@/i18n';
import { getNowMinusOneYear } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import type { FiltersType } from '../../../utils/history';

interface HistoryFiltersType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const getDateFormat = (locale: string) => {
  switch (locale) {
    case 'fr':
    case 'es':
      return 'dd/MM/yyyy';
    case 'en':
    default:
      return 'MM/dd/yyyy';
  }
};

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

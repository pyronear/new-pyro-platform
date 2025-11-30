import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment/min/moment-with-locales';

import i18n from '@/i18n';
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
      return 'DD/MM/YYYY';
    case 'en':
    default:
      return 'MM/DD/YYYY';
  }
};

export const HistoryFilters = ({ filters, setFilters }: HistoryFiltersType) => {
  const { t } = useTranslationPrefix('history');
  const oneYearAgo = moment().subtract(1, 'year');

  return (
    // Properly localized DatePicker thanks to DateLocalizationProvider in App.tsxs
    <DatePicker
      label={t('dateField')}
      sx={{ width: '100%' }}
      disableFuture
      minDate={oneYearAgo}
      value={filters.date}
      onChange={(newValue) => setFilters({ ...filters, date: newValue })}
      format={getDateFormat(i18n.language)}
    />
  );
};

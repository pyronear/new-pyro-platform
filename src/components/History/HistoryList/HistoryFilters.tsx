import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import type { FiltersType } from '../../../utils/history';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface HistoryFiltersType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const getDateFormat = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'MM/DD/YYYY';
    case 'fr':
    case 'es':
      return 'DD/MM/YYYY';
    // TODO: traiter le cas général ? (en-US...)
    default:
      return 'DD/MM/YYYY';
  }
};

export const HistoryFilters = ({ filters, setFilters }: HistoryFiltersType) => {
  const { t } = useTranslationPrefix('history');
  const oneYearAgo = moment().subtract(1, 'year');

  const { i18n } = useTranslation();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={t('dateField')}
        sx={{ width: '100%' }}
        disableFuture
        minDate={oneYearAgo}
        value={filters.date}
        onChange={(newValue) => setFilters({ ...filters, date: newValue })}
        format={getDateFormat(i18n.language)}
      />
    </LocalizationProvider>
  );
};

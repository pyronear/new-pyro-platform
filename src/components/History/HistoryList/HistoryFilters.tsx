import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment-timezone';

import type { FiltersType } from '../../../utils/history';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface HistoryFiltersType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

export const HistoryFilters = ({ filters, setFilters }: HistoryFiltersType) => {
  const { t } = useTranslationPrefix('history');
  const oneYearAgo = moment().subtract(1, 'year');

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={t('dateField')}
        sx={{ width: '100%' }}
        disableFuture
        minDate={oneYearAgo}
        value={filters.date}
        onChange={(newValue) => setFilters({ ...filters, date: newValue })}
      />
    </LocalizationProvider>
  );
};

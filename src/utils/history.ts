import type { PickerValue } from '@mui/x-date-pickers/internals';

export interface FiltersType {
  date: PickerValue | null;
}

export const INITIAL_FILTERS = {
  date: null,
};

export const isFiltersEmpty = (filters: FiltersType) => {
  return !filters.date;
};

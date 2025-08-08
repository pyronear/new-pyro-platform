import { Grid, Typography } from '@mui/material';

import type { FiltersType } from '../../../pages/HistoryPage';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface HistoryFiltersType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HistoryFilters = ({ filters, setFilters }: HistoryFiltersType) => {
  const { t } = useTranslationPrefix('history');

  return (
    <Grid direction="column">
      <Grid>
        <Typography variant="h2">{t('dateField')}</Typography>
      </Grid>
    </Grid>
  );
};

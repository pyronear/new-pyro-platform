import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { HistoryContainer } from '../components/History/HistoryContainer';
import { getSequencesByFilters } from '../services/alerts';
import {
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../services/axios';
import { getCameraList } from '../services/camera';
import { type AlertType, convertSequencesToAlerts } from '../utils/alerts';
import {
  type FiltersType,
  INITIAL_FILTERS,
  isFiltersEmpty,
} from '../utils/history';

const HISTORY_NB_ALERTS_PER_PAGE = import.meta.env
  .VITE_HISTORY_NB_ALERTS_PER_PAGE;

export const HistoryPage = () => {
  const [filters, setFilters] = useState<FiltersType>(INITIAL_FILTERS);
  const isQuerySequencesEnabled = useMemo(
    () => !isFiltersEmpty(filters),
    [filters]
  );
  const { status: statusSequences, data: sequenceList } = useQuery({
    enabled: isQuerySequencesEnabled,
    queryKey: ['sequenceList', filters],
    queryFn: async () => {
      // TODO : do pagination
      return await getSequencesByFilters(
        filters.date?.format('YYYY-MM-DD') ?? '',
        HISTORY_NB_ALERTS_PER_PAGE,
        0
      );
    },
    refetchOnWindowFocus: false,
  });

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
    refetchOnWindowFocus: false,
  });

  const alertsList: AlertType[] = useMemo(() => {
    return convertSequencesToAlerts(sequenceList ?? [], cameraList ?? []);
  }, [sequenceList, cameraList]);

  const status = useMemo(() => {
    if (
      (statusSequences == STATUS_SUCCESS || !isQuerySequencesEnabled) &&
      statusCameras == STATUS_SUCCESS
    ) {
      return STATUS_SUCCESS;
    }
    if (
      (isQuerySequencesEnabled && statusSequences == STATUS_LOADING) ||
      statusCameras == STATUS_LOADING
    ) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusSequences, statusCameras, isQuerySequencesEnabled]);

  return (
    <HistoryContainer
      isQuerySequencesEnabled={isQuerySequencesEnabled}
      filters={filters}
      setFilters={setFilters}
      status={status}
      alertsList={alertsList}
    />
  );
};

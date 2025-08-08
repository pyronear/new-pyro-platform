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

export interface FiltersType {
  date: string | null;
}

const INITIAL_FILTERS = {
  date: null,
};

export const HistoryPage = () => {
  const [filters, setFilters] = useState<FiltersType>(INITIAL_FILTERS);
  const { status: statusSequences, data: sequenceList } = useQuery({
    queryKey: ['sequenceList', filters],
    queryFn: async () => {
      if (!filters.date) {
        // TODO : create a method isFiltersEmpty
        return [];
      }
      return await getSequencesByFilters(filters);
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
    if (statusSequences == STATUS_SUCCESS && statusCameras == STATUS_SUCCESS) {
      return STATUS_SUCCESS;
    }
    if (statusSequences == STATUS_LOADING || statusCameras == STATUS_LOADING) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusSequences, statusCameras]);

  return (
    <HistoryContainer
      filters={filters}
      setFilters={setFilters}
      status={status}
      alertsList={alertsList}
    />
  );
};

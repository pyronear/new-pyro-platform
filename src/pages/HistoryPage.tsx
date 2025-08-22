import { useQuery } from '@tanstack/react-query';
import moment from 'moment-timezone';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { date: dateParam, alert: alertParam } = useParams<{
    date: string;
    alert: string;
  }>();
  const navigate = useNavigate();

  // Initialize filters based on URL parameter
  const initialFilters = useMemo(() => {
    if (dateParam && moment(dateParam, 'YYYY-MM-DD', true).isValid()) {
      return {
        date: moment(dateParam, 'YYYY-MM-DD'),
      };
    }
    return INITIAL_FILTERS;
  }, [dateParam]);

  const [filters, setFilters] = useState<FiltersType>(initialFilters);

  // Update filters when URL parameter changes
  useEffect(() => {
    if (dateParam && moment(dateParam, 'YYYY-MM-DD', true).isValid()) {
      const newDate = moment(dateParam, 'YYYY-MM-DD');
      setFilters((prev) => ({ ...prev, date: newDate }));
    } else if (!dateParam) {
      setFilters(INITIAL_FILTERS);
    }
  }, [dateParam]);

  // Custom setFilters that also updates the URL
  const handleSetFilters = (
    newFilters: FiltersType | ((prev: FiltersType) => FiltersType)
  ) => {
    const updatedFilters =
      typeof newFilters === 'function' ? newFilters(filters) : newFilters;
    setFilters(updatedFilters);

    // Update URL based on the new date (preserve alert if it exists)
    if (updatedFilters.date) {
      const dateStr = updatedFilters.date.format('YYYY-MM-DD');
      if (alertParam) {
        void navigate(`/history/${dateStr}/${alertParam}`, { replace: true });
      } else {
        void navigate(`/history/${dateStr}`, { replace: true });
      }
    } else {
      void navigate('/history', { replace: true });
    }
  };

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
      setFilters={handleSetFilters}
      status={status}
      alertsList={alertsList}
      selectedAlertId={alertParam ? parseInt(alertParam, 10) : undefined}
    />
  );
};

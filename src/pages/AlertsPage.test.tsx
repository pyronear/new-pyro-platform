import type { UseQueryOptions } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STATUS_SUCCESS } from '@/services/axios';

import { AlertsPage } from './AlertsPage';

type AlertsQueryOptions = UseQueryOptions & { queryKey: readonly unknown[] };
interface AlertsQueryResult {
  isFetching?: boolean;
  dataUpdatedAt?: number;
  status: string;
  data: unknown[];
}

const invalidateQueriesMock = vi.fn();
const useQueryMock =
  vi.fn<(options: AlertsQueryOptions) => AlertsQueryResult>();

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: AlertsQueryOptions) => useQueryMock(options),
  useQueryClient: () => ({ invalidateQueries: invalidateQueriesMock }),
}));

vi.mock('@/components/Alerts/AlertsContainer', () => ({
  AlertsContainer: () => <div data-testid="alerts-container" />,
}));

vi.mock('@/utils/useDetectNewSequences', () => ({
  useDetectNewSequences: () => ({ hasNewSequence: false }),
}));

describe('AlertsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useQueryMock.mockImplementation((options) => {
      if (options.queryKey[0] === 'unlabelledAlerts') {
        return {
          isFetching: false,
          dataUpdatedAt: 0,
          status: STATUS_SUCCESS,
          data: [],
        };
      }

      return {
        status: STATUS_SUCCESS,
        data: [],
      };
    });
  });

  it('keeps polling alerts while the tab is in the background', () => {
    render(<AlertsPage />);

    const alertsQueryOptions = useQueryMock.mock.calls.find(
      ([options]) => options.queryKey[0] === 'unlabelledAlerts'
    )?.[0];

    if (!alertsQueryOptions) {
      throw new Error('Alerts query options were not found');
    }

    expect(alertsQueryOptions.refetchIntervalInBackground).toBe(true);
  });
});

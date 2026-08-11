import type { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AlertTypeApi } from '@/services/alerts';

const playSoundMock = vi.hoisted(() => vi.fn());
let token: string | null;
let queryResult: Pick<
  UseQueryResult<AlertTypeApi[]>,
  'data' | 'isFetchedAfterMount' | 'isSuccess'
>;

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => queryResult,
}));

vi.mock('@/context/useAuth', () => ({
  useAuth: () => ({ token }),
}));

vi.mock('./useAlertSoundToggle', () => ({
  useAlertSoundToggle: () => ({ playSound: playSoundMock }),
}));

import { AlertSoundMonitor } from './AlertSoundMonitor';

const alert = (id: number, startedAt: number): AlertTypeApi => ({
  id,
  organization_id: 1,
  lat: null,
  lon: null,
  started_at: new Date(startedAt).toISOString(),
  last_seen_at: new Date(startedAt).toISOString(),
  sequences: [],
});

const fetched = (alerts: AlertTypeApi[]) => ({
  data: alerts,
  isFetchedAfterMount: true,
  isSuccess: true,
});

describe('AlertSoundMonitor', () => {
  beforeEach(() => {
    token = 'session-a';
    playSoundMock.mockReset();
  });

  it('establishes a new baseline when the auth session changes', () => {
    const sessionAAlert = alert(1, Date.now() - 60_000);
    queryResult = fetched([sessionAAlert]);

    const { rerender } = render(<AlertSoundMonitor />);

    token = null;
    rerender(<AlertSoundMonitor />);

    token = 'session-b';
    queryResult = {
      data: [sessionAAlert],
      isFetchedAfterMount: false,
      isSuccess: false,
    };
    rerender(<AlertSoundMonitor />);

    queryResult = fetched([sessionAAlert]);
    rerender(<AlertSoundMonitor />);

    expect(playSoundMock).not.toHaveBeenCalled();

    queryResult = fetched([sessionAAlert, alert(2, Date.now() - 1_000)]);
    rerender(<AlertSoundMonitor />);

    expect(playSoundMock).toHaveBeenCalledOnce();
  });

  it('stays silent when the first fetch of a session fails', () => {
    queryResult = {
      data: undefined,
      isFetchedAfterMount: true,
      isSuccess: false,
    };

    const { rerender } = render(<AlertSoundMonitor />);

    queryResult = fetched([alert(1, Date.now() - 60_000)]);
    rerender(<AlertSoundMonitor />);

    expect(playSoundMock).not.toHaveBeenCalled();
  });
});

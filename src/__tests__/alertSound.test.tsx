import type { QueryClient } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type AlertTypeApi,
  UNLABELLED_ALERTS_QUERY_KEY,
} from '@/services/alerts';

const testState = vi.hoisted(() => ({
  queryClient: undefined as QueryClient | undefined,
}));
const getUnlabelledLatestAlertsMock = vi.hoisted(() => vi.fn());
const getCameraListMock = vi.hoisted(() => vi.fn());
const playSoundMock = vi.hoisted(() => vi.fn());

vi.mock('@/services/alerts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/alerts')>()),
  getUnlabelledLatestAlerts: getUnlabelledLatestAlertsMock,
}));

vi.mock('@/services/camera', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/camera')>()),
  getCameraList: getCameraListMock,
}));

vi.mock('@/components/Alerts/AlertsSound/useAlertSoundToggle', () => ({
  useAlertSoundToggle: () => ({ playSound: playSoundMock }),
}));

vi.mock('@/utils/useDetectNewSequences', () => ({
  useDetectNewSequences: (alerts: AlertTypeApi[]) => ({
    hasNewSequence: alerts.length > 0,
  }),
}));

vi.mock('@/components/Alerts/AlertsList/AlertsList', () => ({
  AlertsList: () => <div>Alerts list</div>,
}));

vi.mock('@/components/Alerts/AlertDetails/AlertContainer', () => ({
  AlertContainer: () => <div>Alert details</div>,
}));

vi.mock('@/components/Alerts/PyronearForestWatch', () => ({
  PyronearForestWatch: () => <div>No alerts</div>,
}));

vi.mock('@/components/Topbar/Topbar', async () => {
  const { useQueryClient } = await import('@tanstack/react-query');
  const { Link } = await import('react-router-dom');

  return {
    Topbar: () => {
      testState.queryClient = useQueryClient();
      return (
        <nav>
          <Link to="/alerts">Alerts</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      );
    },
  };
});

vi.mock('@/pages/DashboardPage', () => ({
  DashboardPage: () => <div>Dashboard page</div>,
}));

vi.mock('@/pages/HistoryPage', () => ({
  HistoryPage: () => <div>History page</div>,
}));

vi.mock('@/pages/AlertPage', () => ({
  AlertPage: () => <div>Alert page</div>,
}));

import App from '@/App';

const newAlert = (): AlertTypeApi => {
  const startedAt = new Date(Date.now() + 60_000).toISOString();

  return {
    id: 1,
    organization_id: 1,
    lat: null,
    lon: null,
    started_at: startedAt,
    last_seen_at: startedAt,
    sequences: [],
  };
};

const refetchActiveAlerts = async () => {
  if (!testState.queryClient) {
    throw new Error('Query client was not captured');
  }

  await act(async () => {
    await testState.queryClient?.refetchQueries({
      queryKey: UNLABELLED_ALERTS_QUERY_KEY,
      type: 'active',
    });
  });
};

describe('audible alerts', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
    window.history.pushState({}, '', '/alerts');
    getUnlabelledLatestAlertsMock.mockReset();
    getCameraListMock.mockReset();
    playSoundMock.mockReset();
    getUnlabelledLatestAlertsMock.mockResolvedValue([]);
    getCameraListMock.mockResolvedValue([]);
  });

  afterEach(() => {
    testState.queryClient?.clear();
    testState.queryClient = undefined;
    localStorage.clear();
  });

  it('plays a sound for a new alert while the alerts page is open', async () => {
    render(<App />);
    await waitFor(() =>
      expect(getUnlabelledLatestAlertsMock).toHaveBeenCalled()
    );

    getUnlabelledLatestAlertsMock.mockResolvedValue([newAlert()]);
    await refetchActiveAlerts();

    expect(getUnlabelledLatestAlertsMock).toHaveBeenCalledTimes(2);
    expect(
      testState.queryClient?.getQueryData(UNLABELLED_ALERTS_QUERY_KEY)
    ).toHaveLength(1);
    await waitFor(() => expect(playSoundMock).toHaveBeenCalledOnce());
  });

  it('plays a sound for a new alert after navigating to another page', async () => {
    render(<App />);
    await waitFor(() =>
      expect(getUnlabelledLatestAlertsMock).toHaveBeenCalled()
    );

    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
    await screen.findByText('Dashboard page');

    getUnlabelledLatestAlertsMock.mockResolvedValue([newAlert()]);
    await refetchActiveAlerts();

    await waitFor(() => expect(playSoundMock).toHaveBeenCalledOnce());
  });
});

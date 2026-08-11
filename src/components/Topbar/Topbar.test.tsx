import { fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AlertTypeApi } from '../../services/alerts';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Topbar } from './Topbar';

let isMobileMock = false;
let unlabelledAlertsMock: AlertTypeApi[] = [];

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: () => isMobileMock,
  };
});

vi.mock('../../services/alerts', async () => {
  const actual = await vi.importActual<typeof import('../../services/alerts')>(
    '../../services/alerts'
  );
  return {
    ...actual,
    getUnlabelledLatestAlerts: () => Promise.resolve(unlabelledAlertsMock),
  };
});

vi.mock('../../context/useAuth', () => ({
  useAuth: () => ({ token: 'mock-token' }),
}));

vi.mock('../../utils/useTranslationPrefix', () => ({
  useTranslationPrefix: () => ({
    t: (key: string) => key,
  }),
}));

describe('Topbar', () => {
  beforeEach(() => {
    isMobileMock = false;
    unlabelledAlertsMock = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders DesktopTopbar on desktop', () => {
    isMobileMock = false;
    renderWithProviders(<Topbar />);
    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.queryByLabelText('menuLabel')).not.toBeInTheDocument();
  });

  it('renders MobileTopbar on mobile', () => {
    isMobileMock = true;
    renderWithProviders(<Topbar />);
    expect(screen.queryByText('dashboard')).not.toBeInTheDocument();
    expect(screen.getByLabelText('menuLabel')).toBeInTheDocument();

    const menuButton = screen.getByLabelText('menuLabel');
    fireEvent.click(menuButton);

    expect(screen.queryByText('dashboard')).toBeInTheDocument();
  });

  it('shows the unlabelled alerts count on the mobile menu button', async () => {
    isMobileMock = true;
    unlabelledAlertsMock = [alertStartedNow(1), alertStartedNow(2)];
    renderWithProviders(<Topbar />);

    expect(
      await screen.findByLabelText('menuLabelWithAlerts')
    ).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders preferences button on desktop', () => {
    isMobileMock = false;
    renderWithProviders(<Topbar />);
    const preferencesButton = screen.getByTestId('ManageAccountsIcon');
    expect(preferencesButton).toBeInTheDocument();
  });

  it('opens preferences menu when settings button is clicked on desktop', () => {
    isMobileMock = false;
    renderWithProviders(<Topbar />);

    const preferencesButton = screen.getByTestId('ManageAccountsIcon');
    if (preferencesButton.parentElement) {
      fireEvent.click(preferencesButton.parentElement);
    }

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

const alertStartedNow = (id: number): AlertTypeApi => ({
  id,
  started_at: DateTime.utc().toISO({ includeOffset: false }),
  sequences: [],
  organization_id: 0,
  lat: null,
  lon: null,
  last_seen_at: '',
});

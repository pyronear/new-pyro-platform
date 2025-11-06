import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/renderWithProviders';
import { Topbar } from './Topbar';

let isMobileMock = false;

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: () => isMobileMock,
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
    fireEvent.click(preferencesButton.parentElement!);

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders preferences option in mobile drawer', () => {
    isMobileMock = true;
    renderWithProviders(<Topbar />);

    const menuButton = screen.getByLabelText('menuLabel');
    fireEvent.click(menuButton);

    expect(screen.getByTestId('ManageAccountsIcon')).toBeInTheDocument();
  });

  it('opens preferences menu when settings is clicked in mobile drawer', () => {
    isMobileMock = true;
    renderWithProviders(<Topbar />);

    const menuButton = screen.getByLabelText('menuLabel');
    fireEvent.click(menuButton);

    const settingsIcon = screen.getByTestId('ManageAccountsIcon');
    fireEvent.click(settingsIcon.closest('li') as HTMLElement);

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

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
    expect(screen.queryByLabelText('menu')).not.toBeInTheDocument();
  });

  it('renders MobileTopbar on mobile', () => {
    isMobileMock = true;
    renderWithProviders(<Topbar />);
    expect(screen.queryByText('dashboard')).not.toBeInTheDocument();
    expect(screen.getByLabelText('menu')).toBeInTheDocument();

    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);

    expect(screen.queryByText('dashboard')).toBeInTheDocument();
  });
});

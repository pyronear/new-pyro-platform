import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import type { AuthProviderProps } from 'react-oidc-context';

vi.mock('react-oidc-context', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-oidc-context')>()),
  withAuthenticationRequired: (
    _component: ComponentType,
    options: { OnRedirecting: ComponentType }
  ) => options.OnRedirecting,
  AuthProvider: ({ children }: AuthProviderProps) => children,
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    events: { addAccessTokenExpired: () => () => undefined },
  }),
}));

import App from '../App';

describe('App', () => {
  it('renders the Keycloak redirect screen without crashing', () => {
    render(<App />);
    expect(screen.getByText('Redirection in progress')).toBeInTheDocument();
  });
});

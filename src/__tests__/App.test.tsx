import { render, screen, waitFor } from '@testing-library/react';
import { UserManager } from 'oidc-client-ts';

import App from '../App';

describe('App', () => {
  it('redirects to Keycloak when there is no session', async () => {
    const signinRedirect = vi
      .spyOn(UserManager.prototype, 'signinRedirect')
      // A real redirect leaves the page, so its promise never settles
      .mockReturnValue(new Promise(() => undefined));

    render(<App />);

    await waitFor(() => expect(signinRedirect).toHaveBeenCalledOnce());
    expect(screen.getByText('Redirection in progress')).toBeInTheDocument();
  });
});

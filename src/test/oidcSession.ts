// AuthProvider decodes the access token of the session, so it has to be a well-formed JWT.
const ACCESS_TOKEN = `header.${btoa(
  JSON.stringify({ preferred_username: 'agent', roles: ['viewer'] })
)
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')}.signature`;

// Where oidc-client-ts looks for the session of the Keycloak client set in setupTests.
const OIDC_USER_STORAGE_KEY =
  'oidc.user:https://example.com/auth:pyro-platform';

export const seedOidcSession = () => {
  sessionStorage.setItem(
    OIDC_USER_STORAGE_KEY,
    JSON.stringify({
      access_token: ACCESS_TOKEN,
      token_type: 'Bearer',
      profile: { sub: '2' },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    })
  );
};

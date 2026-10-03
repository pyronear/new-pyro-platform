import { User } from 'oidc-client-ts';
import { describe, expect, it } from 'vitest';

import { extractRoles, extractUsername } from './token';

const createUser = (payload: unknown) =>
  new User({
    access_token: `e30.${btoa(
      String.fromCharCode(...new TextEncoder().encode(JSON.stringify(payload)))
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')}.signature`,
    token_type: 'Bearer',
    profile: {
      sub: 'keycloak-user',
      iss: 'http://localhost:9310/realms/pyronear',
      aud: 'new-pyro-platform',
      exp: 2000000000,
      iat: 1900000000,
    },
  });

describe('Keycloak access token claims', () => {
  it('reads the username and feature roles emitted by the Pyronear realm', () => {
    const user = createUser({
      preferred_username: 'test77',
      realm_access: {
        roles: [
          'default-roles-pyronear',
          'F001_LIVESTREAMING',
          'F002_OCCLUSION_MASK',
        ],
      },
      resource_access: { account: { roles: ['view-profile'] } },
    });

    expect(extractUsername(user)).toBe('test77');
    expect(extractRoles(user)).toEqual([
      'default-roles-pyronear',
      'F001_LIVESTREAMING',
      'F002_OCCLUSION_MASK',
    ]);
  });

  it('decodes Unicode usernames from base64url tokens', () => {
    expect(
      extractUsername(createUser({ preferred_username: 'Éléonore' }))
    ).toBe('Éléonore');
  });

  it('does not grant realm permissions from unrelated claims', () => {
    const user = createUser({
      preferred_username: 'test07',
      roles: ['F001_LIVESTREAMING'],
      resource_access: {
        account: { roles: ['F002_OCCLUSION_MASK'] },
      },
    });

    expect(extractUsername(user)).toBe('test07');
    expect(extractRoles(user)).toEqual([]);
  });

  it.each([undefined, null])('handles an absent user (%s)', (user) => {
    expect(extractUsername(user)).toBeNull();
    expect(extractRoles(user)).toEqual([]);
  });

  it.each([{}, { realm_access: {} }])(
    'handles missing claims (%j)',
    (payload) => {
      const user = createUser(payload);

      expect(extractUsername(user)).toBeNull();
      expect(extractRoles(user)).toEqual([]);
    }
  );

  it.each([
    null,
    { preferred_username: 77 },
    { realm_access: { roles: 'F001_LIVESTREAMING' } },
    { realm_access: { roles: ['F001_LIVESTREAMING', 1] } },
  ])('rejects malformed claims without crashing (%j)', (payload) => {
    const user = createUser(payload);

    expect(extractUsername(user)).toBeNull();
    expect(extractRoles(user)).toEqual([]);
  });

  it('handles an invalid JWT without crashing', () => {
    const user = createUser({});
    user.access_token = 'invalid-token';

    expect(extractUsername(user)).toBeNull();
    expect(extractRoles(user)).toEqual([]);
  });
});

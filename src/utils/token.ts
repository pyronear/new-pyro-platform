import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { User } from 'oidc-client-ts';

export interface PyroJwtPayload extends JwtPayload {
  username: string;
  roles: string[];
}

export type Role = 'F001' | 'F002' | 'F003';

const extractAccessToken = (user: User) => {
  return jwtDecode<PyroJwtPayload>(user.access_token);
};

export const extractRoles = (user?: User | null) => {
  let accessToken;
  if (user) {
    accessToken = extractAccessToken(user);
  }
  return accessToken?.roles ?? [];
};

export const extractUsername = (user?: User | null): string | null => {
  let accessToken;
  if (user) {
    accessToken = extractAccessToken(user);
  }
  return accessToken?.username ?? null;
};

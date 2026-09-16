import { jwtDecode, type JwtPayload } from 'jwt-decode';

export interface PyroJwtPayload extends JwtPayload {
  scopes: string[];
}

export type Profil = 'agent' | 'user';

export const extractAccessToken = (token: string) => {
  return jwtDecode<PyroJwtPayload>(token);
};

export const calculateProfil = (token: string): Profil => {
  const scopes = extractAccessToken(token).scopes;
  return scopes.includes('agent') ? 'agent' : 'user';
};

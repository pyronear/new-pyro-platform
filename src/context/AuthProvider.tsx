import type { User } from 'oidc-client-ts';
import React, { type PropsWithChildren, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AuthProvider as AuthProviderOidc,
  type AuthProviderProps,
  useAuth,
} from 'react-oidc-context';

import appConfig from '@/services/appConfig';
import { extractRoles, extractUsername, type Role } from '@/utils/token';

import { resetTokenOnAxios, setTokenOnAxios } from '../services/axios';
import { clearAuthToken, setAuthToken } from '../utils/authToken';
import { AuthContext, type AuthContextType } from './AuthContext';

const oidcConfig = (locale: string): AuthProviderProps => {
  return {
    authority: appConfig.getConfig().KEYCLOAK_URL,
    client_id: appConfig.getConfig().KEYCLOAK_CLIENT_ID,
    redirect_uri: appConfig.getConfig().KEYCLOAK_REDIRECT_URI,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSigninCallback: (_user: User | undefined): void => {
      // Permet de supprimer les éléments d'authent dans l'url (fausse react router)
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    extraQueryParams: { ui_locales: locale },
  };
};

const CustomAuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth();
  const isLoggedIn = useMemo(() => {
    return auth.isAuthenticated;
  }, [auth.isAuthenticated]);

  const props: AuthContextType = useMemo(
    () => ({
      isLoggedIn: isLoggedIn,
      username: extractUsername(auth.user),
      hasRole: (roleToFind: Role) =>
        extractRoles(auth.user).includes(roleToFind),
    }),
    [auth.user, isLoggedIn]
  );

  useEffect(() => {
    // the `return` is important - addAccessTokenExpiring() returns a cleanup function
    return auth.events.addAccessTokenExpired(() => {
      console.info('Token expired, logout');
      void auth.signinSilent();
    });
  }, [auth]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      const token = auth.user.access_token;
      setTokenOnAxios(token);
      setAuthToken(token);
    } else {
      resetTokenOnAxios();
      clearAuthToken();
    }
  }, [auth.isAuthenticated, auth.user]);

  return <AuthContext value={props}>{children}</AuthContext>;
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  return (
    <AuthProviderOidc {...oidcConfig(i18n.language)}>
      <CustomAuthProvider>{children}</CustomAuthProvider>
    </AuthProviderOidc>
  );
};

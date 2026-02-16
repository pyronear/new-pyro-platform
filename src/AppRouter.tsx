import { withAuthenticationRequired } from 'react-oidc-context';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router';

import { AlertsPage } from '@/pages/AlertsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { LoadingPage } from '@/pages/LoadingPage';
import { TemplatePage } from '@/pages/TemplatePage';

export const DEFAULT_ROUTE = '/alerts';

const ProtectedRouterProvider = withAuthenticationRequired(RouterProvider, {
  OnRedirecting: () => <LoadingPage />,
});

const AppRoutes = () => {
  return createRoutesFromElements(
    <Route element={<TemplatePage />} errorElement={<ErrorPage />}>
      <Route index element={<Navigate to={DEFAULT_ROUTE} />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="*" element={<ErrorPage is404 />} />
    </Route>
  );
};

export const PyroRouterProvider = () => {
  return <ProtectedRouterProvider router={createBrowserRouter(AppRoutes())} />;
};

import { withAuthenticationRequired } from 'react-oidc-context';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router';

import { AlertPage } from '@/pages/AlertPage.tsx';
import { AlertsPage } from '@/pages/AlertsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { HistoryPage } from '@/pages/HistoryPage';
import LivestreamingPage from '@/pages/LivestreamingPage.tsx';
import { LoadingPage } from '@/pages/LoadingPage';
import { TemplatePage } from '@/pages/TemplatePage.tsx';

export const DEFAULT_ROUTE = '/alerts';

const ProtectedRouterProvider = withAuthenticationRequired(RouterProvider, {
  OnRedirecting: () => <LoadingPage />,
});

const AppRoutes = () => {
  return createRoutesFromElements(
    <Route element={<TemplatePage />} errorElement={<ErrorPage />}>
      <Route index element={<Navigate to={DEFAULT_ROUTE} />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route
        path="/alerts/livestreaming/:cameraName/alert/:alertId"
        element={<LivestreamingPage />}
      />
      <Route path="/alert/:alertId" element={<AlertPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/dashboard/livestreaming/:cameraName"
        element={<LivestreamingPage />}
      />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="*" element={<ErrorPage is404 />} />
    </Route>
  );
};

export const PyroRouterProvider = () => {
  return <ProtectedRouterProvider router={createBrowserRouter(AppRoutes())} />;
};

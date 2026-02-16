import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans-condensed/700.css';
import './i18n';
import 'leaflet/dist/leaflet.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PyroRouterProvider } from './AppRouter';
import { AuthProvider } from './context/AuthProvider';
import { DateLocalizationProvider } from './context/DateLocalizationProvider';
import { PreferencesProvider } from './context/PreferencesProvider';

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <DateLocalizationProvider>
            <PyroRouterProvider />;
          </DateLocalizationProvider>
        </PreferencesProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;

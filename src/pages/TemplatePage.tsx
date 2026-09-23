import { Stack } from '@mui/material';
import { Outlet } from 'react-router';

import { Topbar } from '@/components/Topbar/Topbar';
import { AlertSoundMonitor } from '@/components/Alerts/AlertsSound/AlertSoundMonitor.tsx';

export const TemplatePage = () => {
  return (
    <Stack height={'100vh'}>
      <Topbar />
      <AlertSoundMonitor />
      <Stack overflow={'hidden'} flexGrow={1}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

import { Stack } from '@mui/material';
import { Outlet } from 'react-router';

import { Topbar } from '@/components/Topbar/Topbar';

export const TemplatePage = () => {
  return (
    <Stack height={'100vh'}>
      <Topbar />
      <Stack overflow={'hidden'} flexGrow={1}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

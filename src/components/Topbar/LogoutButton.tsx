import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { useAuth } from 'react-oidc-context';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

export const LogoutButton = () => {
  const auth = useAuth();
  const { t } = useTranslationPrefix('login');

  return (
    <Button
      onClick={() => void auth.signoutSilent()}
      variant="contained"
      color="error"
      startIcon={<LogoutIcon />}
      sx={{
        height: '30px',
      }}
    >
      {t('logout')}
    </Button>
  );
};

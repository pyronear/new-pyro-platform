import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';

import { useAuth } from '../../context/useAuth';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';

export const LogoutButton = () => {
  const { logout } = useAuth();
  const { t } = useTranslationPrefix('login');

  return (
    <Button
      onClick={logout}
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

import ManageAccounts from '@mui/icons-material/ManageAccounts';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PreferencesMenu } from '@/components/Topbar/Preferences/PreferencesMenu';

export const PreferencesButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation('preferences');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: '#fff', border: 'solid 2px #fff' }}
        aria-label={t('iconAlt')}
      >
        <ManageAccounts />
      </IconButton>
      <PreferencesMenu anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
};

import ManageAccounts from '@mui/icons-material/ManageAccounts';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PreferencesMenu } from '@/components/Preferences/PreferencesMenu';

export const PreferencesButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

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
        sx={{ color: 'white' }}
        aria-label={t('preferences.settings')}
      >
        <ManageAccounts />
      </IconButton>

      <PreferencesMenu anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
};

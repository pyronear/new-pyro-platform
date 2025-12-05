import ManageAccounts from '@mui/icons-material/ManageAccounts';
import { IconButton, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PreferencesMenu } from '@/components/Topbar/Preferences/PreferencesMenu';

export const PreferencesButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
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
        sx={{
          color: theme.palette.primary.main,
          backgroundColor: '#fff',
          boxShadow:
            '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            backgroundColor: '#ffffffd7',
          },
        }}
        aria-label={t('iconAlt')}
        color="primary"
      >
        <ManageAccounts />
      </IconButton>
      <PreferencesMenu anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
};

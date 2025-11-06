import ManageAccounts from '@mui/icons-material/ManageAccounts';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import logo from '@/assets/logo.svg';
import { PreferencesMenu } from '@/components/Preferences/PreferencesMenu';

import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import LanguageSwitcher from './LanguageSwitcher';
import { NavigationLink } from './NavigationLink';

interface MobileTopbarDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const MobileTopbarDrawer = ({
  isOpen,
  handleClose,
}: MobileTopbarDrawerProps) => {
  const { t } = useTranslationPrefix('pages');
  const { t: tCommon } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePreferencesClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Drawer open={isOpen} onClose={handleClose} onClick={handleClose}>
        <div
          style={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: '1fr auto',
          }}
        >
          <Box>
            <img
              height="30px"
              src={logo}
              alt="Logo"
              style={{ margin: '12px' }}
            />
            <Divider sx={{ margin: 0 }} />
            <List>
              <ListItem>
                <NavigationLink path="/alerts" label={t('alerts')} />
              </ListItem>
              <ListItem>
                <NavigationLink path="/dashboard" label={t('dashboard')} />
              </ListItem>
              <ListItem>
                <NavigationLink path="/history" label={t('history')} />
              </ListItem>
              <ListItem
                onClick={handlePreferencesClick}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>
                  <ManageAccounts />
                </ListItemIcon>
                <ListItemText primary={tCommon('preferences.settings')} />
              </ListItem>
            </List>
          </Box>
          <div style={{ padding: '12px' }}>
            <LanguageSwitcher />
          </div>
        </div>
      </Drawer>

      <PreferencesMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
    </>
  );
};

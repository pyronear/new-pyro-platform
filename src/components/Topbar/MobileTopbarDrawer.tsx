import { Box, Divider, Drawer, List, ListItem, Stack } from '@mui/material';

import logo from '@/assets/logo.svg';

import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { LogoutButton } from '../Login/LogoutButton';
import { NavigationLink } from './NavigationLink';
import LanguageSwitcher from './Preferences/LanguageSwitcher';

interface MobileTopbarDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const MobileTopbarDrawer = ({
  isOpen,
  handleClose,
}: MobileTopbarDrawerProps) => {
  const { t } = useTranslationPrefix('pages');

  return (
    <Drawer open={isOpen} onClose={handleClose} onClick={handleClose}>
      <Stack
        justifyContent="space-between"
        style={{
          height: '100%',
        }}
      >
        <Box>
          <img height="30px" src={logo} alt="Logo" style={{ margin: '12px' }} />
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
          </List>
        </Box>
        <Stack p={2} spacing={4}>
          <LanguageSwitcher />

          <LogoutButton />
        </Stack>
      </Stack>
    </Drawer>
  );
};

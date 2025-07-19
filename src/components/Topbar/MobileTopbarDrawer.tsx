import { Box, Divider, Drawer, List, ListItem } from '@mui/material';

import logo from '../../assets/logo.svg';
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

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box onClick={handleClose}>
          <img height="30px" src={logo} alt="Logo" style={{ margin: '12px' }} />
          <Divider />
          <List>
            <ListItem>
              <NavigationLink path="/dashboard" label={t('dashboard')} />
            </ListItem>
            <ListItem>
              <NavigationLink path="/alerts" label={t('alerts')} />
            </ListItem>
          </List>
        </Box>
        <div style={{ padding: '12px' }}>
          <LanguageSwitcher />
        </div>
      </div>
    </Drawer>
  );
};

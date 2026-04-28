import Check from '@mui/icons-material/Check';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { type Dispatch, type SetStateAction, useState } from 'react';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface AlertOrderButtonProps {
  orderDetectionsByDesc: boolean;
  setOrderDetectionsByDesc: Dispatch<SetStateAction<boolean>>;
}

export const AlertOrderButton = ({
  orderDetectionsByDesc,
  setOrderDetectionsByDesc,
}: AlertOrderButtonProps) => {
  const { t } = useTranslationPrefix('alerts.detectionsOrder');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label={t('buttonLabel')}
        size="large"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ transform: 'rotate(90deg)' }}
      >
        <SwapVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOrderDetectionsByDesc(false);
            handleClose();
          }}
        >
          <ListItemIcon>{!orderDetectionsByDesc && <Check />}</ListItemIcon>
          {t('recentFirst')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOrderDetectionsByDesc(true);
            handleClose();
          }}
        >
          <ListItemIcon>{orderDetectionsByDesc && <Check />}</ListItemIcon>
          {t('latestFirst')}
        </MenuItem>
      </Menu>
    </>
  );
};

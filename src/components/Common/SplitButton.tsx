import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';

export interface SplitButtonOption {
  label: string;
  onClick: () => void;
}

interface SplitButtonProps {
  options: SplitButtonOption[];
  startIcon?: ReactElement;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const SplitButton = ({
  options,
  startIcon,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
}: SplitButtonProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (option: SplitButtonOption) => {
    setOpen(false);
    option.onClick();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <>
      <ButtonGroup
        variant={variant}
        ref={anchorRef}
        aria-label="split button"
        disabled={disabled}
        size={size}
      >
        <Button startIcon={startIcon} onClick={() => options[0].onClick()}>
          {options[0].label}
        </Button>
        <Button
          size={'small'}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label={options[0].label}
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option) => (
                    <MenuItem
                      key={option.label}
                      onClick={() => handleMenuItemClick(option)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

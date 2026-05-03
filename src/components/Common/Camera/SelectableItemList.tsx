import VideocamIcon from '@mui/icons-material/Videocam';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import type { ReactNode } from 'react';

interface SelectableItemListProps {
  selected: boolean;
  itemId: number;
  onClick: (newItemId: number) => void;
  children: ReactNode;
}

export const SelectableItemList = ({
  selected,
  itemId,
  onClick,
  children,
}: SelectableItemListProps) => {
  return (
    <ListItem disablePadding disableGutters>
      <ListItemButton selected={selected} onClick={() => onClick(itemId)}>
        {selected && (
          <ListItemIcon>
            <VideocamIcon fontSize="small" />
          </ListItemIcon>
        )}

        <ListItemText inset={!selected}>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default SelectableItemList;

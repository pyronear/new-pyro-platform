import { Fab, type FabProps } from '@mui/material';

export const CustomFab = (props: FabProps) => {
  return (
    <Fab {...props} size="medium">
      {props.children}
    </Fab>
  );
};

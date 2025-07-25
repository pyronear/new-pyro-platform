import { Typography, useTheme } from '@mui/material';

interface CameraNameType {
  name: string;
  angle_of_view: number | null;
}
export const CameraName = ({ name, angle_of_view }: CameraNameType) => {
  const theme = useTheme();
  return (
    <Typography variant="body1">
      {name}
      {angle_of_view && (
        <span
          style={{ color: theme.palette.secondaryText.main }}
        >{` (${angle_of_view.toString()}°)`}</span>
      )}
    </Typography>
  );
};

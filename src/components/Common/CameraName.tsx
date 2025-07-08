import { Typography } from '@mui/material';

interface CameraNameType {
  name: string;
  angle_of_view: number | null;
}
export const CameraName = ({ name, angle_of_view }: CameraNameType) => {
  return (
    <Typography variant="body1">
      {name}
      {angle_of_view && (
        <span
          style={{ color: '#b9b6b6' }}
        >{` (${angle_of_view.toString()}°)`}</span>
      )}
    </Typography>
  );
};

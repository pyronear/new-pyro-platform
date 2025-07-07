import { Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

export const NavigationLink = (props: { path: string; label: string }) => {
  const { path, label } = props;
  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {/* Style prevent underline from <a> html default */}
      {({ isActive }) => (
        <Typography
          color="white"
          sx={{
            fontWeight: 500,
            fontSize: '1.2rem',
            textDecoration: isActive ? 'underline' : 'none',
          }}
        >
          {label}
        </Typography>
      )}
    </NavLink>
  );
};

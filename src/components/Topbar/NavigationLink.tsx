import { Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface NavigationLinkProps {
  path: string;
  label: string;
}

export const NavigationLink = ({ path, label }: NavigationLinkProps) => {
  const theme = useTheme();
  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {/* This style above prevents the default underline from the html tag <a> */}
      {({ isActive }) => (
        <Typography
          color={theme.palette.primary.contrastText}
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

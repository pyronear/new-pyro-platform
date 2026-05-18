import { Chip, Stack, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface NavigationLinkProps {
  badgeLabel?: string;
  path: string;
  label: string;
}

export const NavigationLink = ({
  badgeLabel,
  path,
  label,
}: NavigationLinkProps) => {
  const theme = useTheme();
  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {/* This style above prevents the default underline from the html tag <a> */}
      {({ isActive }) => (
        <Stack alignItems="center" spacing={0.25}>
          <Typography
            color={theme.palette.primary.contrastText}
            sx={{
              ...(isActive
                ? {
                    fontWeight: 500,
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: 1,
                  }
                : {}),
              padding: 1,
              fontSize: '1.2rem',
            }}
          >
            {label}
          </Typography>
          {badgeLabel && (
            <Chip
              color="error"
              label={badgeLabel}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 700,
              }}
            />
          )}
        </Stack>
      )}
    </NavLink>
  );
};

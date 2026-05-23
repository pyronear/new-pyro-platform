import { Badge, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface NavigationLinkProps {
  badgeContent?: number;
  badgeLabel?: string;
  path: string;
  label: string;
}

export const NavigationLink = ({
  badgeContent,
  badgeLabel,
  path,
  label,
}: NavigationLinkProps) => {
  const theme = useTheme();
  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {/* This style above prevents the default underline from the html tag <a> */}
      {({ isActive }) => (
        <Badge
          badgeContent={badgeContent}
          color="error"
          invisible={!badgeContent}
          title={badgeLabel}
          aria-label={badgeLabel}
          sx={{
            '& .MuiBadge-badge': {
              fontWeight: 700,
              right: 4,
              top: 6,
            },
          }}
        >
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
              fontSize: '1.2rem',
              px: badgeContent ? 2.25 : 1,
              py: 1,
            }}
          >
            {label}
          </Typography>
        </Badge>
      )}
    </NavLink>
  );
};

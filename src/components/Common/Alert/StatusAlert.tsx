import ClearIcon from '@mui/icons-material/Clear';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';

import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface StatusAlertsProps {
  isSmall?: boolean;
  isWildfire: boolean | null;
}

export const StatusAlert = ({
  isSmall = false,
  isWildfire,
}: StatusAlertsProps) => {
  const { t } = useTranslationPrefix('common.statusAlert');
  const theme = useTheme();

  const getLabel = () => {
    switch (isWildfire) {
      case null:
        return 'unset';
      case true:
        return 'wildfire';
      case false:
        return 'notWildfire';
    }
  };
  const getIcon = () => {
    switch (isWildfire) {
      case null:
        return <QuestionMarkIcon />;
      case true:
        return <LocalFireDepartmentIcon />;
      case false:
        return <ClearIcon />;
    }
  };

  const getColor = () => {
    switch (isWildfire) {
      case null:
        return 'default';
      case true:
        return 'error';
      case false:
        return 'secondary';
    }
  };

  return (
    <Chip
      icon={getIcon()}
      label={isSmall ? null : t(getLabel())}
      color={getColor()}
      variant="filled"
      size={isSmall ? 'small' : 'medium'}
      sx={{
        '& .MuiChip-label': {
          font: theme.typography.body1,
        },
      }}
    />
  );
};

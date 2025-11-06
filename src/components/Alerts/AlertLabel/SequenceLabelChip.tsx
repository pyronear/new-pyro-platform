import ClearIcon from '@mui/icons-material/Clear';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';

import type { LabelWildfireValues } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertIcon } from './AlertIcon/AlertIcon';

interface SequenceLabelChipProps {
  labelWildfire: LabelWildfireValues;
  isSmall?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}
export const SequenceLabelChip = ({
  isSmall = false,
  clickable = false,
  onClick = undefined,
  labelWildfire,
}: SequenceLabelChipProps) => {
  const { t } = useTranslationPrefix('alerts.label');
  const theme = useTheme();

  const getLabel = () => {
    switch (labelWildfire) {
      case null:
        return 'unset';
      case 'wildfire_smoke':
        return 'wildfire';
      case 'other_smoke':
        return 'otherSmoke';
      case 'other':
        return 'other';
    }
  };
  const getIcon = () => {
    switch (labelWildfire) {
      case null:
        return <QuestionMarkIcon />;
      case 'wildfire_smoke':
        return <AlertIcon iconPath="fire" />;
      case 'other_smoke':
        return <AlertIcon iconPath="smoke" />;
      case 'other':
        return <ClearIcon />;
    }
  };

  const getColor = () => {
    switch (labelWildfire) {
      case null:
        return 'default';
      case 'wildfire_smoke':
        return 'error';
      case 'other':
      case 'other_smoke':
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
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      sx={{
        '& .MuiChip-label': {
          font: theme.typography.body1,
        },
      }}
    />
  );
};

import ShareIcon from '@mui/icons-material/Share';
import { Button, Stack } from '@mui/material';

import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

export const AlertShare = () => {
  const { t } = useTranslationPrefix('alerts');
  return (
    <Stack justifyContent="end" direction="row" sx={{ display: 'none' }}>
      <Button variant="text" startIcon={<ShareIcon />}>
        {t('buttonShare')}
      </Button>
    </Stack>
  );
};

import { CircularProgress, Stack, Typography } from '@mui/material';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

export const LoadingPage = () => {
  const { t } = useTranslationPrefix('login');

  return (
    <Stack
      direction="row"
      p={4}
      justifyContent="center"
      alignItems="center"
      spacing={4}
      height="100%"
    >
      <CircularProgress size="50px" />
      <Typography fontSize="2rem" fontWeight="bold">
        {t('title')}
      </Typography>
    </Stack>
  );
};

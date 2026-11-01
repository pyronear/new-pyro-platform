import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

import { DEFAULT_ROUTE } from '@/AppRouter';
import logo from '@/assets/small-logo.png';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface ErrorPageProps {
  is404?: boolean;
}

export const ErrorPage = ({ is404 = false }: ErrorPageProps) => {
  const { t } = useTranslationPrefix('errorPages');
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      p={4}
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Stack>
        <img height="300px" src={logo} alt="Logo" />
      </Stack>
      <Stack spacing={2}>
        <Typography fontSize="2rem" fontWeight="bold">
          {t('title')}
        </Typography>
        <Typography variant="body2">
          {t(is404 ? 'notFoundMessage' : 'errorMessage')}
        </Typography>
        <div style={{ alignSelf: 'center' }}>
          <Button
            variant="contained"
            onClick={() => void navigate(DEFAULT_ROUTE)}
          >
            {t('button')}
          </Button>
        </div>
      </Stack>
    </Stack>
  );
};

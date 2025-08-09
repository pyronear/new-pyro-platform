import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { LoginError } from '../../services/auth';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';

const LoginForm = () => {
  const { login } = useAuth();
  const { t } = useTranslationPrefix('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      await navigate('dashboard');
    } catch (e) {
      if (e instanceof LoginError) {
        const localizedMessage = `errors.${e.code}`;
        setLoginError(localizedMessage);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
    >
      <Paper sx={{ p: 4, m: { xs: 2, md: 8 }, width: 400 }}>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <TextField
            label={t('username')}
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
            error={!!loginError}
          />
          <TextField
            label={t('password')}
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            error={!!loginError}
          />
          {loginError && <Typography color="error">{t(loginError)}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {t('button')}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;

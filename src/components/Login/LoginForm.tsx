import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
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

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const PasswordVisibilityToggle = (
    <IconButton
      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
      onClick={handleClickShowPassword}
      onMouseDown={(e) => e.preventDefault()}
      onMouseUp={(e) => e.preventDefault()}
      edge="end"
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );

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
      <Paper sx={{ p: 4, width: 400 }}>
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            error={!!loginError}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {PasswordVisibilityToggle}
                  </InputAdornment>
                ),
              },
            }}
          />
          {loginError && <Typography color="error">{t(loginError)}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            aria-label={t('button')}
          >
            {t('button')}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;

import { Box, Button, Paper, TextField } from '@mui/material';
import { type FormEvent, useState } from 'react';

import { useTranslationPrefix } from '../../hooks/useTranslationPrefix';

export default function LoginForm() {
  const { t } = useTranslationPrefix('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('username')}
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
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
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {t('button')}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

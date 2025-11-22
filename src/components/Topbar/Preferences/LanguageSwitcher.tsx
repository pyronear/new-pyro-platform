import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';
import React from 'react';

import de from '@/assets/languages/de.svg';
import es from '@/assets/languages/es.svg';
import fr from '@/assets/languages/fr.svg';
import gb from '@/assets/languages/gb.svg';
import { usePreferences } from '@/context/usePreferences';

const LanguageSwitcher: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();

  const handleChange = (event: SelectChangeEvent) => {
    updatePreferences({ language: event.target.value });
  };

  return (
    <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }}>
      <Select
        labelId="language-select-label"
        value={preferences.language}
        variant="outlined"
        onChange={handleChange}
        sx={(theme) => ({
          ...theme.typography.button,
          height: '30px',
        })}
      >
        <MenuItem value="en">
          <StackLanguage label="ENGLISH" icon={gb} />
        </MenuItem>
        <MenuItem value="fr">
          <StackLanguage label="FRANÇAIS" icon={fr} />
        </MenuItem>
        <MenuItem value="es">
          <StackLanguage label="ESPAÑOL" icon={es} />
        </MenuItem>
        <MenuItem value="de">
          <StackLanguage label="DEUTSCH" icon={de} />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const StackLanguage = (props: { icon: string; label: string }) => {
  const { icon, label } = props;
  return (
    <Stack alignItems="center" direction="row" gap={1}>
      <img src={icon} height="15px" /> {label}
    </Stack>
  );
};

export default LanguageSwitcher;

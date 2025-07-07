import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import es from '../../assets/languages/es.svg';
import fr from '../../assets/languages/fr.svg';
import gb from '../../assets/languages/gb.svg';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    void i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }}>
      <Select
        labelId="language-select-label"
        value={i18n.language}
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
      </Select>
    </FormControl>
  );
};

const StackLanguage = (props: { icon: string; label: string }) => {
  const { icon, label } = props;
  return (
    <Stack alignItems="center" direction="row" gap={1}>
      <img src={icon} height="15dp" /> {label}
    </Stack>
  );
};

export default LanguageSwitcher;

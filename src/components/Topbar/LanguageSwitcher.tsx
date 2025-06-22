import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;

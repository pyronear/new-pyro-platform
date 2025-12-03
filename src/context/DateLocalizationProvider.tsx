import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { deDE, enUS, esES, frFR } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const DateLocalizationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  const localeText = useMemo(() => {
    switch (i18n.language) {
      case 'fr':
        return frFR.components.MuiLocalizationProvider.defaultProps.localeText;

      case 'de':
        return deDE.components.MuiLocalizationProvider.defaultProps.localeText;

      case 'es':
        return esES.components.MuiLocalizationProvider.defaultProps.localeText;

      default:
        return enUS.components.MuiLocalizationProvider.defaultProps.localeText;
    }
  }, [i18n.language]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterLuxon}
      adapterLocale={i18n.language}
      localeText={localeText}
    >
      {children}
    </LocalizationProvider>
  );
};

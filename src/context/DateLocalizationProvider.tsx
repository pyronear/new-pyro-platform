import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment/min/moment-with-locales';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const DateLocalizationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  // Set global moment locale when language changes
  React.useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      adapterLocale={i18n.language}
      dateLibInstance={moment}
    >
      {children}
    </LocalizationProvider>
  );
};

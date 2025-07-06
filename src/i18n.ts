import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

export default i18n;

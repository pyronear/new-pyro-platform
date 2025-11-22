import i18n, { type ResourceLanguage } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationDE from './locales/de/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';

export type SupportedLocale = 'en' | 'fr' | 'es' | 'de';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  es: { translation: translationES },
  de: { translation: translationDE },
} satisfies Record<SupportedLocale, { translation: ResourceLanguage }>;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'fr', 'es', 'de'],
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

export default i18n;

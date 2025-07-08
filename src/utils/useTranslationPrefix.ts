import { useTranslation } from 'react-i18next';

export const useTranslationPrefix = (prefix: string) => {
  return useTranslation(undefined, { keyPrefix: prefix });
};

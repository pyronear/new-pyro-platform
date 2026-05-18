export const getDateFormat = (locale: string) => {
  switch (locale) {
    case 'fr':
    case 'es':
      return 'dd/MM/yyyy';
    case 'en':
    default:
      return 'MM/dd/yyyy';
  }
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
    },
    lng: 'ar', // Arabic only — English disabled
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

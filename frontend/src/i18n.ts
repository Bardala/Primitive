import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend) // load translation files
  .use(LanguageDetector) // detect browser language
  .use(initReactI18next) // connect with react
  .init({
    fallbackLng: 'en', // default language
    debug: true,
    interpolation: {
      escapeValue: false, // react already escapes
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // where files are
    },
  });

export default i18n;
